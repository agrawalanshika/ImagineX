# ImagineX 🎨✨  
An AI Image Generator using Stable Diffusion

ImagineX is a full-stack AI-powered image generation web application that converts text prompts into high-quality images using **Stable Diffusion v1.5**.  
The project runs locally using a FastAPI backend and a clean, interactive frontend, without relying on third-party image generation APIs.

---

## 🚀 Features

- 🖼️ Text-to-image generation using Stable Diffusion
- 🔢 Generate multiple images per prompt
- 📐 Aspect ratio selection (1:1, 16:9, 9:16)
- 🌙 Dark / Light mode toggle
- ⚡ Optimized for CPU-based inference
- 🎨 Modern and user-friendly UI
- 🔐 No external API dependency for generation

---

## 🧠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (Vanilla)

### Backend
- Python
- FastAPI
- PyTorch
- Hugging Face Diffusers
- Stable Diffusion v1.5
  
## 📁 Project Structure
ImagineX/
├── Frontend/
│ ├── index.html
│ ├── style.css
│ ├── script.js
│ ├── bg.jpg
│ └── icon2.jpg
│
├── Backend/
│ ├── backend.py
│ ├── requirements.txt
│
├── .gitignore
└── README.md


## ⚙️ How to Run the Project

### Backend Setup

```bash
cd Backend
pip install -r requirements.txt
uvicorn backend:app --reload
```

### Frontend Setup

- Open `Frontend/index.html` directly in your browser  
  **OR**
- Use **Live Server** extension in VS Code for a better experience

---

## ⏱ Performance Notes

- This project runs completely on **CPU** (no GPU required)
- First-time model loading may take several minutes
- Image generation takes approximately **40–60 seconds per image** on CPU
- When generating multiple images, they are processed **sequentially** to ensure stability

## 🔮 Future Improvements

- GPU acceleration for faster image generation
- Cloud deployment for public access
- Image history and gallery view
- Advanced prompt enhancement and upscaling
- User authentication and profile management
