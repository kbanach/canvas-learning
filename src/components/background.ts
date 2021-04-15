export class Background {
  BACKGROUND_SPEED_PX_PER_SEC = 25;

  private backgroundImageEl: HTMLImageElement;
  private backgroundOffset: number;
  private backgroundImageWidth: number;
  //   private backgroundImageHeight: number;

  private backgroundImageRepeat: number;

  constructor(
    backgroundImgUrl: string,
    private readonly canvasEl: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly debugEl?: HTMLElement
  ) {
    this.backgroundOffset = 0;

    this.backgroundImageEl = new Image();
    this.backgroundImageEl.src = backgroundImgUrl;

    this.backgroundImageEl.onload = (elem: any) => {
      this.backgroundImageWidth = elem?.target?.width;
      //   this.backgroundImageHeight = elem?.target?.height;

      this.backgroundImageRepeat =
        Math.ceil(this.canvasEl.width / this.backgroundImageWidth) + 1;
    };
  }

  debug(msg: string): void {
    if (!this?.debugEl) return;

    this.debugEl.innerHTML = msg;
  }

  draw(delta: number): void {
    this.backgroundOffset -= Math.ceil(
      (this.BACKGROUND_SPEED_PX_PER_SEC * delta) / 1000
    );

    if (this.backgroundOffset < this.backgroundImageWidth * -1)
      this.backgroundOffset += this.backgroundImageWidth;

    this.debug(
      `[Background] this.canvasEl.width: ${this.canvasEl.width} this.backgroundImageWidth: ${this.backgroundImageWidth} this.backgroundImageRepeat:${this.backgroundImageRepeat} this.backgroundOffset: ${this.backgroundOffset}`
    );

    this.ctx.save();

    this.ctx.translate(this.backgroundOffset, 0);

    for (let i = 0; i < this.backgroundImageRepeat; i++) {
      this.ctx.drawImage(
        this.backgroundImageEl,
        this.backgroundImageWidth * i,
        0
      );
    }

    this.ctx.restore();
  }
}
