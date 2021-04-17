export class DebugLog {
  private currentContent: string;

  constructor(
    private readonly tag: string,
    private readonly container: HTMLElement
  ) {}

  setContent(content: string): DebugLog {
    this.currentContent = content;
    return this;
  }

  print(): void {
    this.container.innerHTML = `[${this.tag}] ${this.currentContent}`;
  }
}
