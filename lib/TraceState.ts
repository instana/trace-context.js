export type InternalTraceState = {[key: string]: string};

export class TraceState {
  internalState: InternalTraceState;

  constructor(internalState: InternalTraceState) {
    this.internalState = internalState;
  }

  keys() {
    return Object.keys(this.internalState);
  }

  get(name: string): string | undefined {
    return this.internalState[name];
  }

  set(name: string, value: string): void {
    this.internalState = {
      // ensure that the new key ends up in the beginning of the list
      [name]: value,
      ...this.internalState,
      // ensure that updates work
      [name]: value
    };
  }

  getInternalState(): InternalTraceState {
    return this.internalState;
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