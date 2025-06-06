import Joi from 'joi';
import { Request } from 'express';

// Validation schemas
export const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name cannot exceed 100 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email address',
    'string.empty': 'Email is required'
  }),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
      'string.empty': 'Password is required'
    })
});

export const fundSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be positive',
    'number.precision': 'Amount can have up to 2 decimal places',
    'any.required': 'Amount is required'
  }),
  reference: Joi.string().required().messages({
    'string.empty': 'Transaction reference is required'
  })
});

export const transferSchema = Joi.object({
  recipientEmail: Joi.string().email().required().messages({
    'string.email': 'Recipient email must be valid',
    'string.empty': 'Recipient email is required'
  }),
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be positive',
    'number.precision': 'Amount can have up to 2 decimal places',
    'any.required': 'Amount is required'
  })
});

export const withdrawSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be positive',
    'number.precision': 'Amount can have up to 2 decimal places',
    'any.required': 'Amount is required'
  })
});

// Validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: any, next: any) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.context?.label || detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      return res.status(400).json({ errors });
    }

    next();
  };
};
// Validation for user creation, funding, transferring, and withdrawing.
export const validateUserCreation = validate(userSchema);
export const validateFund = validate(fundSchema);
export const validateTransfer = validate(transferSchema);
export const validateWithdraw = validate(withdrawSchema);

export const validateEmail = (email: string) => {
  return Joi.string().email().validate(email);
};

export const validatePassword = (password: string) => {
  return Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .validate(password);
};