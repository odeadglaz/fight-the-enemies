import { canvas } from '../constants';
import { Explode } from './explode';
import { Enemy, Ghost, Spider, Worm } from './enemies';
import * as painter from '../painter';

const possibleEnemies = [Worm, Ghost, Spider];

class EnemiesHanlder {
  enemies: Enemy[] = [];
  private enemyInterval: number = 1500;
  private enemyTimer: number = 0;

  draw(gameSpeed) {
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += gameSpeed;
    }

    this.enemies.forEach((enemy) => {
      enemy.move(gameSpeed);
      enemy.draw();
    });

    this.enemies = this.enemies.filter((enemy) => enemy.visible());
  }

  killEnemy(position: { x: number; y: number }): Enemy | undefined {
    const killedEnemeny = this.enemies.find((enemy) => {
      const intersecting =
        position.x >= enemy.x &&
        position.x <= enemy.x + enemy.width &&
        position.y >= enemy.y &&
        position.y <= enemy.y + enemy.height;

      return intersecting;
    });

    if (killedEnemeny) {
      killedEnemeny.die();
    }

    return killedEnemeny;
  }

  addEnemy(enemy: Enemy = this.randomEnemy()) {
    this.enemies.push(enemy);
  }

  randomEnemy() {
    const EnemyClass =
      possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)];

    return new EnemyClass();
  }
}

class ExplosionsHandler {
  private explosions: Explode[] = [];

  addExplosion(position, width: number, height: number) {
    this.explosions.push(new Explode(position.x, position.y, width, height));
  }

  draw(animatioRate: number) {
    this.explosions.forEach((explosion) => {
      explosion.draw(animatioRate);
    });

    this.explosions = this.explosions.filter((explosion) => !explosion.done);
  }
}

class Game {
  private score: number = 0;
  private animationFrame: number;
  private enemiesHandler = new EnemiesHanlder();
  private explosionsHandler = new ExplosionsHandler();

  private lastGameTimestamp: number;

  start() {
    this.enemiesHandler.addEnemy();

    canvas.addEventListener('click', (event) => {
      const clickPosition = {
        x: event.x,
        y: event.y,
      };

      const killed = this.enemiesHandler.killEnemy(clickPosition);

      if (killed) {
        this.score++;
        this.explosionsHandler.addExplosion(
          { x: killed.x, y: killed.y },
          killed.width,
          killed.height
        );
      }
    });

    this.draw();
  }

  stop() {
    cancelAnimationFrame(this.animationFrame);
  }

  draw(timestamp: number = 0) {
    painter.wipe();

    const animatioRate = this.lastGameTimestamp
      ? timestamp - this.lastGameTimestamp
      : 16;

    this.enemiesHandler.draw(animatioRate);
    this.explosionsHandler.draw(animatioRate);

    this.drawScore();

    this.lastGameTimestamp = timestamp;

    this.animationFrame = requestAnimationFrame((time) => this.draw(time));
  }

  drawScore() {
    painter.text(`Game score: ${this.score}`, { x: 20, y: 50 });
  }

  drawGameOver() {
    painter.text(`Game Over :()`, { x: 300, y: 250 });
  }
}

export const game = new Game();
