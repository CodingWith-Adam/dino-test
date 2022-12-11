export default class Score {
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.score = 0;
  }

  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "black";
    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const y = 20 * this.scaleRatio;

    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }

  HIGH_SCORE_KEY = "highScore";
  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }
}
