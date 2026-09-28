// Animated particle background drawn on #particle-canvas.
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
const particleCount = 100;

// Resize canvas to fit the screen
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.color = "rgba(255, 255, 255, 0.7)";
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
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
initParticles();

const animateParticles = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
};
animateParticles();
