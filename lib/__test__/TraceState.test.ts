import {TraceContext} from '../TraceContext';
import {TraceState} from '../TraceState';

describe('TraceState', () => {
  it('must clone', () => {
    const input = new TraceState({a: '1'});
    const clone = input.clone();
    expect(clone).not.toBe(input);
    expect(clone.internalState).not.toBe(input.internalState);
  });

  it('must add new keys', () => {
    const state = new TraceState({a: '1', b: '2'});
    state.set('c', '3');
    expect(state.keys()).toEqual(['a', 'b', 'c']);
    expect(state.get('c')).toEqual('3');
  });

  it('must replace keys', () => {
    const state = new TraceState({a: '1', b: '2'});
    state.set('a', '3');
    expect(state.keys()).toEqual(['a', 'b']);
    expect(state.get('a')).toEqual('3');
  });
});