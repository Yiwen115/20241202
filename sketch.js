let angle = 0;
let size = 80;
let growing = true;
let fireworks = [];
let burstSound;

// 煙火粒子類別
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector(0, 0.05);
    this.lifespan = 255;
    this.color = color(random(150, 255), random(150, 255), random(150, 255));
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 4;
  }

  display() {
    stroke(red(this.color), green(this.color), blue(this.color), this.lifespan);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

// 煙火類別
class Firework {
  constructor() {
    this.particles = [];
    this.x = random(width);
    this.y = height;
    this.targetY = random(height/4, height*0.6);
    this.vel = random(-15, -12);
    this.exploded = false;
    this.acc = 0.2;
    if (burstSound) {
      burstSound.play();
    }
  }

  explode() {
    if (burstSound) {
      burstSound.play();
    }
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(this.x, this.y));
    }
    this.exploded = true;
  }

  update() {
    if (!this.exploded) {
      this.y += this.vel;
      this.vel += this.acc;
      
      if (this.y <= this.targetY) {
        this.explode();
      }
    } else {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update();
        if (this.particles[i].isDead()) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  display() {
    if (!this.exploded) {
      stroke(255);
      strokeWeight(4);
      point(this.x, this.y);
      stroke(255, 100);
      strokeWeight(2);
      line(this.x, this.y, this.x, this.y + 10);
    }
    for (let particle of this.particles) {
      particle.display();
    }
  }

  isDead() {
    return this.exploded && this.particles.length === 0;
  }
}

function preload() {
  soundFormats('wav');
  burstSound = loadSound('1668.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  colorMode(RGB);
  
  burstSound.setVolume(0.3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 25);
  
  if (random(1) < 0.03) {
    fireworks.push(new Firework());
  }
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].isDead()) {
      fireworks.splice(i, 1);
    }
  }
  
  if (growing) {
    size += 0.5;
    if (size > 90) growing = false;
  } else {
    size -= 0.5;
    if (size < 80) growing = true;
  }
  
  let r = map(sin(angle), -1, 1, 100, 255);
  let g = map(sin(angle + PI/2), -1, 1, 100, 255);
  let b = map(sin(angle + PI), -1, 1, 100, 255);
  
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = color(r, g, b);
  
  textSize(size);
  fill(r, g, b);
  text("淡江大學", width/2, height/2 - size);
  
  textSize(size * 0.8);
  fill(b, r, g);
  text("教育科技學系", width/2, height/2 + size/2);
  
  textSize(size * 0.4);
  fill(g, b, r);
  text("413730325 李薏玟", width/2, height/2 + size*2);
  
  angle += 0.05;
}