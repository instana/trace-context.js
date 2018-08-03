import {isStrict} from '../shared';

type Headers = {[k: string]: string};

describe('format/httpHeader/shared', () => {
  describe('isStrict', () => {
    it('must support missing opts', () => {
      expect(isStrict(null)).toEqual(true);
    });

    it('must support defined opts', () => {
      expect(isStrict({strict: true})).toEqual(true);
      expect(isStrict({strict: false})).toEqual(false);
    });
  });
});