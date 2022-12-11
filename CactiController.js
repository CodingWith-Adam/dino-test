export default class CactiController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;

  nextCactusInterval = null;

  cacti = [];

  constructor(ctx, cactiImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = this.ctx.canvas;
    this.speed = speed;
    this.scaleRatio = scaleRatio;
    this.cactiImages = cactiImages;

    this.setNextCactusTime();
  }

  setNextCactusTime() {
    const num = this.randomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );
    this.nextCactusInterval = num;
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCactus() {
    const index = this.randomNumber(0, this.cactiImages.length - 1);
    const cactusImage = this.cactiImages[index];
    const x = this.canvas.width * 1.5;
    const cactus = new Cactus(
      x,
      this.canvas.height - cactusImage.height,
      cactusImage.width,
      cactusImage.height,
      cactusImage.image
    );
    this.cacti.push(cactus);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }

    this.cacti.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);

    console.log(this.cacti.length);

    this.nextCactusInterval -= frameTimeDelta;
  }

  draw() {
    this.cacti.forEach((cactus) => {
      cactus.draw(this.ctx);
    });
  }

  collideWith(sprite) {
    return this.cacti.some((x) => x.collideWith(sprite));
  }

  reset() {
    this.cacti = [];
  }
}

class Cactus {
  speed = 0;

  constructor(x, y, width, height, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
    this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
  }

  draw(ctx) {
    ctx.strokeStyle = "red";

    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  collideWith(sprite) {
    const factor = 1.4;
    if (
      sprite.x < this.x + this.width / factor &&
      sprite.x + sprite.width / factor > this.x &&
      sprite.y < this.y + this.height / factor &&
      sprite.height / factor + sprite.y > this.y
    ) {
      // Collision
      return true;
    } else {
      // No collision
      return false;
    }
  }
}
