import {v4} from 'uuid';

export function randomTraceId() {
  return v4().split('-').join('');
}

export function randomSpanId() {
  return v4().split('-').join('').slice(0, 16);
}