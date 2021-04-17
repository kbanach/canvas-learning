import { DebugLog } from '../debug/debug-log.class';

export abstract class GameInput<T = string> {
  protected xPos = 0;
  protected yPos = 0;

  protected width = 100;
  protected height = 100;

  protected currentValue: T;

  protected onChange: (newValue: T) => void;

  constructor(
    protected readonly canvasEl: HTMLCanvasElement,
    protected readonly ctx: CanvasRenderingContext2D,
    protected readonly logger: DebugLog
  ) {}

  set value(newValue: T) {
    this.currentValue = newValue;

    this?.onChange(newValue);
  }

  get value(): T {
    return this.currentValue;
  }

  setPosition(xPos: number, yPos: number): this {
    this.xPos = xPos;
    this.yPos = yPos;

    return this;
  }

  setSize(width: number, height: number): this {
    this.width = width;
    this.height = height;

    return this;
  }

  setOnChange(cb: (newValue: T) => void): this {
    this.onChange = cb;
    return this;
  }

  abstract handleClick(clickXpos: number, clickYpos: number): void;

  abstract draw(): void;
}
