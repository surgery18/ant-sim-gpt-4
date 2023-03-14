class Ant {
  constructor(x, y, colony) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 2;
    this.gathering = false;
    this.foodIndex = -1;
    this.energy = 100;
    this.colony = colony;
  }

  seekFood() {
    let closest = Infinity;
    let target = null;

    for (let i = 0; i < foods.length; i++) {
      if (foods[i]) {
        const d = this.pos.dist(foods[i].pos);
        if (d < closest) {
          closest = d;
          target = foods[i];
          this.foodIndex = i;
        }
      }
    }

    if (target && closest < 5) {
      this.gathering = true;
      foods.splice(this.foodIndex, 1); // Remove the food item when the ant starts gathering
    } else if (target) {
      const desired = p5.Vector.sub(target.pos, this.pos);
      desired.setMag(this.maxSpeed);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(0.1);
      this.applyForce(steer);
    }
  }

   returnToColony() {
    const colonyPos = createVector(this.colony.x, this.colony.y);
    const d = this.pos.dist(colonyPos);

    if (d < this.maxSpeed) {
      this.gathering = false;
      this.foodIndex = -1;
    } else {
      const desired = p5.Vector.sub(colonyPos, this.pos);
      desired.setMag(this.maxSpeed);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(0.1);
      this.applyForce(steer);
    }
  }

  update() {
    if (!this.gathering) {
      this.seekFood();
    } else {
      this.returnToColony();
    }

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Decrease energy over time
    this.energy -= 0.1;

    // If the ant has returned to its colony with food, restore some energy
    if (this.gathering && this.pos.dist(createVector(this.colony.x, this.colony.y)) < this.maxSpeed) {
      this.energy += 50;
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    if (this.energy <= 0) {
      fill(0, 0, 255); // Blue color for dead ants
    } else if (this.colony === colony1) {
      fill(0); // Black color for living ants of the first colony
    } else if (this.colony === colony2) {
      fill(255, 0, 0); // Red color for living ants of the second colony
    }
    ellipse(this.pos.x, this.pos.y, 5, 5);

    // Draw a larger green ellipse on top of the ant if it's carrying food
    if (this.gathering) {
      fill(0, 255, 0);
      ellipse(this.pos.x, this.pos.y - 4, 4, 4); // Increase the size and adjust the position
    }
  }
  
  isDead() {
    return this.energy <= 0;
  }
  
  fight(other) {
    if (random() < 0.5) {
      this.energy -= 10;
    } else {
      other.energy -= 10;
    }
  }
}
