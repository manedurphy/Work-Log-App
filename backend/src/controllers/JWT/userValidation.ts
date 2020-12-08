import { body } from 'express-validator';
import { Validation } from '../Validation/Validation';

export class UserValidation extends Validation {
  private password: string;
  private password2: string;

  constructor(password: string, password2: string) {
    super();
    this.password = password;
    this.password2 = password2;
  }

  public verifyPasswordsMatch(): boolean {
    return this.password === this.password2;
  }

  public static saveUserValidation = [
    body('firstName').not().isEmpty().withMessage('Must include first name'),
    body('lastName').not().isEmpty().withMessage('Must include last name'),
    body('email').isEmail().withMessage('Invalid email'),
  ];
}
