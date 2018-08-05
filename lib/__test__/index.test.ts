import {get} from 'lodash';
import * as api from '../index';

describe('exposed API', () => {
  expectExposedFunction('TraceParent');
  expectExposedFunction('TraceState');
  expectExposedFunction('randomTraceId');
  expectExposedFunction('randomSpanId');
  expectExposedFunction('TraceState');
  expectExposedFunction('http', 'extractTraceParent');
  expectExposedFunction('http', 'injectTraceParent');
  expectExposedFunction('http', 'parseTraceParent');
  expectExposedFunction('http', 'serializeTraceParent');
  expectExposedFunction('http', 'extractTraceState');
  expectExposedFunction('http', 'injectTraceState');
  expectExposedFunction('http', 'parseTraceState');
  expectExposedFunction('http', 'serializeTraceState');

  function expectExposedFunction(...name: string[]) {
    it(`must expose ${name.join('.')}`, () => {
      expect(typeof get(api, name)).toEqual('function');
    });
  }
});

  