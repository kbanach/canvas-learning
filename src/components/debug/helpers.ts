export const debugPoint = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color = 'gray'
): void => {
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x, y + 30);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 15, y);
  ctx.lineTo(x + 15, y);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.restore();
};

export const debugRectangle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'gray'
): void => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
};
