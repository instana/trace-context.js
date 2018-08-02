/* eslint-disable no-bitwise, no-restricted-syntax */

'use strict';

var traceParentHeaderName = 'traceparent';
var traceStateHeaderName = 'tracestate';

// formats
var supportedVersion = '00';
var traceIdFormat = /^[0-9a-f]{32}$/i;
var spanIdFormat = /^[0-9a-f]{16}$/i;
var invalidIdFormat = /^0+$/i;
var traceOptionFormat = /^[0-9]{2}$/;

// options
var flagTraced = 1;

// trace state
var maximumTraceStateItems = 32;
var maximumTraceStateLength = 512;

function extract(headerGetter) {
  var traceParent = parseTraceParent(headerGetter(traceParentHeaderName));
  if (traceParent == null) {
    return null;
  }

  var traceState = parseTraceState(headerGetter(traceStateHeaderName));
  if (traceState == null) {
    return null;
  }

  return new TraceContext(
    traceParent.version,
    traceParent.traceId,
    traceParent.spanId,
    traceParent.options,
    traceState
  );
}

function parseTraceParent(s) {
  if (s == null) {
    return null;
  }

  var parts = s.split('-');
  if (parts.length !== 4) {
    return null;
  }

  if (parts[0] !== supportedVersion) {
    return null;
  }

  if (!traceIdFormat.test(parts[1]) || invalidIdFormat.test(parts[1])) {
    return null;
  }

  if (!spanIdFormat.test(parts[2]) || invalidIdFormat.test(parts[2])) {
    return null;
  }

  if (!traceOptionFormat.test(parts[3])) {
    return null;
  }

  return {
    version: parts[0],
    traceId: parts[1],
    spanId: parts[2],
    options: parseInt(parts[3], 16)
  };
}

function parseTraceState(s) {
  if (
    s == null ||
    // If the length of a combined header is more than 512 bytes it SHOULD be ignored.
    s.length > maximumTraceStateLength
  ) {
    return null;
  }

  // TODO validate maximum number of items
  var states = s.split(',').reduce(function(agg, part) {
    var parts = part.split('=');
    if (parts.length === 2) {
      // TODO validate key/value constraints defined in the spec
      agg[parts[0].trim()] = parts[1].trim();
    }
    return agg;
  }, {});
  return states;
}

function TraceContext(version, traceId, spanId, options, traceState) {
  this.version = version;
  this.traceId = traceId;
  this.spanId = spanId;
  this.options = options;
  this.states = traceState;
}

TraceContext.prototype.isTraced = function() {
  return this.isFlagSet(flagTraced);
};

TraceContext.prototype.isFlagSet = function(flag) {
  return (this.options & flag) === flag;
};

TraceContext.prototype.getTraceParentHeader = function() {
  return this.version + '-' + this.traceId + '-' + this.spanId + this.options.toString(16);
};

TraceContext.prototype.getTraceStateHeader = function() {
  return Object.keys(this.states).reduce(function(agg, key) {
    agg.push(key + '=' + this.states[key]);
    return agg;
  }, []).join(',');
};

TraceContext.prototype.with = function(args) {


  var statesClone = {};
  for (var key in this.states) {
    if (Object.prototype.hasOwnProperty.call(this.states, key)) {
      statesClone[key] = this.states[key];
    }
  }

};
