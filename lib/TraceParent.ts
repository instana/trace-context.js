import {randomSpanId, randomTraceId} from './ids';

const tracedFlag = 0x1;

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
    return this.isFlagSet(tracedFlag);
  }

  setTracedFlag() {
    this.setFlag(tracedFlag);
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

  static random(): TraceParent {
    return new TraceParent({
      version: 0,
      traceId: randomTraceId(),
      spanId: randomSpanId(),
      options: tracedFlag
    });
  }
}
