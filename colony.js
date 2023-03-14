class Colony {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    fill(100, 0, 0);
    ellipse(this.x, this.y, 30, 30);
  }
}
