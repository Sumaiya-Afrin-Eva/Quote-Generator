const quoteButton = document.querySelector(".quote");
const moodButtons = document.querySelectorAll(".text-tab button");
const nextButton = document.querySelector(".next-quote");
const placeholderr = document.querySelector(".placeholder");
let currentMood = "";

const fetchQuote = async (mood) => {
  try {
    const response = await fetch("http://localhost:3000/generate-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });

    function typeQuote(text, element, speed = 50) {
      element.innerHTML = "";
      let i = 0;

      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }

      type();
    }

    const data = await response.json();
    if (data.quote) {
      quoteButton.innerHTML = `<span class="result"></span>`;
      const quoteSpan = quoteButton.querySelector(".result");

      typeQuote(`"${data.quote}"`, quoteSpan);
    } else {
      quoteButton.innerHTML = "❌ Free Ai Limit Exceeded.";
    }
  } catch (error) {
    console.error("❌ Fetch error:", error);
    quoteButton.innerHTML = "⚠️ Couldn't fetch quote.";
  }
};

moodButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    currentMood = e.target.dataset.mood;
    fetchQuote(currentMood);
  });
});

nextButton.addEventListener("click", () => {
  currentMood = "";

  quoteButton.innerHTML = `
  <span class="placeholder">👋 Please select your mood to get a quote!</span>
  `;
  moodButtons.forEach((btn) => btn.classList.remove("active"));
});
