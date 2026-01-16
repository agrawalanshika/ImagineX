from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from diffusers import StableDiffusionPipeline
import torch
import io
import base64
import threading

app = FastAPI()

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- GLOBALS --------------------
pipe = None
model_ready = False
generation_lock = threading.Lock()

print("🔄 Loading Stable Diffusion model (first time takes time)...")

try:
    pipe = StableDiffusionPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5",
        torch_dtype=torch.float32,
        safety_checker=None
    )
    pipe.to("cpu")
    pipe.enable_attention_slicing()
    model_ready = True
    print("✅ Model loaded successfully")

except Exception as e:
    print("❌ Model loading failed:", e)


# -------------------- IMAGE GENERATION --------------------
@app.post("/generate-image")
def generate_image(data: dict):

    if not model_ready:
        return JSONResponse(
            status_code=503,
            content={"error": "Model is still loading"}
        )

    try:
        prompt = data.get("prompt", "")
        num_images = int(data.get("num_images", 1))

        width = 384
        height = 384

        print(f"🎨 Generating {num_images} image(s)")

        with generation_lock:
            with torch.inference_mode():
                images = pipe(
                    prompt,
                    width=width,
                    height=height,
                    num_inference_steps=12,
                    num_images_per_prompt=num_images
                ).images

        encoded_images = []

        for img in images:
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            encoded_images.append(
                base64.b64encode(buf.getvalue()).decode("utf-8")
            )

        return JSONResponse(content={"images": encoded_images})

    except Exception as e:
        print("❌ Generation error:", e)
        return JSONResponse(
            status_code=500,
            content={"error": "Image generation failed"}
        )
