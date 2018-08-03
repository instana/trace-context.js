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
    expect(state.keys()).toEqual(['c', 'a', 'b',]);
    expect(state.get('c')).toEqual('3');
  });

  it('must replace keys and move them to the front', () => {
    const state = new TraceState({a: '1', b: '2'});
    state.set('b', '3');
    expect(state.keys()).toEqual(['b', 'a']);
    expect(state.get('a')).toEqual('1');
    expect(state.get('b')).toEqual('3');
  });
});