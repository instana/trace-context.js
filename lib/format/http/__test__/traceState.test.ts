import {range} from 'lodash';

import { parse, serialize, extract, inject, headerName } from '../traceState';

type Headers = {[k: string]: string};

const validHeader = 'congo=congosSecondPosition,rojo=rojosFirstPosition';

describe('format/httpHeader/traceState', () => {
  describe('parse', () => {
    it('must successfully parse valid header', () => {
      const state = parse(validHeader, null);
      expect(state).not.toEqual(null);

      if (state != null) {
        expect(state.get('congo')).toEqual('congosSecondPosition');
        expect(state.get('rojo')).toEqual('rojosFirstPosition');
        expect(state.keys()).toEqual(['congo', 'rojo']);
      }
    });

    it('must fail on missing header', () => {
      testFailingParse(null);
    });

    it('must fail when the header is too long', () => {
      testFailingParse('a=' + range(510).map(() => 'b'));
    });

    it('must drop states which cannot be parsed', () => {
      const state = parse('a=1,b,c=3', null);
      expect(state).not.toEqual(null);

      if (state != null) {
        expect(state.get('a')).toEqual('1');
        expect(state.get('b')).toEqual(undefined);
        expect(state.get('c')).toEqual('3');
      }
    });

    it('must parse states that only have a single value with an equal sign', () => {
      const state = parse('a=1=', null);
      expect(state).not.toEqual(null);

      if (state != null) {
        expect(state.get('a')).toEqual('1=');
      }
    });

    function testFailingParse(headerValue: string | null) {
      const state = parse(headerValue, null);
      expect(state).toEqual(null);
    }
  });

  it('must parse/serialize back and forth', () => {
    const state = parse(validHeader, null);
    expect(state).not.toEqual(null);

    if (state) {
      expect(serialize(state)).toEqual(validHeader);
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
