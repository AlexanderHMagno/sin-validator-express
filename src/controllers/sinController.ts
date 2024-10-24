import { Request, Response } from 'express';
import { z } from 'zod';
import Validator from '../utils/Validator';
import axios from 'axios';

/**
 * function to validate a SIN (Social Insurance Number) by making a request to an internal process on this server.
 *
 * @param {Request} req - The Express request object, containing the SIN to be validated in the request parameters.
 * @param {Response} res - The Express response object, used to send the API response back to the client.
 *
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
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
    }

    res.json({ isValid: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ isValid: false, errors: error.errors.map((e) => e.message) });
    }

    res
      .status(500)
      .json({ isValid: false, errors: ['An unexpected error occurred.'] });
  }
};

/**
 * function to validate a SIN (Social Insurance Number) by making a request to an external API (Next.JS)
 *
 * @param {Request} req - The Express request object, containing the SIN to be validated in the request parameters.
 * @param {Response} res - The Express response object, used to send the API response back to the client.
 *
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const validateNextSin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const baseUrl = process.env.SIN_VALIDATOR_NEXT_BASE_URL;
  const { sin } = req.params;
  const url = `${baseUrl}/api/validate/${sin}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    //This will contain the same format that the validateSin endpoint, however this is consuming
    //the next API.
    res.status(200).json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        res.status(error.response.status).json({
          error: error.response.data,
          message: error.response.statusText,
        });
      } else if (error.request) {
        res.status(500).json({
          error: 'No response received from the SIN validator API',
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'Error in setting up the request to the SIN validator API',
          message: error.message,
        });
      }
    } else {
      res.status(500).json({
        error: 'Unexpected error occurred',
        message: 'Error in setting up the request to the SIN validator API',
      });
    }
  }
};
