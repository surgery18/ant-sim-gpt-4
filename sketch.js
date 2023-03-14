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
