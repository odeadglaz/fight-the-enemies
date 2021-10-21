import { context, explode } from '../constants';

export class Explode {
  image = explode;
  spriteWidth = 200;
  spriteHeight = 179;

  frame = 0;
  maxFrames = 5;

  frameInterval = 100;
  frameTimer = 0;

  done = false;

  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {}

  draw(gameSpeed: number) {
    if (this.frameTimer > this.frameInterval) {
      this.frame++;

      if (this.frame > this.maxFrames) {
        this.done = true;
      }

      this.frameTimer = 0;
    } else {
      this.frameTimer += gameSpeed;
    }

    this.drawImage();
  }

  drawImage() {
    context.drawImage(
      this.image,
      this.spriteWidth * Math.floor(this.frame),
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
