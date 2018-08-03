import { parse, serialize, extract, inject, headerName } from '../traceParent';

type Headers = {[k: string]: string};

const validHeader = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';

describe('format/httpHeader/traceParent', () => {
  describe('parse', () => {
    it('must successfully parse valid header', () => {
      const ctx = parse(validHeader, null);
      expect(ctx).not.toEqual(null);

      if (ctx != null) {
        expect(ctx.version).toEqual(0);
        expect(ctx.traceId).toEqual('4bf92f3577b34da6a3ce929d0e0e4736');
        expect(ctx.spanId).toEqual('00f067aa0ba902b7');
        expect(ctx.options).toEqual(1);
      }
    });

    it('must fail on missing header', () => {
      testFailingParse(null);
    });

    it('must fail on wrong traceparent header structure', () => {
      testFailingParse('00-01-01');
    });

    it('must fail on unsupported version', () => {
      testFailingParse('01-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');
    });

    describe('trace ID', () => {
      it('must fail on wrong structure', () => {
        testFailingParse('00-ZZf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');
      });

      it('must fail on wrong length', () => {
        testFailingParse('00-aa-00f067aa0ba902b7-01');
      });

      it('must fail on binary zero', () => {
        testFailingParse('00-00000000000000000000000000000000-00f067aa0ba902b7-01');
      });
    });

    describe('span ID', () => {
      it('must fail on wrong structure', () => {
        testFailingParse('00-4bf92f3577b34da6a3ce929d0e0e4736-Z0f067aa0ba902b7-01');
      });

      it('must fail on wrong length', () => {
        testFailingParse('00-4bf92f3577b34da6a3ce929d0e0e4736-b7-01');
      });

      it('must fail on binary zero', () => {
        testFailingParse('00-4bf92f3577b34da6a3ce929d0e0e4736-0000000000000000-01');
      });
    });

    it('must fail on invalid option format', () => {
      testFailingParse('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-ZZ');
    });

    function testFailingParse(headerValue: string | null) {
      const ctx = parse(headerValue, null);
      expect(ctx).toEqual(null);
    }
  });

  it('must parse/serialize back and forth', () => {
    const ctx = parse(validHeader, null);
    expect(ctx).not.toEqual(null);

    if (ctx) {
      expect(serialize(ctx)).toEqual(validHeader);
    }
  });

  it('must extract/inkect back and forth', () => {
    const input: Headers = {
      [headerName]: validHeader
    };
    const state = extract(name => input[headerName], null);
    expect(state).not.toEqual(null);

    if (state) {
      const output: Headers = {};
      inject((k, v) => output[k] = v, state);
      expect(output).toEqual(input);
    }
  });
});
