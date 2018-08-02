import {TraceContext} from '../TraceContext';
import {TraceState, InternalTraceState} from '../TraceState';

const traceParentHeaderName = 'traceparent';
const traceStateHeaderName = 'tracestate';

// trace parent
const supportedVersion = '00';
const traceIdFormat = /^[0-9a-f]{32}$/i;
const spanIdFormat = /^[0-9a-f]{16}$/i;
const invalidIdFormat = /^0+$/i;
const traceOptionFormat = /^[0-9]{2}$/;

// trace state
var maximumTraceStateItems = 32;
var maximumTraceStateLength = 512;

interface PartialTraceContext {
  version: number;
  traceId: string;
  spanId: string;
  options: number;
}

export type getHeader = (name: string) => string;
export type setHeader = (name: string, value: string) => void;

export function extract(headerGetter: getHeader): TraceContext | null {
  const traceParent = parseTraceParent(headerGetter(traceParentHeaderName));
  if (traceParent == null) {
    return null;
  }

  const traceState = parseTraceState(headerGetter(traceStateHeaderName));
  if (traceState == null) {
    return null;
  }

  return new TraceContext({
    version: traceParent.version,
    traceId: traceParent.traceId,
    spanId: traceParent.spanId,
    options: traceParent.options,
    state: new TraceState(traceState)
  })
}

function parseTraceParent(s: string): PartialTraceContext | null {
  if (s == null) {
    return null;
  }

  var parts = s.split('-');
  if (parts.length !== 4) {
    return null;
  }

  if (parts[0] !== supportedVersion) {
    return null;
  }

  if (!traceIdFormat.test(parts[1]) || invalidIdFormat.test(parts[1])) {
    return null;
  }

  if (!spanIdFormat.test(parts[2]) || invalidIdFormat.test(parts[2])) {
    return null;
  }

  if (!traceOptionFormat.test(parts[3])) {
    return null;
  }

  return {
    version: parseInt(parts[0], 16),
    traceId: parts[1],
    spanId: parts[2],
    options: parseInt(parts[3], 16)
  };
}

function parseTraceState(s: string): InternalTraceState | null {
  if (
    s == null ||
    s.length > maximumTraceStateLength
  ) {
    return null;
  }

  // TODO validate maximum number of items
  var states = s.split(',').reduce(function(agg: InternalTraceState, part: string) {
    var parts = part.split('=', 2);
    if (parts.length === 2) {
      // TODO validate key/value constraints defined in the spec
      agg[parts[0].trim()] = parts[1].trim();
    }
    return agg;
  }, {});
  return states;
}

export function inject(headerSetter: setHeader, ctx: TraceContext) {
  headerSetter(traceParentHeaderName, getTraceParentHttpHeader(ctx));
  headerSetter(traceStateHeaderName, getTraceStateHttpHeader(ctx.state));
}

export function getTraceParentHttpHeader(ctx: TraceContext): string {
  const version = zeroLeftPad(ctx.version.toString(16), 2);
  const traceId = zeroLeftPad(ctx.traceId, 32);
  const spanId = zeroLeftPad(ctx.spanId, 16);
  const options = zeroLeftPad(ctx.options.toString(16), 2);
  return `${version}-${traceId}-${spanId}-${options}`;
}

export function getTraceStateHttpHeader(state: TraceState): string {
  return state.keys()
    .reduce((agg: Array<String>, key) => {
      agg.push(`${key}=${state.get(key)}`);
      return agg;
    }, []).join(',');
}

const zeros = '00000000000000000000000000000000'
function zeroLeftPad(str: string, width: number): string {
  return zeros.slice(0, Math.max(0, width - str.length)) + str;
}