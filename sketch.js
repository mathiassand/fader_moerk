let jumpBars = [];
let player;
let score = 0;
let scrollOffset = 0;
let floorHeight = 20;
let gameState = 'start';
let startButton, restartButton, overlay;
let bgImage, defaultLeftImage, defaultRightImage, jumpLeftImage, jumpRightImage;

function preload() {
  bgImage = loadImage('assets/background_fridge.png'); // Load the background image
  defaultLeftImage = loadImage('assets/default_left.png'); // Load the default left image
  defaultRightImage = loadImage('assets/default_right.png'); // Load the default right image
  jumpLeftImage = loadImage('assets/jump_left.png'); // Load the jump left image
  jumpRightImage = loadImage('assets/jump_right.png'); // Load the jump right image
}

function setup() {
  let canvas = createCanvas(bgImage.width, windowHeight); // Set the canvas width to the image width and height to window height
  canvas.parent('game-container'); // Attach the canvas to the game-container

  // Select buttons and overlay
  startButton = select('#startButton');
  restartButton = select('#restartButton');
  overlay = select('#overlay');

  startButton.mousePressed(startGame);
  restartButton.mousePressed(restartGame);
}

function setupGame() {
  console.log('Setting up game...');
  
  player = new Player(); // Initialize player with no parameters

  jumpBars = [];
  score = 0;
  scrollOffset = 0;

  let horizontalReach = 200;
  let verticalReach = 150;

  // Create initial platforms
  let initialX = width / 2;
  for (let i = 0; i < 10; i++) {
    let x = constrain(initialX + random(-horizontalReach, horizontalReach), width * 0.2, width * 0.8);
    let y = height - 100 - i * verticalReach; // Ensure platforms are within jump height and leave space at the bottom
    jumpBars.push(new JumpBar(x, y, 200, 20));
    initialX = x;
  }

  // Create the floor
  jumpBars.push(new JumpBar(width / 2, height - floorHeight / 2, width, floorHeight));

  console.log('Game setup complete.');
}

function draw() {
  background(220);

  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    drawGameScreen();
  } else if (gameState === 'gameover') {
    drawEndScreen();
  }
}

function drawStartScreen() {
  overlay.html(`
    <div style="text-align: center;">
      <p style="font-size: 32px; margin: 0;">Fader mørks pizza køleskabs spil</p>
      <p style="font-size: 24px; margin: 0;">Brug piletasterne til at dreje og mellemrum til at hoppe</p>
    </div>
  `);
  startButton.show();
  restartButton.hide();
}

function drawGameScreen() {
  overlay.html(''); // Clear overlay
  startButton.hide();
  restartButton.hide();

  // Draw the background image
  let yOffset = scrollOffset % bgImage.height;
  for (let y = yOffset - bgImage.height; y < height; y += bgImage.height) {
    image(bgImage, 0, y, width, bgImage.height);
  }

  // Update player and scroll the view
  player.update();

  // Translate the view based on scroll offset
  push();
  translate(0, scrollOffset);

  // Update and display platforms
  for (let bar of jumpBars) {
    player.checkCollision(bar);
    bar.display();
  }

  // Draw the player sprite
  player.display();

  pop(); // Reset translation

  // Scroll the screen upwards if the player reaches a certain height
  if (player.position.y < height * 0.5) {
    scrollOffset = height * 0.5 - player.position.y;
  }

  // Generate new platforms if necessary
  generateNewPlatforms();

  // Remove platforms that are out of the view
  jumpBars = jumpBars.filter(bar => bar.y < player.position.y + height * 2);

  // Score based on the player's height
  score = max(score, floor((height - player.position.y + scrollOffset) / 10));

  // Check for game over condition: player collides with the floor
  if (player.position.y >= height - player.height / 2) {
    gameState = 'gameover';
    restartButton.show();
  }

  // Display the score in the top-left corner
  textSize(32);
  fill(0);
  text('Score: ' + score, 10, 30);
}

function generateNewPlatforms() {
  // Generate new platforms
  let lastPlatform = jumpBars[jumpBars.length - 1];
  if (lastPlatform.y > player.position.y - height) {
    let x = random(width * 0.2, width * 0.8);
    let y = lastPlatform.y - random(100, 150); // Use fixed values for vertical reach
    jumpBars.push(new JumpBar(x, y, 200, 20));
  }
}

function drawEndScreen() {
  // Clear or hide the player sprite
  player.position.y = height + 100; // Move the player offscreen

  overlay.html(`
    <div style="text-align: center;">
      <p style="font-size: 32px; margin: 0;">Game Over</p>
      <p style="font-size: 24px; margin: 0;">Your Score: ${score}</p>
    </div>
  `);
  restartButton.show();
}

function startGame() {
  console.log('Starting game...');
  gameState = 'playing';
  startButton.hide();
  restartButton.hide();
  setupGame();
}

function restartGame() {
  console.log('Restarting game...');
  gameState = 'playing';
  restartButton.hide();
  setupGame();
}

function keyPressed() {
  if (gameState === 'playing') {
    if (key === ' ') {
      player.jump();
    }
    if (keyCode === LEFT_ARROW) {
      player.turn(-1);
    } else if (keyCode === RIGHT_ARROW) {
      player.turn(1);
    }
  }
}

function keyReleased() {
  if (gameState === 'playing') {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      player.turn(0); // Stop turning when keys are released
    }
  }
}

function windowResized() {
  resizeCanvas(bgImage.width, windowHeight); // Resize
}
