// get canvas element
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// set canvas on full height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
let hue = 0;
const mouse = { x: undefined, y: undefined };
let isDrawing = false;

canvas.addEventListener("click", e => {
  // toggle drawing
  isDrawing = !isDrawing;

  // draw 5 new particles on click
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  for (let i = 0; i < 5; i++) {
    particlesArray.push(new Particle());
  }
});

// draw particles when mouse moves
canvas.addEventListener("mousemove", e => {
  if (isDrawing) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (let i = 0; i < 5; i++) {
      particlesArray.push(new Particle());
    }
  } else {
    return;
  }
});

// generate random color
const generateColor = () => {
  let hexSet = "0123456789ABCDEF";
  let finalHexString = "#";
  for (let i = 0; i < 6; i++) {
    finalHexString += hexSet[Math.ceil(Math.random() * 15)];
  }
  return finalHexString;
};

// particle (circle to be more exact)
class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 20 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  // update particle size and position
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) {
      this.size -= 0.1;
    }
  }

  // draw a particle
  draw(x, y) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const handleParticles = () => {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    for (let j = i; j < particlesArray.length; j++) {
      // use Pythagorean theorem to calculate hypotenuse (distance) between particles
      const dx = particlesArray[i].x - particlesArray[j].x;
      const dy = particlesArray[i].y - particlesArray[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // if distance is less than 100 draw a line between particles
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = particlesArray[i].color;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    // if size of the particle below 0.3 delete it
    if (particlesArray[i].size < 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
};

// clear canvas
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// create animation loop
const animate = () => {
  clearCanvas();
  handleParticles();
  hue += 5;
  requestAnimationFrame(animate);
};

animate();
