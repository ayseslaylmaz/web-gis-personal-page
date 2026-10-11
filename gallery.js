
document.addEventListener("DOMContentLoaded", () => {

  const items = [...document.querySelectorAll(".album-item")];
  const lightbox = document.getElementById("albumLightbox");
  const largeImage = document.getElementById("albumLargeImage");
  const counter = document.getElementById("albumImageCount");
  const closeBtn = document.getElementById("albumClose");
  const prevBtn = document.getElementById("albumPrev");
  const nextBtn = document.getElementById("albumNext");

  if (!items.length || !lightbox) return;

  const images = items.map(item => item.querySelector("img"));
  let currentIndex = 0;
  let previousFocus = null;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // REVEAL PHOTOS ONE BY ONE
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("album-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    items.forEach(item => observer.observe(item));
  } else {
    items.forEach(item => item.classList.add("album-visible"));
  }

  // DISPLAY THE SELECTED PHOTO
  function showImage(index, animate = true) {
    currentIndex = (index + images.length) % images.length;

    largeImage.src = images[currentIndex].src;
    largeImage.alt = images[currentIndex].alt;

    counter.textContent =
      `${currentIndex + 1} / ${images.length}`;

    largeImage.classList.remove("album-slide");

    if (animate && !reduceMotion) {
      void largeImage.offsetWidth;
      largeImage.classList.add("album-slide");
    }
  }

  // OPEN THE PHOTO LIGHTBOX
  function openGallery(index) {
    previousFocus = document.activeElement;

    showImage(index, false);

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  // CLOSE THE PHOTO LIGHTBOX
  function closeGallery() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
    previousFocus?.focus();
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => openGallery(index));
  });

  prevBtn.addEventListener("click", () => {
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener("click", () => {
    showImage(currentIndex + 1);
  });

  closeBtn.addEventListener("click", closeGallery);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeGallery();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") closeGallery();

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

    if (event.key === "Tab") {
      const controls = [closeBtn, prevBtn, nextBtn];
      const index = controls.indexOf(document.activeElement);

      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        nextBtn.focus();
      } else if (!event.shiftKey && index === controls.length - 1) {
        event.preventDefault();
        closeBtn.focus();
      }
    }
  });

});
