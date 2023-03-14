let colony1;
let colony2;
let ants1 = [];
let ants2 = [];
let foods = [];
let numAnts = 100;
let numFood = 20;

// Add this new function to periodically spawn food
function spawnFood() {
  const x = random(50, width - 50);
  const y = random(50, height - 50);
  const food = new Food(x, y);

  for (let ant of [...ants1, ...ants2]) {
    const d = dist(x, y, ant.pos.x, ant.pos.y);
    if (d > 40) {
      foods.push(food);
      break;
    }
  }
}

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



function setup() {
  createCanvas(800, 800);

  colony1 = new Colony(width / 4, height / 2);
  colony2 = new Colony(width * 3 / 4, height / 2);

  for (let i = 0; i < numAnts; i++) {
    ants1.push(new Ant(colony1.x, colony1.y, colony1));
    ants2.push(new Ant(colony2.x, colony2.y, colony2));
  }

  for (let i = 0; i < numFood; i++) {
    foods.push(new Food(random(width), random(height)));
  }
}

function draw() {
  background(220);

  colony1.show();
  colony2.show();

  // Update and draw ants for both colonies
  for (let i = 0; i < ants1.length; i++) {
    if (!ants1[i].isDead()) {
      ants1[i].update();
    }
    ants1[i].show();
  }

  for (let i = 0; i < ants2.length; i++) {
    if (!ants2[i].isDead()) {
      ants2[i].update();
    }
    ants2[i].show();
  }

  // Check for ant fights between both colonies
  for (let ant1 of ants1) {
    for (let ant2 of ants2) {
      if (ant1.pos.dist(ant2.pos) < 5) {
        ant1.fight(ant2);
      }
    }
  }

  for (let food of foods) {
    food.show();
  }
  
  if (random() < 0.05) {
    spawnFood();
  }
}
