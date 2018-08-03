# Changelog

## 2.0.0
 - Far reaching API changes to decouple `TraceParent` from `TraceState` information.
 - Expose more low level APIs to support only `TraceParent` or `TraceState` deserialization.
 - `TraceState` must put new or changed keys to the beginning of the state.
 - Support lenient parsing of `TraceParent` from `TraceState` HTTP headers.

## 1.0.3
 - Trace state headers which contain a `=` character will drop the `=` value.

## 1.0.2
 - Parse trace state headers which contain a `=` character.

## 1.0.1
 - Align source and dist in published version.

## 1.0.0

 - Initial release
