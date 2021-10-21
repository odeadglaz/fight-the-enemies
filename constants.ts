export const canvas: HTMLCanvasElement = document.getElementById(
  'board'
) as HTMLCanvasElement;

export const worm: HTMLImageElement = document.getElementById(
  'worm'
) as HTMLImageElement;
export const spider: HTMLImageElement = document.getElementById(
  'spider'
) as HTMLImageElement;
export const ghost: HTMLImageElement = document.getElementById(
  'ghost'
) as HTMLImageElement;
export const explode: HTMLImageElement = document.getElementById(
  'explode'
) as HTMLImageElement;

export const context = canvas.getContext('2d');
