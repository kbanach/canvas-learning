import { DebugLog } from './debug/debug-log.class';
import { Drawable } from './drawable.type';

export enum SCROLL_DIRECTION {
  FROM_LEFT_TO_RIGHT = 'left',
  FROM_RIGHT_TO_LEFT = 'right',
}

export class Background implements Drawable {
  private readonly backgroundImageEl: HTMLImageElement;

  private backgroundSpeedPxPerSec = 0;
  private subPixelMovementStack = 0;

  private backgroundOffset: number;
  private backgroundImageWidth: number;
  private backgroundImageHeight: number;

  private backgroundImageRepeat: number;
  private backgroundCopiesAfter: number;

  constructor(
    backgroundImgUrl: string,
    private readonly canvasEl: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly logger: DebugLog
  ) {
    this.backgroundOffset = 0;

    this.backgroundImageEl = new Image();
    this.backgroundImageEl.src = backgroundImgUrl;

    this.backgroundImageEl.onload = (elem: any) => {
      this.backgroundImageWidth = elem?.target?.width;
      this.backgroundImageHeight = elem?.target?.height;

      this.backgroundImageRepeat =
        Math.ceil(this.canvasEl.width / this.backgroundImageWidth) + 1;

      this.backgroundCopiesAfter = this.backgroundImageRepeat - 1;
      if (this.backgroundCopiesAfter < 0) this.backgroundCopiesAfter = 0;
    };
  }

  setScroll(
    pxPerSec: number,
    direction = SCROLL_DIRECTION.FROM_LEFT_TO_RIGHT
  ): void {
    const directionModifier =
      direction === SCROLL_DIRECTION.FROM_LEFT_TO_RIGHT ? 1 : -1;

    this.backgroundSpeedPxPerSec = pxPerSec * directionModifier;
  }

  round(nr: number): string {
    return nr?.toFixed(4) ?? nr;
  }

  draw(delta: number, drawBoundaries: boolean): void {
    this.scrollBackground(delta);

    this.logger.setContent(this.toString());

    this.drawBackgroundPack(drawBoundaries);
  }

  private scrollBackground(delta: number): void {
    const movement =
      this.backgroundSpeedPxPerSec * (delta / 1000) +
      this.subPixelMovementStack;

    if (Math.floor(Math.abs(movement)) === 0) {
      this.subPixelMovementStack = movement;
      return;
    } else {
      this.subPixelMovementStack = 0;
    }

    this.backgroundOffset +=
      movement < 0 ? Math.ceil(movement) : Math.floor(movement);

    const isBackgroundOutOfCanvasOnLeft =
      this.backgroundOffset < this.backgroundImageWidth * -1;

    const isBackgroundOutOfCanvasOnRight =
      this.backgroundOffset > this.backgroundImageWidth;

    if (isBackgroundOutOfCanvasOnLeft) {
      this.backgroundOffset += this.backgroundImageWidth;
    } else if (isBackgroundOutOfCanvasOnRight) {
      this.backgroundOffset -= this.backgroundImageWidth;
    }
  }

  private drawBackgroundPack(drawBoundaries: boolean) {
    this.ctx.save();
    this.ctx.translate(this.backgroundOffset, 0);

    // "main" background will always jump to x=0, whenever it's more
    // than one length of itself from left, so there should be
    // only one buffer image on the left
    this.drawBackground(this.backgroundImageWidth * -1);

    // drawing "main" background frame
    this.drawBackground(0, true);

    // drawing buffers on right from "main" background frame, to fill the canvas
    for (let i = 1; i <= this.backgroundCopiesAfter; i++) {
      this.drawBackground(this.backgroundImageWidth * i);
    }

    this.ctx.restore();
  }

  private drawBackground(offsetX = 0, drawBoundaries = false) {
    this.ctx.drawImage(this.backgroundImageEl, offsetX, 0);

    if (drawBoundaries)
      this.ctx.strokeRect(
        0,
        0,
        this.backgroundImageWidth,
        this.backgroundImageHeight
      );
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
