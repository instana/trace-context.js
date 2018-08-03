import {getHeader, setHeader, ParsingOptions, isStrict} from './shared';
import {TraceState, InternalTraceState} from '../../TraceState';

export const headerName = 'tracestate';

const maximumTraceStateItems = 32;
const maximumTraceStateLength = 512;

export function extract(headerGetter: getHeader, opts: ParsingOptions | null): TraceState | null {
  return parse(headerGetter(headerName), opts);
}

export function parse(s: string | null, opts: ParsingOptions | null): TraceState | null {
  const strict = isStrict(opts);

  if (
    s == null ||
    (strict && s.length > maximumTraceStateLength)
  ) {
    return null;
  }

  // TODO validate maximum number of items
  var states = s.split(',').reduce(function(agg: InternalTraceState, part: string) {
    var i = part.indexOf('=');
    if (i !== -1) {
      // TODO validate key/value constraints defined in the spec
      agg[part.slice(0, i)] = part.slice(i + 1, part.length);
    }
    return agg;
  }, {});

  return new TraceState(states);
}

export function inject(headerSetter: setHeader, state: TraceState) {
  headerSetter(headerName, serialize(state));
}

export function serialize(state: TraceState): string {
  return state.keys()
    .reduce((agg: Array<String>, key) => {
      agg.push(`${key}=${state.get(key)}`);
      return agg;
    }, []).join(',');
}
