import { canvas, context, worm, spider, ghost } from '../constants';
import * as painter from '../painter';

const gameSpeedRatio = (gameSpeed: number) => gameSpeed * 0.1;

const randomSize = (maxSize, minSize = 0) =>
  minSize + Math.random() * (maxSize - minSize);

export class Enemy {
  x: number;
  vx: number;
  vy: number;
  y: number;
  width: number;
  height: number;
  spriteWidth: number;
  spriteHeight: number;
  image: HTMLImageElement;
  removed: boolean = false;
  leftBoard: boolean = false;
  maxSpriteFrames = 6;
  currentFrame = 0;

  move(gameSpeed: number) {
    // Relative frame ratio
    this.x += this.vx * gameSpeedRatio(gameSpeed);
    this.y += this.vy * gameSpeedRatio(gameSpeed);
  }

  visible() {
    const insideBoard = this.x > -this.width;
    if (!insideBoard) {
      this.leftBoard = true;
    }

    return !this.removed && insideBoard;
  }

  die() {
    this.removed = true;
  }

  draw() {
    if (this.currentFrame > this.maxSpriteFrames - 1) {
      this.currentFrame = 0;
    }

    this.drawImage();

    // Increase sprite frame
    this.currentFrame += 0.15;
  }

  drawImage() {
    context.drawImage(
      this.image,
      this.spriteWidth * Math.floor(this.currentFrame),
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

export class Worm extends Enemy {
  spriteWidth = 229;
  spriteHeight = 171;
  image = worm;

  vx = (1 + Math.random() * 1.5) * -1;
  vy = 0;

  constructor() {
    super();

    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = canvas.width;
    this.y = canvas.height - this.height;
  }
}

export class Ghost extends Enemy {
  spriteWidth = 261;
  spriteHeight = 209;
  sizeRatio = randomSize(3, 2);
  image = ghost;

  vx = (1 + Math.random() * 4) * -1;
  vy = 0;

  angle = 0;
  moveCurveRadius = Math.random() * 2;

  drawingAlpha = 0.5 + +Math.random() * 0.5;

  constructor() {
    super();
    this.width = this.spriteWidth / this.sizeRatio;
    this.height = this.spriteHeight / this.sizeRatio;
    this.x = canvas.width;
    this.y = this.moveCurveRadius + Math.random() * canvas.height * 0.25;
  }

  move(gameSpeed: number) {
    this.vy = Math.sin(this.angle) * this.moveCurveRadius;

    super.move(gameSpeed);
    this.angle += 0.04;
  }

  draw() {
    context.save();
    context.globalAlpha = this.drawingAlpha;
    super.draw();
    context.restore();
  }
}

export class Spider extends Enemy {
  spriteWidth = 310;
  spriteHeight = 175;
  image = spider;

  vx = 0;
  vy = 1 + Math.random() * 2.5;

  maxDropHeight: number;
  reachedMaxDropHeight: boolean = false;

  constructor() {
    super();
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = canvas.width * 0.15 + Math.random() * canvas.width * 0.45;
    this.y = -this.height;
    this.maxDropHeight =
      canvas.height * 0.25 + Math.random() * canvas.height * 0.35;
  }

  move(gameSpeed: number) {
    if (this.y > this.maxDropHeight) {
      this.vy *= -1;
      this.reachedMaxDropHeight = true;
    }
    super.move(gameSpeed);
  }

  visible() {
    if (this.removed) {
      return false;
    }

    const insideBoard = !this.reachedMaxDropHeight || this.y > -this.height;

    if (!insideBoard) {
      this.leftBoard = true;
    }

    return insideBoard;
  }

  draw() {
    const lineStart = {
      x: this.x + this.width / 2,
      y: 0,
    };

    const lineEnd = {
      x: lineStart.x,
      y: this.y + 10,
    };

    painter.line(lineStart, lineEnd);
    super.draw();
  }
}
