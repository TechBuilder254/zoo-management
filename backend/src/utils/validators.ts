import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
];

export const bookingValidation = [
  body('visitDate').isISO8601().withMessage('Visit date must be a valid date'),
  body('ticketType').notEmpty().withMessage('Ticket type is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];


