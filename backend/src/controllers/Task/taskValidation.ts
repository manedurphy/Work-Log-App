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
    body('hoursWorked')
      .not()
      .isEmpty()
      .withMessage('Please enter the numbers of hours worked'),
    body('reviewHours')
      .not()
      .isEmpty()
      .withMessage('Please enter the number of review hours'),
    body('numberOfReviews')
      .not()
      .isEmpty()
      .withMessage('Number of reviews is missing'),
    body('hoursRequiredByBim')
      .not()
      .isEmpty()
      .withMessage('Hours required by BIM is missing'),
  ];
}
