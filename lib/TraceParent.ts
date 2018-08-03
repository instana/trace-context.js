import {TraceState} from './TraceState';

export interface TraceParentOptions {
  version: number;
  traceId: string;
  spanId: string;
  options: number;
}

export class TraceParent {
  version: number;
  traceId: string;
  spanId: string;
  options: number;

  constructor(opts: TraceParentOptions) {
    this.version = opts.version;
    this.traceId = opts.traceId;
    this.spanId = opts.spanId
    this.options = opts.options;
  }

  isTracedFlagSet() {
    return this.isFlagSet(1);
  }

  setTracedFlag() {
    this.setFlag(1);
  }

  isFlagSet(flag: number): boolean {
    return (this.options & flag) === flag;
  }

  setFlag(flag: number): void {
    this.options = this.options | flag;
  }

  clone() {
    return new TraceParent({
      version: this.version,
      traceId: this.traceId,
      spanId: this.spanId,
      options: this.options
    });
  }
}
