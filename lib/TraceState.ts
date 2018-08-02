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

  set(name: string, value: string): void {
    this.internalState[name] = value;
  }

  clone() {
    const clonedInternalState: InternalTraceState = Object.keys(this.internalState)
      .reduce((agg: InternalTraceState, k: string) => {
        agg[k] = this.internalState[k];
        return agg;
      }, {});
    return new TraceState(clonedInternalState);
  }
}