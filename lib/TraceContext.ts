import {TraceState} from './TraceState';

export interface TraceContextOptions {
  version: number;
  traceId: string;
  spanId: string;
  options: number;
  state: TraceState;
}

export class TraceContext {
  version: number;
  traceId: string;
  spanId: string;
  options: number;
  state: TraceState;

  constructor(opts: TraceContextOptions) {
    this.version = opts.version;
    this.traceId = opts.traceId;
    this.spanId = opts.spanId
    this.options = opts.options;
    this.state = opts.state;
  }
}
