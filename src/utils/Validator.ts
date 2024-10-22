export default class SinValidator {
  // Define error messages as a class property
  public static errorMessages: { [key: string]: string } = {
    incompleteDigits:
      "Well Well, it looks like your SIN doesn't have 9 digits, try again",
    lettersIncluded:
      'Well Well, have you seen a SIN with letters?, Please add a Valid SIN',
    luhnTestIncorrect: 'Mr Hans Peter Luhn says this is not a valid SIN',
  };

  // Method to validate SIN based on length, characters, and Luhn algorithm
  public static validate(sin: string): { isValid: boolean; errors?: string[] } {
    const sanitizedSin = sin.replace(/\s+/g, '');

    // Check for non-numeric characters
    if (this.alphaNumericValues(sanitizedSin)) {
      return {
        isValid: false,
        errors: [this.errorMessages.lettersIncluded],
      };
    }

    // Check for length of 9 digits
    if (!this.lengthAlgorithm(sanitizedSin)) {
      return {
        isValid: false,
        errors: [this.errorMessages.incompleteDigits],
      };
    }

    // Validate using the Luhn algorithm
    if (!this.luhnAlgorithm(sanitizedSin)) {
      return {
        isValid: false,
        errors: [this.errorMessages.luhnTestIncorrect],
      };
    }

    return { isValid: true }; // Return valid response if all checks pass
  }

  //Check the minimum 10 digits
  public static lengthAlgorithm(sanitizedSin: string): boolean {
    return /^\d{9}$/.test(sanitizedSin);
  }

  public static alphaNumericValues(sanitizedSin: string): boolean {
    return /[a-zA-Z]/.test(sanitizedSin);
  }

  // Luhn algorithm implementation
  public static luhnAlgorithm(sanitizedSin: string): boolean {
    let sum = 0;

    for (let index = 0; index < sanitizedSin.length; index++) {
      const digit = Number(sanitizedSin[index]);
      if (index % 2) {
        const double = digit * 2;
        if (double >= 10) sum += 1 + (double % 10);
        else sum += double;
      } else {
        sum += digit;
      }
    }

    // Return true if the sum modulo 10 is 0
    return sum % 10 === 0;
  }
}
