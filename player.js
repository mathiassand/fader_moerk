class Player {
  constructor(spriteImage) {
    this.spriteImage = spriteImage;
    this.position = createVector(width / 2, height - 100);
    this.width = 64;
    this.height = 64;
    this.velocity = createVector(0, 0);
    this.gravity = 0.6;
    this.jumpHeight = 15; // Ensure this is set correctly
    this.horizontalAcceleration = 5; // Ensure this is set correctly
    this.isJumping = false;
  }

  update() {
    this.velocity.y += this.gravity;
    this.position.add(this.velocity);

    if (this.position.y > height - floorHeight / 2) {
      this.position.y = height - floorHeight / 2;
      this.velocity.y = 0;
      this.isJumping = false;
    }
  }

  display() {
    image(this.spriteImage, this.position.x, this.position.y, this.width, this.height);
  }

  jump() {
    if (!this.isJumping) {
      this.velocity.y = -this.jumpHeight;
      this.isJumping = true;
    }
  }

  turn(direction) {
    this.velocity.x = direction * this.horizontalAcceleration;
  }

  checkCollision(jumpBar) {
    let colliding = (
      this.position.x < jumpBar.x + jumpBar.width &&
      this.position.x + this.width > jumpBar.x &&
      this.position.y + this.height > jumpBar.y &&
      this.position.y + this.height < jumpBar.y + jumpBar.height
    );

    if (colliding) {
      this.position.y = jumpBar.y - this.height;
      this.velocity.y = 0;
      this.isJumping = false;
    }
  }
}
