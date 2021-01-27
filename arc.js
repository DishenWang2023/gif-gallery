class Arc {
  constructor(p, x, y, w, id) {
    this.p = p
    this.x = x
    this.y = y
    this.w = w
    this.start = 0
    this.end = 0
    switch (id) {
      case 'topRight':
        this.start = () => Math.PI
        this.end = () => Math.PI * (1 + this.pct)
        break
      case 'topLeft':
        this.start = () => Math.PI * (2 - this.pct)
        this.end = () => 2 * Math.PI
        break
      case 'bottomRight':
        this.start = () => Math.PI * (1 - this.pct)
        this.end = () => Math.PI
        break
      case 'bottomLeft':
        this.start = () => 0
        this.end = () => Math.PI * this.pct
    }
    this.pct = 0
    this.age = Math.random() * 50
  }
  drawArc(h) {
    if (this.age < 0) {
      this.pct += 3 / 100
      if (this.pct >= 1) {
        this.pct = 0
        this.age = Math.random() * 30
      } else {
        this.p.stroke(200, 90, 100 * (1.2 - this.pct))
        this.p.arc(this.x, this.y, this.w, h, this.start(), this.end())
      }
    } else {
      this.age -= 1
    }
  }
}