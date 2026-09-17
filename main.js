document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     GALERIA – LIGHTBOX
  ========================== */
  const images = document.querySelectorAll(".gallery-grid img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  images.forEach(img => {
    img.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      lightboxImg.src = img.src;
      document.body.style.overflow = "hidden";
    });
  });

  if (lightbox && lightboxImg) {
    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
      document.body.style.overflow = "";
    });

    lightboxImg.addEventListener("click", e => e.stopPropagation());
  }

  /* =========================
     REVEAL ON SCROLL
  ========================== */
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.05 });

  reveals.forEach(el => observer.observe(el));

  // druga sekcja od razu pokazana
  if (reveals[1]) reveals[1].classList.add("active");

  /* =========================
     BOOKSY – ANIMOWANE CTA
  ========================== */
  const booksyButtons = document.querySelectorAll(
    'a[href*="booksy.com"]'
  );

  // Style są dodawane przez JS, więc nie trzeba ręcznie zmieniać CSS.
  const booksyStyle = document.createElement("style");
  booksyStyle.textContent = `
    .booksy-cta {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      transform: translateZ(0);
      will-change: transform, box-shadow;
      transition:
        transform .25s cubic-bezier(.2,.8,.2,1),
        box-shadow .25s ease,
        filter .25s ease;
    }

    /* Delikatny błysk przechodzący po przycisku */
    .booksy-cta::after {
      content: "";
      position: absolute;
      top: -60%;
      left: -80%;
      width: 45%;
      height: 220%;
      pointer-events: none;
      z-index: -1;
      background: linear-gradient(
        105deg,
        transparent 0%,
        rgba(255,255,255,.08) 40%,
        rgba(255,255,255,.55) 50%,
        rgba(255,255,255,.08) 60%,
        transparent 100%
      );
      transform: rotate(12deg);
      opacity: 0;
    }

    .booksy-cta.booksy-idle {
      animation: booksy-breathe 4.5s ease-in-out infinite;
    }

    .booksy-cta.booksy-idle::after {
      animation: booksy-shine 4.5s ease-in-out infinite;
    }

    .booksy-cta:hover,
    .booksy-cta:focus-visible {
      transform: translateY(-3px) scale(1.025);
      filter: brightness(1.04);
      box-shadow:
        0 10px 28px rgba(0,0,0,.18),
        0 0 0 3px rgba(255,255,255,.10);
    }

    .booksy-cta:active {
      transform: translateY(1px) scale(.975);
      filter: brightness(.98);
      transition-duration: .08s;
    }

    .booksy-cta.booksy-clicked {
      animation: booksy-click .42s cubic-bezier(.2,.8,.2,1);
    }

    .booksy-ripple {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      pointer-events: none;
      background: rgba(255,255,255,.48);
      transform: translate(-50%, -50%) scale(0);
      animation: booksy-ripple .55s ease-out forwards;
      z-index: 2;
    }

    @keyframes booksy-breathe {
      0%, 100% {
        transform: translateY(0) scale(1);
        box-shadow: 0 4px 16px rgba(0,0,0,.10);
      }
      8% {
        transform: translateY(-2px) scale(1.018);
        box-shadow: 0 8px 24px rgba(0,0,0,.16), 0 0 0 4px rgba(255,255,255,.08);
      }
      16%, 100% {
        transform: translateY(0) scale(1);
        box-shadow: 0 4px 16px rgba(0,0,0,.10);
      }
    }

    @keyframes booksy-shine {
      0%, 28%, 100% {
        left: -80%;
        opacity: 0;
      }
      36% {
        opacity: 1;
      }
      52% {
        left: 135%;
        opacity: 0;
      }
    }

    @keyframes booksy-click {
      0%   { transform: scale(1); }
      35%  { transform: scale(.94); }
      70%  { transform: scale(1.035); }
      100% { transform: scale(1); }
    }

    @keyframes booksy-ripple {
      to {
        transform: translate(-50%, -50%) scale(18);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .booksy-cta,
      .booksy-cta.booksy-idle,
      .booksy-cta.booksy-clicked,
      .booksy-cta::after,
      .booksy-ripple {
        animation: none !important;
        transition: none !important;
      }

      .booksy-cta:hover,
      .booksy-cta:focus-visible,
      .booksy-cta:active {
        transform: none;
      }
    }
  `;
  document.head.appendChild(booksyStyle);

  booksyButtons.forEach(button => {
    button.classList.add("booksy-cta");

    // Animacja „zachęcająca” działa tylko, gdy przycisk jest widoczny.
    const booksyVisibility = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          button.classList.add("booksy-idle");
        } else {
          button.classList.remove("booksy-idle");
        }
      });
    }, { threshold: 0.35 });

    booksyVisibility.observe(button);

    // Efekt kliknięcia + ripple.
    button.addEventListener("click", event => {
      button.classList.remove("booksy-clicked");
      void button.offsetWidth; // restart animacji
      button.classList.add("booksy-clicked");

      const rect = button.getBoundingClientRect();
      const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
      const y = event.clientY ? event.clientY - rect.top : rect.height / 2;

      const ripple = document.createElement("span");
      ripple.className = "booksy-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });

    button.addEventListener("animationend", event => {
      if (event.animationName === "booksy-click") {
        button.classList.remove("booksy-clicked");
      }
    });
  });

  /* =========================
     SWIPER – GALERIA
  ========================== */
  const gallerySwiper = new Swiper(".gallery-wrapper", {
    slidesPerView: 1.2,
    spaceBetween: 20,
    centeredSlides: true,
    grabCursor: true,
    loop: false,
    pagination: { el: ".swiper-pagination", clickable: true },
    breakpoints: {
      0:    { slidesPerView: 2.2, centeredSlides: true },
      600:  { slidesPerView: 2.2, centeredSlides: true },
      768:  { slidesPerView: 4.2, centeredSlides: false },
      1024: { slidesPerView: 4,   centeredSlides: false }
    },
    observer: true,
    observeParents: true
  });

  // LIGHTBOX dla slidera
  document.querySelectorAll(".swiper-slide img").forEach(img => {
    img.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  /* =========================
     AUTOMATYCZNY ROK W STOPCE
  ========================== */
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
