import { formatZodError } from "../utils/helpers.js";

export const validateZod = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    console.error("Validation Error:", error);

    res.status(400).json({
      success: false,
      errors: formatZodError(error),
    });
  }
};