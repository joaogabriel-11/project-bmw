const frameCount = 37;
const currentFrame = (index) => `images/bmw-rotation/image_${index}.webp`;

const images = [];
let imagesLoaded = 0;

// Pré-carregar imagens
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);

  img.onload = () => {
    imagesLoaded++;

    if (imagesLoaded === frameCount) {
      initAnimation();
    }
  };

  images.push(img);
}

// GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// create the smooth scroller FIRST!
ScrollSmoother.create({
  smooth: 2,
  effects: true,
  normalizeScroll: true,
});

function AnimatePage() {
  // HERO
  gsap.from(".hero", {
    opacity: 0,
    duration: 1,
  });

  gsap.from("picture:nth-child(2)", {
    y: 200,
    duration: 1,
  });

  gsap.from("picture:nth-child(1)", {
    y: -300,
    duration: 1,
  });

  // CARDS
  gsap.from(".competition-card", {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
    stagger: 0.3,
    scrollTrigger: {
      trigger: ".cards",
      start: "10% 70%",
      end: "100% 70%",
      scrub: true,
    },
  });

  // Footer
  gsap.from("footer", {
    y: -400,
    immediateRender: false,
    scrollTrigger: {
      end: "100% 100%",
      trigger: "footer",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Farol
  gsap.to(".farol path", {
    fill: "#d2d1c8d7",
    duration: 6,
    scrollTrigger: {
      trigger: "footer",
      start: "0% 10%",
      toggleActions: "play reverse play reverse",
    },
  });

  // Overlay
  gsap.fromTo(
    "footer",
    { "--overlay-opacity": 1 },
    {
      "--overlay-opacity": 0.2,
      duration: 4,
      scrollTrigger: {
        trigger: "footer",
        start: "0% 10%",
        toggleActions: "play reverse play reverse",
      },
    },
  );

  // Text Split
  const split = SplitText.create(".textSplit", {
    type: "lines, words, chars",
    mask: "LINES",
  });

  gsap.from(split.chars, {
    y: 40,
    opacity: 0,
    duration: 0.1,
    stagger: 0.018,
  });

  // Hero inferior
  const elementos = document.querySelectorAll(".textSplit-hero-inferior");
  elementos.forEach((elemento) => {
    gsap.set(elemento, { visibility: "visible" });
  });

  const textoInferiorHero = SplitText.create(".textSplit-hero-inferior", {
    type: "lines, words, chars",
    mask: "lines",
  });

  gsap.from(textoInferiorHero.chars, {
    onComplete() {
      setTimeout(ShowVelocity, 500);
    },
    y: 40,
    opacity: 0,
    duration: 0.2,
    stagger: 0.1,
  });

  // Título
  const splitTitle = SplitText.create(".textSplit-title", {
    type: "lines, words, chars",
    mask: "words",
  });

  gsap.from(splitTitle.chars, {
    y: 200,
    opacity: 0,
    duration: 0.4,
    stagger: 0.03,
    scrollTrigger: {
      trigger: ".section-cards",
      start: "0% 50%",
      toggleActions: "play reverse play reverse",
    },
  });

  // Velocidade
  function ShowVelocity() {
    const speedDisplay = document.getElementById("speedometer");
    const targetValue = 250;

    let stats = { value: 0 };

    gsap.to(stats, {
      value: targetValue,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        speedDisplay.innerHTML = Math.floor(stats.value);
      },
    });
  }
}
// ANIMAÇÃO DO CARRO (SCROLL)
function initAnimation() {
  const carState = { frame: 0 };

  const imageElement = document.querySelector(".bmw-image");

  // define primeira imagem
  imageElement.style.backgroundImage = `url(${images[0].src})`;

  gsap.to(carState, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: ".bmw-rotativa",
      start: "top top",
      end: "+=1400",
      scrub: 0.5,
      pin: true,
    },
    onUpdate: () => {
      imageElement.style.backgroundImage = `url(${images[carState.frame].src})`;
    },
  });
}

// PreLoader
gsap.set("#logo-bmw", { transformOrigin: "50% 50%", opacity: 1 });

const tl = gsap.timeline({
  onComplete() {
    AnimatePage();

    // Fade
    gsap.to("#preloader", {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut",
      onComplete() {
        gsap.set("#preloader", { display: "none" });
      },
    });
  },
});

// 2. Animação de Entrada
tl.from("#logo-bmw", {
  scale: 0,
  opacity: 0,
  duration: 2.0,
  ease: "expo.out",
});
// 3. O Giro
gsap.to("#logo-bmw", {
  rotation: 360,
  duration: 8,
  repeat: -1,
  ease: "none",
});
tl.to(
  "#logo-bmw",
  {
    opacity: 0,
    duration: 0.8,
    ease: "power2.in",
  },
  "+=1",
);
