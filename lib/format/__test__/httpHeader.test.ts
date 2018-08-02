import {range} from 'lodash';

import {TraceContext} from '../../TraceContext';
import {TraceState} from '../../TraceState';
import { extract, inject } from '../httpHeader';

type Headers = {[k: string]: string};

describe('format/httpHeader', () => {
  describe('extract', () => {
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
      it('must fail on missing header', () => {
        testFailingParse(null);
      });

      it('must fail when the header is too long', () => {
        testFailingParse('a=' + range(510).map(() => 'b'));
      });

      it('must drop states which cannot be parsed', () => {
        const headers = getValidHeaders();
        headers.tracestate = 'a=1,b,c=3'
        const ctx = extract(k => headers[k]);
        expect(ctx).not.toEqual(null);

        if (ctx != null) {
          expect(ctx.version).toEqual(0);
          expect(ctx.traceId).toEqual('4bf92f3577b34da6a3ce929d0e0e4736');
          expect(ctx.spanId).toEqual('00f067aa0ba902b7');
          expect(ctx.options).toEqual(1);
          expect(ctx.state.get('a')).toEqual('1');
          expect(ctx.state.get('b')).toEqual(undefined);
          expect(ctx.state.get('c')).toEqual('3');
        }
      });

      it('must parse states that only have a single value with an equal sign', () => {
        const headers = getValidHeaders();
        headers.tracestate = 'a=1='
        const ctx = extract(k => headers[k]);
        expect(ctx).not.toEqual(null);

        if (ctx != null) {
          expect(ctx.state.get('a')).toEqual('1');
        }
      });

      function testFailingParse(headerValue: string | null) {
        const headers = getValidHeaders();
        if (headerValue == null) {
          delete headers.tracestate;
        } else {
          headers.tracestate = headerValue;
        }
        const ctx = extract(k => headers[k]);
        expect(ctx).toEqual(null);
      }
    });
  });

  describe('inject', () => {
    it('must inject to HTTP headers', () => {
      const ctx = new TraceContext({
        version: 0,
        traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
        spanId: '00f067aa0ba902b7',
        options: 1,
        state: new TraceState({
          congo: 'congosSecondPosition',
          rojo: 'rojosFirstPosition'
        })
      });
      const headers: Headers = {};
      inject((k, v) => headers[k] = v, ctx);
      expect(headers).toEqual(getValidHeaders());
    });
  });

  it('must extract/inject back and forth', () => {
    const given: Headers = getValidHeaders();
    const ctx = extract(k => given[k]);
    expect(ctx).not.toEqual(null);

    if (ctx) {
      const actual: Headers = {};
      inject((k, v) => actual[k] = v, ctx);
      expect(actual).toEqual(given);
    }
  });
});

function getValidHeaders(): Headers {
  return {
    'traceparent': '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    'tracestate': 'congo=congosSecondPosition,rojo=rojosFirstPosition',
  }; 
}