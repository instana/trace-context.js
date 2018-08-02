export type InternalTraceState = {[key: string]: string};

export class TraceState {
  internalState: InternalTraceState;

  constructor(internalState: InternalTraceState) {
    this.internalState = internalState;
  }

  get(name: string): string | null {
    return this.internalState[name];
  }
}