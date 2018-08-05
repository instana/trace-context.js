# trace-context.js &nbsp; [![Build Status](https://travis-ci.org/instana/trace-context.js.svg?branch=master)](https://travis-ci.org/instana/trace-context.js) 

JavaScript Parser / serializer for the formats defined in the [W3C TraceContext specification](https://github.com/w3c/distributed-tracing/tree/master/trace_context).

---

## Installation

```shell
npm install --save trace-context
```

## Usage

```
> const {TraceParent, http} = require('trace-context');
undefined
> TraceParent.random()
TraceParent {
  version: 0,
  traceId: '9d317f18d024465ab0f9697db8e1edcc',
  spanId: '0423d687565b49c4',
  options: 1 }
> TraceParent.random().isTracedFlagSet()
true
> http.parseTraceParent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01')
TraceParent {
  version: 0,
  traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
  spanId: '00f067aa0ba902b7',
  options: 1 }
> const state = http.parseTraceState('congo=congosSecondPosition,rojo=rojosFirstPosition');
undefined
> state.get('congo')
'congosSecondPosition'
> state.set('in', http.serializeTraceParent(TraceParent.random()))
undefined
> http.serializeTraceState(state)
'in=00-2b6ad3c51c374a30a13c4af942d6a341-a5387d0485974ec9-01,congo=congosSecondPosition,rojo=rojosFirstPosition'
```
