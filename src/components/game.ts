import backgroundImgSrc from '!!file-loader!../static/background.jpg';
import { Background, SCROLL_DIRECTION } from './background';
import { Debug } from './debug/debug.class';
import { GameInput } from './input/game-input.class';
import { Range } from './input/range.class';

export class Game {
  private shouldRun: boolean;
  private lastTimestamp: number;

  private debug: Debug;

  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private background: Background;

  private inputs: GameInput<any>[] = [];

  private requestedAnimationFrame: number;

  constructor(canvasId: string) {
    this.shouldRun = true;

    this.debug = new Debug('#debug');
    const el = document.getElementById(canvasId) as HTMLCanvasElement;

    if (el === null)
      throw new Error(`Could not find canvas element with id: ${canvasId}`);

    this.canvasEl = el;
    this.ctx = el.getContext('2d') as CanvasRenderingContext2D;

    this.background = new Background(
      backgroundImgSrc,
      this.canvasEl,
      this.ctx,
      this.debug.getLogger('background')
    );

    this.background.setScroll(250, SCROLL_DIRECTION.FROM_RIGHT_TO_LEFT);

    const backgroundSpeedRangeInput: Range = new Range(
      this.canvasEl,
      this.ctx,
      this.debug.getLogger('bgSpeedInput')
    );

    backgroundSpeedRangeInput
      .setPosition(150, 250)
      .setSize(200, 35)
      .setMin(0)
      .setMax(100)
      .setOnChange((newValue: number) => {
        console.log('I ve just got onChange value to show!:', newValue);

        this.background.setScroll((newValue - 50) * 10 * -1);
      });

    backgroundSpeedRangeInput.value = 50;

    this.inputs.push(backgroundSpeedRangeInput);

    this.canvasEl.addEventListener('click', (evt: MouseEvent) => {
      evt.preventDefault();

      const canvasXoffset = this.canvasEl.offsetLeft + this.canvasEl.clientLeft;
      const canvasYoffset = this.canvasEl.offsetTop + this.canvasEl.clientTop;

      const mouseOnCanvasX = evt.clientX - canvasXoffset;
      const mouseOnCanvasY = evt.clientY - canvasYoffset;

      this.inputs.forEach((i) => i.handleClick(mouseOnCanvasX, mouseOnCanvasY));
    });
  }

  eject(): void {
    this.shouldRun = false;
    window.cancelAnimationFrame(this.requestedAnimationFrame);
    console.log('Ejected now!');
  }

  draw(): void {
    if (!this.shouldRun) return;

    this.requestedAnimationFrame = window.requestAnimationFrame(
      (timestamp: number) => {
        if (!this.shouldRun) return;
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;

        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.background.draw(delta);
        this.inputs.forEach((i) => i.draw());
        this.debug.printLogs(delta);

        // recursive call
        this.draw();
      }
    );
  }
}
