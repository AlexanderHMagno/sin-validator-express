import SinValidator from '../utils/Validator';
import { fakeValidSins } from '../utils/sinFakeNumbers';

describe('verifySin', () => {
  it('should return an error if the SIN does not have 9 digits', async () => {
    const sin = '12345678';

    const result = SinValidator.validate(sin);

    expect(result.errors).toContain(
      SinValidator.errorMessages.incompleteDigits
    );
  });

  it('should return an error if the SIN contains non-numeric characters', async () => {
    const sin = '12345678a';

    const result = SinValidator.validate(sin);

    expect(result.errors).toContain(SinValidator.errorMessages.lettersIncluded);
  });

  it('should return an error if the SIN does not pass the Luhn algorithm', async () => {
    const sin = '123456789';

    const result = SinValidator.validate(sin);

    expect(result.errors).toContain(
      SinValidator.errorMessages.luhnTestIncorrect
    );
  });

  it('should return success if the SIN is valid', async () => {
    const sin = '0 4 6 4 5 4 2 8 6'; // This is a valid SIN for Luhn check

    const result = SinValidator.validate(sin);

    expect(result.errors).toEqual(undefined);
    expect(result.isValid).toBe(true);
  });

  it('should validate all fake valid SINs correctly', async () => {
    for (const sin of fakeValidSins) {
      const result = SinValidator.validate(sin);

      expect(result.errors).toEqual(undefined);
      expect(result.isValid).toBe(true);
    }
  });
});
