import backgroundImgSrc from '!!file-loader!../static/background.jpg';
import { Background, SCROLL_DIRECTION } from './background';
import { Debug } from './debug/debug.class';
import { debugPoint } from './debug/helpers';
import { GameInput } from './input/game-input.class';
import { Range } from './input/range.class';

export class Game {
  private shouldRun = true;
  private lastTimestamp: number;

  private debug: Debug;
  private DRAW_BOUNDARIES_DEBUG = true;

  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mousePressed = false;
  private mousePressEventDensityMs = 50;
  private lastMousePress = 0;

  private background: Background;

  private inputs: GameInput<string | number>[] = [];

  private requestedAnimationFrame: number;

  constructor(canvasId: string) {
    this.debug = new Debug('#debug');

    this.createCanvas(canvasId);

    this.addBackground();
    this.addInputs();
    this.addMouseHandling();
  }

  createCanvas(canvasId: string): void {
    const el = document.getElementById(canvasId) as HTMLCanvasElement;

    if (el === null)
      throw new Error(`Could not find canvas element with id: ${canvasId}`);

    this.canvasEl = el;
    this.ctx = el.getContext('2d') as CanvasRenderingContext2D;
  }

  addMouseHandling(): void {
    const mouseLogger = this.debug.getLogger('mousemove');

    this.canvasEl.addEventListener('mousemove', (evt) => {
      evt.preventDefault();

      const currentTime = Date.now();

      if (currentTime - this.lastMousePress < this.mousePressEventDensityMs)
        return;

      this.lastMousePress = currentTime;

      if (this.mousePressed) {
        const canvasXoffset =
          this.canvasEl.offsetLeft + this.canvasEl.clientLeft;
        const canvasYoffset = this.canvasEl.offsetTop + this.canvasEl.clientTop;

        const mouseOnCanvasX = evt.clientX - canvasXoffset;
        const mouseOnCanvasY = evt.clientY - canvasYoffset;

        mouseLogger.setContent(
          `mouseOnCanvasX: ${mouseOnCanvasX}\nmouseOnCanvasY: ${mouseOnCanvasY}`
        );

        this.inputs.forEach((i) =>
          i.handleClick(mouseOnCanvasX, mouseOnCanvasY)
        );
      }
    });

    this.canvasEl.addEventListener('mousedown', (evt: MouseEvent) => {
      evt.preventDefault();
      this.mousePressed = true;
    });

    this.canvasEl.addEventListener('mouseup', (evt: MouseEvent) => {
      evt.preventDefault();
      this.mousePressed = false;
    });
  }

  addInputs(): void {
    const backgroundSpeedRangeInput: Range = new Range(
      this.canvasEl,
      this.ctx,
      this.debug.getLogger('bgSpeedInput')
    );

    backgroundSpeedRangeInput
      .setPosition(500, 500)
      .setSize(200, 35)
      .setMin(0)
      .setMax(100)
      .setOnChange((newValue: number) => {
        console.log('I ve just got onChange value to show!:', newValue);

        this.background.setScroll((newValue - 50) * 10 * -1);
      });

    backgroundSpeedRangeInput.value = 50;

    this.inputs.push(backgroundSpeedRangeInput);
  }

  addBackground(): void {
    this.background = new Background(
      backgroundImgSrc,
      this.canvasEl,
      this.ctx,
      this.debug.getLogger('background')
    );

    this.background.setScroll(250, SCROLL_DIRECTION.FROM_RIGHT_TO_LEFT);
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
        this.background.draw(delta, this.DRAW_BOUNDARIES_DEBUG);
        this.inputs.forEach((i) => i.draw(delta, this.DRAW_BOUNDARIES_DEBUG));
        this.debug.printLogs(delta);

        // recursive call
        this.draw();
      }
    );
  }
}
