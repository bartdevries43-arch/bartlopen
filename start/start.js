const toast = document.querySelector("#toast");
let toastTimer;

document.querySelectorAll("[data-download]").forEach((link) => {
  link.addEventListener("click", () => {
    const count = Number(localStorage.getItem("bartlopen-ebook-downloads") || 0) + 1;
    localStorage.setItem("bartlopen-ebook-downloads", String(count));
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
  });
});
