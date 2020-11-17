import { body } from 'express-validator';

export class Uservalidation {
  public static saveUserValidation = [
    body('firstName').not().isEmpty().withMessage('Must include first name'),
    body('lastName').not().isEmpty().withMessage('Must include last name'),
    body('email').isEmail().withMessage('Invalid email'),
  ];
}
