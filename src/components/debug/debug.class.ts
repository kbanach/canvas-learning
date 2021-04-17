import { DebugLog } from './debug-log.class';

export class Debug {
  private readonly debugEl: Element;

  private debugRefreshStack = 0;
  private debugFps: number;

  private debugLogs: Map<string, DebugLog> = new Map();

  constructor(debugOutputSelector: string) {
    const el = document.querySelector(debugOutputSelector);
    this.debugFps = 10;

    if (!el) throw new Error('Could not find element for debugging output');

    this.debugEl = el;
  }

  getLogger(tag: string): DebugLog {
    const foundLog = this.debugLogs.get(tag);

    if (foundLog) {
      return foundLog;
    }

    const newLogContainer = document.createElement('div');
    newLogContainer.innerHTML = `<h1>${tag}</h1><div class="logContent"></div>`;
    this.debugEl.appendChild(newLogContainer);
    const newDebugLog = new DebugLog(
      tag,
      newLogContainer.querySelector('.logContent') as HTMLElement
    );

    this.debugLogs.set(tag, newDebugLog);

    return newDebugLog;
  }

  printLogs(delta: number): void {
    this.debugRefreshStack += Math.floor(delta);
    if (this.debugFps !== -1 && this.debugRefreshStack < 1000 / this.debugFps)
      return;

    this.debugRefreshStack = 0;

    Array.from(this.debugLogs).forEach(([_, dl]) => dl.print());
  }
}
