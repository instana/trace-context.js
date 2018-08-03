export type getHeader = (name: string) => string | null;
export type setHeader = (name: string, value: string) => void;

export interface ParsingOptions {
  /**
   * Whether to apply strict or relaxed HTTP header validation.
   * Strict validation will only successfully parse the headers when they
   * strictly match the spec. This means that one can trust the received
   * data a bit more, but it comes with increased parsing consts.
   */
  strict: boolean
};

const defaultParsingOptions: ParsingOptions = {
  strict: true
};

export function isStrict(opts: ParsingOptions | null): boolean {
  if (opts == null) {
    return defaultParsingOptions.strict;
  }
  return opts.hasOwnProperty('strict') ? Boolean(opts.strict) : defaultParsingOptions.strict;
}
