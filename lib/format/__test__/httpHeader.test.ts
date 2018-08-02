import {TraceState, InternalTraceState} from '../../TraceState';
import {TraceContext} from '../../TraceContext';
import { getHeader, extract } from '../httpHeader';

type Headers = {[k: string]: string};

describe('format/httpHeader', () => {
  it('must successfully parse valid header', () => {
    const ctx = extract(k => getValidHeaders()[k]);
    expect(ctx).not.toEqual(null);

    if (ctx != null) {
      expect(ctx.version).toEqual(0);
      expect(ctx.traceId).toEqual('4bf92f3577b34da6a3ce929d0e0e4736');
      expect(ctx.spanId).toEqual('00f067aa0ba902b7');
      expect(ctx.options).toEqual(1);
      expect(ctx.state.get('congo')).toEqual('congosSecondPosition');
      expect(ctx.state.get('rojo')).toEqual('rojosFirstPosition');
    }
  });

  describe('traceparent parsing', () => {
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
      const headers = getValidHeaders();
      if (headerValue == null) {
        delete headers.traceparent;
      } else {
        headers.traceparent = headerValue;
      }
      const ctx = extract(k => headers[k]);
      expect(ctx).toEqual(null);
    }
  });

  describe('tracestate parsing', () => {
    it('must fail on missing tracestate header', () => {
      const headers = getValidHeaders();
      delete headers.tracestate;
      const ctx = extract(k => headers[k]);
      expect(ctx).toEqual(null);
    });
  });
});

function getValidHeaders(): Headers {
  return {
    'traceparent': '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    'tracestate': 'congo=congosSecondPosition,rojo=rojosFirstPosition',
  }; 
}