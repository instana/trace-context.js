import {TraceParent} from '../TraceParent';
import {TraceState} from '../TraceState';

describe('TraceParent', () => {
  describe('flags', () => {
    it('must identify whether tracing is enabled', () => {
      expect(getTraceParentWithOptions(1).isTracedFlagSet()).toEqual(true);
      expect(getTraceParentWithOptions(0).isTracedFlagSet()).toEqual(false);
    });

    it('must identify other flags as well', () => {
      expect(getTraceParentWithOptions(2).isFlagSet(1)).toEqual(false);
      expect(getTraceParentWithOptions(3).isFlagSet(4)).toEqual(false);
      expect(getTraceParentWithOptions(3).isFlagSet(1)).toEqual(true);
      expect(getTraceParentWithOptions(3).isFlagSet(2)).toEqual(true);
    });

    it('must set flags', () => {
      const ctx = getTraceParentWithOptions(0);
      ctx.setTracedFlag();
      expect(ctx.isFlagSet(1)).toEqual(true);
      expect(ctx.isFlagSet(2)).toEqual(false);

      ctx.setFlag(2);
      expect(ctx.isFlagSet(1)).toEqual(true);
      expect(ctx.isFlagSet(2)).toEqual(true);
    });

    function getTraceParentWithOptions(options: number): TraceParent {
      return new TraceParent({
        version: 0,
        traceId: 'abc',
        spanId: 'abc',
        options
      });
    }
  });

  it('must clone', () => {
    const input = new TraceParent({
      version: 0,
      traceId: 'abc',
      spanId: 'abc',
      options: 0
    });
    const clone = input.clone();
    expect(clone).not.toBe(input);
  });

  describe('random', () => {
    it('must generate parents', () => {
      const parent = TraceParent.random();
      expect(parent.version).toEqual(0);
      expect(parent.traceId.length).toEqual(32);
      expect(parent.spanId.length).toEqual(16);
      expect(parent.isTracedFlagSet()).toEqual(true);
    });

    it('must generate random parents', () => {
      expect(TraceParent.random()).not.toEqual(TraceParent.random());
    });
  });
});