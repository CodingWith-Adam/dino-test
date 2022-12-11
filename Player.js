export default class Player {
  WALK_ANIMATION_TIMER = 200;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;

  dinoImageIndex = 0;
  dinoRunImages = [];

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;
  x = 0;
  y = 0;

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;

    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yMax = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "/images/standing_still.png";

    this.jumpImage = new Image();
    this.jumpImage.src = "/images/standing_still_eye_closed.png";

    const dinoRun1Image = new Image();
    dinoRun1Image.src = "/images/dino_run1.png";

    const dinoRun2Image = new Image();
    dinoRun2Image.src = "/images/dino_run2.png";

    this.dinoRunImages.push(dinoRun1Image);
    this.dinoRunImages.push(dinoRun2Image);

    this.dinoRunImages.push();
    this.image = this.standingStillImage;

    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  touchstart = () => {
    this.jumpPressed = true;
  };

  touchend = () => {
    this.jumpPressed = false;
  };

  keydown = (event) => {
    if (event.code == "Space") {
      this.jumpPressed = true;
      // event.returnValue = false;
    }
  };

  keyup = (event) => {
    if (event.code == "Space") {
      this.jumpPressed = false;
    }
  };

  run(gameSpeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      if (this.image === this.dinoRunImages[0]) {
        this.image = this.dinoRunImages[1];
      } else {
        this.image = this.dinoRunImages[0];
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }

    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    if (this.jumpInProgress && !this.falling) {
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
        this.jumpPressed = false;
      }
    } else {
      if (this.y < this.yMax) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yMax;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    }

    this.jump(frameTimeDelta);
  }

  draw() {
    this.ctx.strokeStyle = "blue ";
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  reset() {
    this.dinoImageIndex = 0;
  }
}
