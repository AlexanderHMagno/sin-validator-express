import { Request, Response } from 'express';
import { z } from 'zod';
import Validator from '../utils/Validator';
``;
export const validateSin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const sinSchema = z
    .string()
    .transform((input) => input.replace(/\s+/g, '')) // Remove spaces
    .refine((sanitized) => !Validator.alphaNumericValues(sanitized), {
      message: Validator.errorMessages.lettersIncluded,
    })
    .refine((sanitized) => Validator.lengthAlgorithm(sanitized), {
      message: Validator.errorMessages.incompleteDigits,
    });

  try {
    const sanitizedSin = sinSchema.parse(req.params.sin);
    const validation = Validator.validate(sanitizedSin);

    if (!validation.isValid) {
      res.status(400).json(validation);
      return;
    }

    res.json({ isValid: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ isValid: false, errors: error.errors.map((e) => e.message) });
      return;
    }

    res
      .status(500)
      .json({ isValid: false, errors: ['An unexpected error occurred.'] });
  }
};
