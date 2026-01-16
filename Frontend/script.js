document.addEventListener("DOMContentLoaded", () => {
  // Selecting all elements
  const themeToggle = document.querySelector(".theme-toggle");
  const promptForm = document.querySelector(".prompt-form");
  const promptInput = document.querySelector(".prompt-input");
  const promptBtn = document.querySelector(".prompt-btn");
  const generateBtn = document.querySelector(".generate-btn");
  const modelSelect = document.getElementById("model-select");
  const countSelect = document.getElementById("count-select");
  const ratioSelect = document.getElementById("ratio-select");
  const gridGallery = document.querySelector(".gallery-grid");

  const examplePrompts = [
    "A magic forest with glowing plants and fairy homes among giant mushrooms",
    "An old steampunk airship floating through golden clouds at sunset",
    "A future Mars colony with glass domes and gardens against red mountains",
    "A dragon sleeping on gold coins in a crystal cave",
    "An underwater kingdom with merpeople and glowing coral buildings",
    "A floating island with waterfalls pouring into clouds below",
    "A witch's cottage in fall with magic herbs in the garden",
    "A robot painting in a sunny studio with art supplies around it",
    "A magical library with floating glowing books and spiral staircases",
    "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
    "A cosmic beach with glowing sand and an aurora in the night sky",
    "A medieval marketplace with colorful tents and street performers",
    "A cyberpunk city with neon signs and flying cars at night",
    "A peaceful bamboo forest with a hidden ancient temple",
    "A giant turtle carrying a village on its back in the ocean",
  ];

  // Set theme based on saved preference or system default
  (() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    document.body.classList.toggle("dark-theme", isDarkTheme);

    if (themeToggle && themeToggle.querySelector("i")) {
      themeToggle.querySelector("i").className =
        isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  })();

  // Toggle theme handler
  const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");

    if (themeToggle && themeToggle.querySelector("i")) {
      themeToggle.querySelector("i").className =
        isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  };

  // Calculate width/height based on chosen ratio
  const getImageDimensions=(aspectRatio , baseSize =512)=>{
    const [width,height]=aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize/Math.sqrt(width*height);

    let calculateWidth = Math.round(width*scaleFactor);
    let calculateHeight=Math.round(height*scaleFactor);

    // Ensure dimensions are multiple of 16 (Ai model requirements)
    calculateWidth=Math.floor(calculateWidth/16)*16;
    calculateHeight=Math.floor(calculateHeight/16)*16;

    return {width: calculateWidth,height:calculateHeight};
  };

  // Replace loadimg spinner with actual image
   const updateImageCard=(imgIndex , imgURL)=>{
    const imgCard = document.getElementById(`img-card-${imgIndex}`);
    if(!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML=`<img src="${imgURL}" class="result-img">
                        <div class="img-overlay">
                            <a href="${imgURL}" class="img-download-btn" download="${Date.now()}.png">
                                <i class="fa-solid fa-download"></i>
                            </a>
                        </div>`;
   }

  // send requests to hugging face api to create images

  const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
  console.log("🚀 generateImages() called");

  const { width, height } = getImageDimensions(aspectRatio);

  generateBtn.setAttribute("disabled", "true");

  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    try {
      console.log("📡 Sending request to backend...");

      const response = await fetch("http://127.0.0.1:8000/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({

          prompt: promptText,
          num_images: imageCount
        })
      });

      console.log("📥 Response received:", response);

      if (!response.ok) {
        throw new Error("Generation failed with status " + response.status);
      }
const data = await response.json();

data.images.forEach((base64Img, i) => {
  const imgUrl = `data:image/png;base64,${base64Img}`;
  updateImageCard(i, imgUrl);
});

    } catch (error) {
      console.error("❌ Error in image generation:", error);
      const imgCard = document.getElementById(`img-card-${i}`);
      imgCard.classList.replace("loading", "error");
      imgCard.querySelector(".status-text").textContent =
        "Generation failed! Check backend.";
    }
  });

  await Promise.allSettled(imagePromises);
  generateBtn.removeAttribute("disabled");
};


  // create placholder cards with loading spinners
  const createImageCards=(selectedModel, imageCount, aspectRatio, promptText)=>{
    gridGallery.innerHTML = "";
    for(let i=0;i<imageCount;i++){
        gridGallery.innerHTML +=`<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}" >
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                    </div>`;
    }
    generateImages(selectedModel, imageCount, aspectRatio, promptText);
  };

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Get values
    const selectedModel = modelSelect ? modelSelect.value : "";
    const imageCount = countSelect ? parseInt(countSelect.value) || 1 : 1;
    const aspectRatio = ratioSelect ? ratioSelect.value || "1/1" : "1/1";
    const promptText = promptInput ? promptInput.value.trim() : "";

    createImageCards(selectedModel, imageCount, aspectRatio, promptText);
  };

  // Fill prompt with random example
  if (promptBtn && promptInput) {
    promptBtn.addEventListener("click", () => {
      const prompt =
        examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
      promptInput.value = prompt;
      promptInput.focus();
    });
  }

  // Add listeners only if elements exist
  if (promptForm) {
    promptForm.addEventListener("submit", handleFormSubmit);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
});



document.addEventListener("DOMContentLoaded", () => {
  const headingText = "ImagineX"; // The text to be typed
  const heading = document.getElementById("heading");
  let index = 0;

  function typeEffect() {
    if (index < headingText.length) {
      const span = document.createElement("span");
      span.textContent = headingText.charAt(index);
      span.style.opacity = 0;
      span.style.transition = "opacity 0.2s ease-in-out";
      heading.appendChild(span);

      // small fade-in delay for each letter
      setTimeout(() => {
        span.style.opacity = 1;
      }, 50);

      index++;
      // Add slight random delay for natural typing feel
      const delay = 100 + Math.random() * 100;
      setTimeout(typeEffect, delay);
    }
  }

  // Blinking cursor effect
  //heading.style.borderRight = "2px solid white";
  heading.style.paddingRight = "5px";
  heading.style.display = "inline-block";
  heading.style.whiteSpace = "nowrap";
  heading.style.overflow = "hidden";

  // Start typing after a short delay
  setTimeout(typeEffect, 200);
});



document.addEventListener("DOMContentLoaded", () => {
  const magicIcon = document.getElementById("magic-icon");

  // Fixed color sequence (in loop)
  const colors = [
    "#ffffffff", // golden
    "#ff1c1cff",
    "#2ab8ffff", // sky blue
    "#fb90c6ff", // pink
    "#FFD700", // golden, // light purple
    "#53ff67ff",
    "#000000ff"
  ];

  let colorIndex = 0;

  // Function to change color smoothly
  function changeIconColor() {
    const nextColor = colors[colorIndex];
    magicIcon.style.transition = "color 1.5s ease-in-out, text-shadow 1.5s ease-in-out";
    magicIcon.style.color = nextColor;
    magicIcon.style.textShadow = `0 0 10px ${nextColor}, 0 0 30px ${nextColor}`;

    // Move to next color (looping back to start)
    colorIndex = (colorIndex + 1) % colors.length;
  }

  // Change color every 4–5 seconds
  function loopColorChange() {
    changeIconColor();
    const nextChange = 3000 + Math.random() * 1000; // between 4–5s
    setTimeout(loopColorChange, nextChange);
  }

  // Start loop
  loopColorChange();
});
