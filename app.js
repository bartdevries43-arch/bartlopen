const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const quizForm = document.querySelector("#startcheck-form");
const quizSteps = [...document.querySelectorAll(".quiz-step")];
const quizNext = document.querySelector("#quiz-next");
const quizWarning = document.querySelector("#quiz-warning");
const quizProgress = document.querySelector("#quiz-progress");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const quizAgain = document.querySelector("#quiz-again");
let currentStep = 0;

function showQuizStep(step) {
  quizSteps.forEach((element, index) => element.classList.toggle("is-active", index === step));
  currentStep = step;
  quizWarning.textContent = "";
  quizProgress.style.width = `${Math.min((step + 1) * 25, 100)}%`;
  quizNext.hidden = step === 4;
}

function buildResult() {
  const values = new FormData(quizForm);
  if (values.get("injury") === "injury") {
    resultTitle.textContent = "Eerst goed naar je lichaam luisteren";
    resultCopy.textContent =
      "Met pijn of een blessure is een hardloopschema niet de eerste stap. Laat je klachten eerst beoordelen door een arts of fysiotherapeut. Daarna kunnen we samen kijken naar een rustige terugkeer.";
    return;
  }

  const score = Number(values.get("current")) + Number(values.get("days")) + Number(values.get("need"));
  if (score <= 2) {
    resultTitle.textContent = "Begin met een rustige 5 km-opbouw";
    resultCopy.textContent =
      "Jouw beste start is een ontspannen combinatie van wandelen en hardlopen. Zo bouw je ritme en vertrouwen op voordat de 10 kilometer centraal komt te staan.";
  } else if (score <= 4) {
    resultTitle.textContent = "De 10 km Start App past goed bij jou";
    resultCopy.textContent =
      "Je hebt al een basis en kunt met een duidelijk schema zelfstandig verder bouwen. Twee of drie haalbare trainingen per week brengen je richting de 10 kilometer.";
  } else {
    resultTitle.textContent = "Een persoonlijke app helpt jou het meest";
    resultCopy.textContent =
      "Je bent klaar om gericht te trainen. Met persoonlijke tempo's, passende trainingsdagen en eventueel een maandelijkse check-in haal je meer uit je beschikbare tijd.";
  }
}

quizNext.addEventListener("click", () => {
  const activeStep = quizSteps[currentStep];
  const selected = activeStep.querySelector("input:checked");
  if (!selected) {
    quizWarning.textContent = "Kies eerst een antwoord om verder te gaan.";
    return;
  }
  if (currentStep === 3) buildResult();
  showQuizStep(currentStep + 1);
});

quizAgain.addEventListener("click", () => {
  quizForm.reset();
  showQuizStep(0);
});

const toast = document.querySelector("#demo-toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}

document.querySelectorAll("[data-demo-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Demo: hier koppelen we straks jouw echte account.");
  });
});

document.querySelector("#contact-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  const tiktokLink = document.querySelector("#tiktok-contact");
  const data = new FormData(event.currentTarget);
  const text = `Hoi Bart, ik ben ${data.get("name")}. Ik wil graag trainen voor: ${data.get("goal")}. Waar ik nu sta: ${data.get("message")}`;
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "✓ Bericht gekopieerd. Het is nog niet verstuurd — open nu TikTok en plak het in een bericht aan @bartlopen.";
    showToast("Stap 1 gelukt. Open nu TikTok om je bericht te versturen.");
  } catch {
    status.textContent = `Kopiëren lukte niet automatisch. Selecteer dit bericht en stuur het naar @bartlopen: ${text}`;
  }
  tiktokLink.hidden = false;
  tiktokLink.focus({ preventScroll: true });
});
