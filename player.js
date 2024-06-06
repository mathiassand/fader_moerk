class Player {
  constructor(sprite) {
    this.sprite = sprite;
    this.gravity = 0.6;
    this.lift = -15;
    this.jumpHeight = -this.lift * 15; // Calculate jump height based on lift
    this.velocity = 0;
    this.direction = 0; // -1 for left, 1 for right, 0 for no turn
    this.speed = 5; // Decrease speed for smoother turns
    this.horizontalSpeed = 0;
    this.horizontalAcceleration = 1.0; // Adjust acceleration as needed
    this.friction = 0.9; // Friction to slow down the player gradually
    this.canJump = true; // Allow the player to jump initially
  }

  jump() {
    if (this.canJump) {
      this.velocity = this.lift;
      this.canJump = false; // Disable jump until the player lands
    }
  }

  turn(dir) {
    this.direction = dir;
  }

  update() {
    this.velocity += this.gravity;
    this.sprite.position.y += this.velocity;

    this.horizontalSpeed += this.direction * this.horizontalAcceleration;
    this.horizontalSpeed = constrain(this.horizontalSpeed, -this.speed, this.speed); // Cap the speed
    this.sprite.position.x += this.horizontalSpeed;

    if (this.sprite.position.x < this.sprite.width / 2) {
      this.sprite.position.x = this.sprite.width / 2;
      this.horizontalSpeed = 0;
    }

    if (this.sprite.position.x > width - this.sprite.width / 2) {
      this.sprite.position.x = width - this.sprite.width / 2;
      this.horizontalSpeed = 0;
    }

    // Apply friction
    this.horizontalSpeed *= this.friction;

    // Prevent the player from falling below the floor
    if (this.sprite.position.y > height - this.sprite.height / 2) {
      this.sprite.position.y = height - this.sprite.height / 2;
      this.velocity = 0;
      this.canJump = true; // Allow jumping again when on the floor
    }

    // Reset direction to 0 after applying acceleration
    this.direction = 0;
  }

  display() {
    imageMode(CENTER);
    image(this.image, this.x, this.y, this.size, this.size);
  }
}