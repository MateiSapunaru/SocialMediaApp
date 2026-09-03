const { body } = require('express-validator');

const createPostValidation = [
  body('title')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be at most 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
];

const commentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
];

module.exports = { createPostValidation, commentValidation };
