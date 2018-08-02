export {TraceContext} from './TraceContext';
export {TraceState} from './TraceState';

export {
  getHeader as getHttpHeader,
  extract as exactFromHttpHeaders,
  setHeader as setHttpHeader,
  inject as injectToHttpHeaders,
  getTraceParentHttpHeader,
  getTraceStateHttpHeader
} from './format/httpHeader';