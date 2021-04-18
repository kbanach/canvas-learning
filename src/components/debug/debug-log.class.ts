export class DebugLog {
  private currentContent = '';

  constructor(
    private readonly tag: string,
    private readonly container: HTMLElement
  ) {}

  setContent(content: string): DebugLog {
    this.currentContent = content;
    return this;
  }

  print(): void {
    if (this.currentContent) this.container.innerHTML = this.currentContent;
  }
}
