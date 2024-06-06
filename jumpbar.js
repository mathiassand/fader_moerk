class JumpBar {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    push();
    translate(this.x, this.y);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();
  }

  checkCollision(player) {
    let halfW = this.w / 2;
    let halfH = this.h / 2;
    let halfSize = player.size / 2;

    if (player.x + halfSize > this.x - halfW &&
        player.x - halfSize < this.x + halfW &&
        player.y + halfSize > this.y - halfH &&
        player.y - halfSize < this.y + halfH) {

      if (player.velocity > 0) {  // Player lands on the bar
        player.y = this.y - halfH - halfSize; // Adjust player position to be on top of the bar
        player.velocity = 0;
        player.canJump = true; // Allow the player to jump again
      }
    }
  }
}