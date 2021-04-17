import { DebugLog } from '../debug/debug-log.class';
import { GameInput } from './game-input.class';

export class Range extends GameInput<number> {
  private fillStyle = 'green';

  private min: number;
  private max: number;

  private currentPercentageOfRange: number;

  constructor(
    canvasEl: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    logger: DebugLog
  ) {
    super(canvasEl, ctx, logger);
  }

  setMin(newMin: number): Range {
    this.min = newMin;
    return this;
  }

  setMax(newMax: number): Range {
    this.max = newMax;
    return this;
  }

  handleClick(clickXpos: number, clickYpos: number): void {
    const insideOnX =
      clickXpos >= this.xPos && clickXpos <= this.xPos + this.width;
    const insideOnY =
      clickYpos >= this.yPos && clickYpos <= this.yPos + this.height;

    if (insideOnX && insideOnY) {
      const newValue = this.calulateValueFromPointInLength(
        clickXpos - this.xPos
      );

      this.value = newValue;
    }
  }

  private calulateValueFromPointInLength(clickXpos: number): number {
    return this.max * (1 / (this.width / clickXpos));
  }

  set value(newValue: number) {
    super.value = newValue;
    this.updatePercentage();
  }

  draw(): void {
    this.drawSlider();
    this.drawCurrentPointInRange();

    this.logger.setContent(this.toString());
  }

  private drawSlider(): void {
    const halfOfHeight = Math.ceil(this.height / 2);
    const topOffset = Math.ceil(this.height / 4);

    this.ctx.save();

    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(
      this.xPos,
      this.yPos + topOffset,
      this.width,
      halfOfHeight
    );

    this.ctx.restore();
  }

  private drawCurrentPointInRange(): void {
    this.ctx.save();

    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.xPos + this.width * this.currentPercentageOfRange,
      this.yPos,
      15,
      this.height,
      0,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    this.ctx.restore();
  }

  private updatePercentage(): void {
    this.currentPercentageOfRange =
      1 / ((this.max - this.min) / this.currentValue);
  }

  toString(): string {
    return Object.keys(this)
      .filter(
        (key: string) =>
          typeof this[key] !== 'function' && typeof this[key] !== 'object'
      )
      .map((key) => `${key}: ${this[key]}`)
      .join('\n');
  }
}
