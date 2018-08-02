export type InternalTraceState = {[key: string]: string};

export class TraceState {
  internalState: InternalTraceState;

  constructor(internalState: InternalTraceState) {
    this.internalState = internalState;
  }

  keys() {
    return Object.keys(this.internalState);
  }

  get(name: string): string {
    return this.internalState[name];
  }
}