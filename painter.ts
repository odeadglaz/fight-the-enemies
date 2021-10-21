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

export const text = (text, position) => {
  context.font = '36px Malbic';
  context.fillStyle = 'black';
  context.fillText(text, position.x, position.y - 3);
  context.fillStyle = 'white';
  context.fillText(text, position.x, position.y);
}