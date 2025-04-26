// Loading screen
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
  }, 2500); // Delay for 2.5s
});

// --- Matrix Rain ---
const matrixCanvas = document.getElementById('matrixCanvas');
const ctxMatrix = matrixCanvas.getContext('2d');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;
const matrixChars = "アカサタナハマヤラワガザダバパabcdefghijklmnopqrstuvwxyz0123456789";
const fontSize = 14;
const columns = matrixCanvas.width / fontSize;
const drops = Array.from({ length: columns }).fill(1);

function drawMatrix() {
  ctxMatrix.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctxMatrix.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  ctxMatrix.fillStyle = "#00ff00";
  ctxMatrix.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctxMatrix.fillText(text, i * fontSize, y * fontSize);

    if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}
setInterval(drawMatrix, 33);

// --- Starfield ---
const starCanvas = document.getElementById('starCanvas');
const ctxStar = starCanvas.getContext('2d');
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    z: Math.random() * starCanvas.width
  });
}

function drawStars() {
  ctxStar.fillStyle = "black";
  ctxStar.fillRect(0, 0, starCanvas.width, starCanvas.height);
  ctxStar.fillStyle = "white";
  stars.forEach(star => {
    const k = 128.0 / star.z;
    const x = star.x * k + starCanvas.width / 2;
    const y = star.y * k + starCanvas.height / 2;
    if (x >= 0 && x <= starCanvas.width && y >= 0 && y <= starCanvas.height) {
      const size = (1 - star.z / starCanvas.width) * 3;
      ctxStar.beginPath();
      ctxStar.arc(x, y, size, 0, 2 * Math.PI);
      ctxStar.fill();
    }
    star.z -= 2;
    if (star.z <= 0) {
      star.z = starCanvas.width;
      star.x = Math.random() * starCanvas.width - starCanvas.width / 2;
      star.y = Math.random() * starCanvas.height - starCanvas.height / 2;
    }
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// --- Particle Magic ---
const backgroundCanvas = document.getElementById('background');
const ctx = backgroundCanvas.getContext('2d');
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

let particles = [];
const colors = ["#0ff", "#f0f", "#fff", "#00f", "#0f0"];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.02;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.2;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    if (particles[i].size <= 0.3) {
      particles.splice(i, 1);
      i--;
    }
  }
}

function animateParticles() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  handleParticles();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('mousemove', function(e) {
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(e.x, e.y));
  }
});

window.addEventListener('resize', function() {
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
});

animateParticles();

// --- Audio Bass Reactivity ---
const audioUpload = document.getElementById('audio-upload');
audioUpload.addEventListener('change', function() {
  const file = this.files[0];
  const audio = new Audio(URL.createObjectURL(file));
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audio);
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  audio.play();

  function animateAudio() {
    analyser.getByteFrequencyData(dataArray);
    const bass = dataArray.slice(0, 8).reduce((a, b) => a + b) / 8;
    const scale = 1 + bass / 300;
    backgroundCanvas.style.transform = `scale(${scale}) rotate(${bass / 80}deg)`;
    requestAnimationFrame(animateAudio);
  }

  animateAudio();
});

// --- Hidden Gift for Anjali ---
// Secret message that will appear in the console
if (navigator.userAgent.includes("Windows")) {
  console.log("%c🌸 Secret Gift for Anjali 🌸", "color: #ff69b4; font-size: 24px; font-weight: bold;");
  console.log("%cYou are the code that runs my heart 💖. Open your soul to the cyber universe 🌌.", "color: #0ff;");
}
