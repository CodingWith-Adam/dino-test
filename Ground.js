export default class Ground {
  constructor(ctx, width, height, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.scaleRatio = scaleRatio;
    this.x = 0;
    this.groundImage = new Image();
    this.groundImage.src = "images/ground.png";
  }

  update(gameSpeed, frameTimeDelta) {
    // console.log("update ground", this.speed * frameTimeDelta * gameSpeed);
    this.x -= this.speed * gameSpeed * frameTimeDelta * this.scaleRatio;
  }

  draw() {
    const y = this.canvas.height - this.height;
    this.ctx.drawImage(this.groundImage, this.x, y, this.width, this.height);
    this.ctx.drawImage(
      this.groundImage,
      this.x + this.width,
      y,
      this.width,
      this.height
    );

    if (this.x < -this.width) {
      this.x = 0;
    }
  }

  reset() {
    this.x = 0;
  }
}
