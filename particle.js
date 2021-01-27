// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor(p, w, h, lights) {
    this.p = p
    this.width = w
    this.height = h
    this.x = Math.random() * this.width
    this.y = Math.random() * this.height
    this.d = Math.random() * 3 + 2
    for (var i = 0; i < lights.length; i++) {
      if (this.p.dist(this.x, this.y, lights[i].x, lights[i].y) < (this.d + lights[i].d)) {
        this.x = this.d + lights[i].d
        this.y = this.d + lights[i].d
      }
    }
    this.xSpeed = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1)
    this.ySpeed = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1)
  }

  // creation of a particle.
  createParticle() {
    this.p.noStroke();
    this.p.fill('rgba(54,252,200,0.8)');
    this.p.circle(this.x, this.y, this.d);
  }

  // setting the particle in motion.
  moveParticle(lights) {
    let collide = false
    let hit = -1
    for (var i = 0; i < lights.length; i++) {
      if (this.p.dist(this.x, this.y, lights[i].x, lights[i].y) < (this.d + lights[i].d)) {
        collide = true
        hit = i
        break
      }
    }
    if (this.x < 0 || this.x > this.width || collide)
      this.xSpeed *= -1;
    if (this.y < 0 || this.y > this.height || collide)
      this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    return hit
  }
}