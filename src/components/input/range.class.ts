import { DebugLog } from '../debug/debug-log.class';
import { debugPoint, debugRectangle } from '../debug/helpers';
import { GameInput } from './game-input.class';

export class Range extends GameInput<number> {
  private fillStyle = 'green';

  private min: number;
  private max: number;

  private currentPercentageOfRange: number;

  private comfortXoffset = 10;
  private comfortYoffset = 5;

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
      clickXpos >= this.xPos - this.comfortXoffset &&
      clickXpos <= this.xPos + this.width + this.comfortXoffset;
    const insideOnY =
      clickYpos >= this.yPos - this.comfortXoffset &&
      clickYpos <= this.yPos + this.height + this.comfortYoffset;

    if (insideOnX && insideOnY) {
      const newValue = this.calulateValueFromPointInLength(
        clickXpos - this.xPos - this.comfortXoffset
      );

      this.value = newValue;
    }

    this.logger.setContent(
      `clickXpos: ${clickXpos}\nclickYpos:${clickYpos}\n${this.toString()}`
    );
  }

  private calulateValueFromPointInLength(clickXpos: number): number {
    const newValue = this.max * (1 / (this.width / clickXpos));

    return Math.min(Math.max(newValue, this.min), this.max);
  }

  set value(newValue: number) {
    super.value = newValue;
    this.updatePercentage();
  }

  draw(delta: number, drawBoundaries = false): void {
    this.drawSlider(drawBoundaries);
    this.drawCurrentPointInRange(drawBoundaries);
  }

  private drawSlider(drawBoundaries = false): void {
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

    if (drawBoundaries) {
      debugRectangle(
        this.ctx,
        this.xPos,
        this.yPos,
        this.width,
        this.height,
        'black'
      );

      debugRectangle(
        this.ctx,
        this.xPos - this.comfortXoffset,
        this.yPos - this.comfortYoffset,
        this.width + this.comfortXoffset * 2,
        this.height + this.comfortYoffset * 2,
        'red'
      );
    }
    this.ctx.restore();
  }

  private drawCurrentPointInRange(drawBoundaries = false): void {
    this.ctx.save();

    const sliderCenterX =
      this.xPos + this.width * this.currentPercentageOfRange;
    const sliderCenterY = this.yPos + this.height / 2;

    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.ellipse(
      sliderCenterX,
      sliderCenterY,
      7,
      this.height / 2,
      0,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.closePath();

    if (drawBoundaries) {
      debugPoint(this.ctx, sliderCenterX, sliderCenterY);
    }

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
