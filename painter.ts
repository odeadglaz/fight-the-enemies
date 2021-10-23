import { canvas, context } from './constants';

export const wipe = () => context.clearRect(0, 0, canvas.width, canvas.height);

export const line = (from, to, color = 'rgba(0, 0, 0, 0.75)') => {
  context.beginPath();
  context.strokeStyle = color;
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
  context.closePath();
};

export const text = (text, position, color = 'white') => {
  context.font = '36px Malbic';
  context.fillStyle = 'black';
  context.fillText(text, position.x, position.y - 3);
  context.fillStyle = color;
  context.fillText(text, position.x, position.y);
};

export const crossair = (point, { size = 10, color = 'black' }) => {
  // Crossair circle
  context.beginPath();
  context.arc(point.x, point.y, size, 0, Math.PI * 2);
  context.strokeStyle = color;
  context.stroke();
  context.closePath();

  // Crossair cross
  context.beginPath();
  context.strokeStyle = 'red';
  context.moveTo(point.x, point.y - 15);
  context.lineTo(point.x, point.y + 15);
  context.moveTo(point.x - 15, point.y);
  context.lineTo(point.x + 15, point.y);

  context.stroke();

  context.closePath();
};

export const animateText = (text, position, color = 'black') => {
  console.log('Animate');
  const dashLength = 220;
  const speed = 15;
  const y = position.y;
  let dashOffset = dashLength;
  let x = position.x;
  let index = 0;

  context.font = '48px Malbic';
  context.fillStyle = context.strokeStyle = color;
  context.lineWidth = 4;
  context.lineJoin = 'round';
  context.globalAlpha = 2 / 3;

  const animationLoop = () => {
    const char = text[index];
    context.clearRect(x, y - 60, 60, 120);
    context.setLineDash([dashLength - dashOffset, dashOffset - speed]);

    dashOffset -= speed;

    context.strokeText(char, x, y);

    if (dashOffset > 0) requestAnimationFrame(animationLoop);
    else {
      // Fill final letter
      context.fillText(char, x, y);

      // Next char
      x += context.measureText(char).width + context.lineWidth * Math.random();

      dashOffset = dashLength;

      context.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // Random y-delta
      context.rotate(Math.random() * 0.005); // Random rotation

      index++;

      // Process next char if present
      if (index < text.length) requestAnimationFrame(animationLoop);
    }
  };

  animationLoop();
};
