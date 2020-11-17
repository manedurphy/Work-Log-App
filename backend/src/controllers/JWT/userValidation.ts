import { body } from 'express-validator';
import { Validation } from '../Validation/Validation';

export class UserValidation extends Validation {
  public static saveUserValidation = [
    body('firstName').not().isEmpty().withMessage('Must include first name'),
    body('lastName').not().isEmpty().withMessage('Must include last name'),
    body('email').isEmail().withMessage('Invalid email'),
  ];
}
