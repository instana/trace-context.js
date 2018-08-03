import {getHeader, setHeader, ParsingOptions, isStrict} from './shared';
import {TraceParent} from '../../TraceParent';

export const headerName = 'traceparent';

const supportedVersion = '00';
const traceIdFormat = /^[0-9a-f]{32}$/i;
const spanIdFormat = /^[0-9a-f]{16}$/i;
const invalidIdFormat = /^0+$/i;
const traceOptionFormat = /^[0-9]{2}$/;

export function extract(headerGetter: getHeader, opts: ParsingOptions | null): TraceParent | null {
  return parse(headerGetter(headerName), opts);
}

export function parse(s: string | null, opts: ParsingOptions | null): TraceParent | null {
  const strict = isStrict(opts);

  if (s == null) {
    return null;
  }

  var parts = s.split('-');
  if (parts.length !== 4) {
    return null;
  }

  if (strict && parts[0] !== supportedVersion) {
    return null;
  }

  if (strict && (!traceIdFormat.test(parts[1]) || invalidIdFormat.test(parts[1]))) {
    return null;
  }

  if (strict && (!spanIdFormat.test(parts[2]) || invalidIdFormat.test(parts[2]))) {
    return null;
  }

  if (strict && (!traceOptionFormat.test(parts[3]))) {
    return null;
  }

  return new TraceParent({
    version: parseInt(parts[0], 16),
    traceId: parts[1],
    spanId: parts[2],
    options: parseInt(parts[3], 16)
  });
}

export function inject(headerSetter: setHeader, traceParent: TraceParent) {
  headerSetter(headerName, serialize(traceParent));
}

export function serialize(ctx: TraceParent): string {
  const version = zeroLeftPad(ctx.version.toString(16), 2);
  const traceId = zeroLeftPad(ctx.traceId, 32);
  const spanId = zeroLeftPad(ctx.spanId, 16);
  const options = zeroLeftPad(ctx.options.toString(16), 2);
  return `${version}-${traceId}-${spanId}-${options}`;
}

const zeros = '00000000000000000000000000000000'
function zeroLeftPad(str: string, width: number): string {
  return zeros.slice(0, Math.max(0, width - str.length)) + str;
}