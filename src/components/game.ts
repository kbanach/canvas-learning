import backgroundImgSrc from '!!file-loader!../static/background.jpg';
import { Background } from './background';

export class Game {
  private canvasEl: HTMLCanvasElement;
  private debugEl: HTMLElement;
  private ctx: CanvasRenderingContext2D;

  private lastTimestamp: number;

  private background: Background;

  constructor(canvasId: string) {
    this.debugEl = document.querySelector('#debug') as HTMLElement;

    const el = document.getElementById(canvasId) as HTMLCanvasElement;

    if (el === null)
      throw new Error(`Could not find canvas element with id: ${canvasId}`);

    this.canvasEl = el;
    this.ctx = el.getContext('2d') as CanvasRenderingContext2D;

    this.background = new Background(
      backgroundImgSrc,
      this.canvasEl,
      this.ctx,
      this.debugEl
    );
  }

  draw(): void {
    window.requestAnimationFrame((timestamp: number) => {
      if (!this.lastTimestamp) this.lastTimestamp = timestamp;

      const delta = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;

      this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.background.draw(delta);

      // recursive call
      this.draw();
    });
  }
}
