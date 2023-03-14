class Food {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(5, 15);
  }

  show() {
    fill(0, 255, 0);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}
