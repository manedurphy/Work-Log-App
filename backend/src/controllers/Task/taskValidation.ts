import { body } from 'express-validator';

export class TaskValidation {
  public static saveTaskValidation = [
    body('name').not().isEmpty().withMessage('Task name is missing'),
    body('projectNumber')
      .not()
      .isEmpty()
      .withMessage('Project number is missing'),
    body('hoursAvailableToWork')
      .not()
      .isEmpty()
      .withMessage('Please enter available hours'),
    body('numberOfReviews')
      .not()
      .isEmpty()
      .withMessage('Number of reviews is missing'),
    body('reviewHours').not().isEmpty().withMessage('Review hours is missing'),
    body('hoursRequiredByBim')
      .not()
      .isEmpty()
      .withMessage('Hours required by BIM is missing'),
  ];
}
