import {TraceContext} from '../TraceContext';
import {TraceState} from '../TraceState';

describe('TraceContext', () => {
  describe('flags', () => {
    it('must identify whether tracing is enabled', () => {
      expect(getTraceContextWithOptions(1).isTracedFlagSet()).toEqual(true);
      expect(getTraceContextWithOptions(0).isTracedFlagSet()).toEqual(false);
    });

    it('must identify other flags as well', () => {
      expect(getTraceContextWithOptions(2).isFlagSet(1)).toEqual(false);
      expect(getTraceContextWithOptions(3).isFlagSet(4)).toEqual(false);
      expect(getTraceContextWithOptions(3).isFlagSet(1)).toEqual(true);
      expect(getTraceContextWithOptions(3).isFlagSet(2)).toEqual(true);
    });

    function getTraceContextWithOptions(options: number): TraceContext {
      return new TraceContext({
        version: 0,
        traceId: 'abc',
        spanId: 'abc',
        options,
        state: new TraceState({})
      });
    }
  });
});