// Animated particle background drawn on #particle-canvas.
// With the "particles-in-parent" class the canvas fills its parent (the landing
// page hero); otherwise it fills the window (quiz page).
(() => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const fillsParent = canvas.classList.contains("particles-in-parent");
  const particleCount = 100;
  let particles = [];

  const resizeCanvas = () => {
    canvas.width = fillsParent ? canvas.parentElement.clientWidth : window.innerWidth;
    canvas.height = fillsParent ? canvas.parentElement.clientHeight : window.innerHeight;
  };

  // A fixed colour can be set with data-color (white on the gradient hero);
  // otherwise follow the theme so the particles show on both backgrounds.
  const particleColor = () =>
    canvas.dataset.color ||
    (document.documentElement.getAttribute("data-bs-theme") === "dark"
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(26, 35, 126, 0.35)");

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }

    draw(color) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off walls
      if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
      if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
    }
  }

  const initParticles = () => {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  };

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = particleColor();
    particles.forEach((particle) => {
      particle.update();
      particle.draw(color);
    });
    requestAnimationFrame(animateParticles);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  initParticles();
  animateParticles();
})();
