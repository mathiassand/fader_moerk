class Player {
  constructor() {
    this.position = createVector(width / 2, height - 100);
    this.width = 64;
    this.height = 64;
    this.velocity = createVector(0, 0);
    this.gravity = 0.6;
    this.jumpHeight = 12; // Ensure this is set correctly
    this.horizontalAcceleration = 5; // Ensure this is set correctly
    this.isJumping = false;
    this.facing = 'left'; // Initial facing direction
    this.currentImage = defaultLeftImage; // Initial image
  }

  update() {
    this.velocity.y += this.gravity;
    this.position.add(this.velocity);

    if (this.position.y > height - floorHeight / 2) {
      this.position.y = height - floorHeight / 2;
      this.velocity.y = 0;
      this.isJumping = false;
      this.updateImage();
    }

    if (this.velocity.y !== 0) {
      this.isJumping = true;
    }
  }

  display() {
    image(this.currentImage, this.position.x, this.position.y, this.width, this.height);
  }

  jump() {
    if (!this.isJumping) {
      this.velocity.y = -this.jumpHeight;
      this.isJumping = true;
      this.updateImage();
    }
  }

  turn(direction) {
    this.velocity.x = direction * this.horizontalAcceleration;
    if (direction !== 0) {
      this.facing = direction === -1 ? 'left' : 'right';
      this.updateImage();
    }
  }

  updateImage() {
    if (this.isJumping) {
      this.currentImage = this.facing === 'left' ? jumpLeftImage : jumpRightImage;
    } else {
      this.currentImage = this.facing === 'left' ? defaultLeftImage : defaultRightImage;
    }
  }

  checkCollision(jumpBar) {
    let colliding = (
      this.position.x < jumpBar.x + jumpBar.width &&
      this.position.x + this.width > jumpBar.x &&
      this.velocity.y > 0 && // Only check collision when falling
      this.position.y + this.height > jumpBar.y &&
      this.position.y < jumpBar.y + jumpBar.height
    );

    if (colliding) {
      this.position.y = jumpBar.y - this.height;
      this.velocity.y = 0;
      this.isJumping = false;
      this.updateImage();
    }
  }
}
