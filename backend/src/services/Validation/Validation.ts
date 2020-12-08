import { validationResult } from 'express-validator';
import { ValidateInputType } from './types';

export class Validation {
  constructor(private _errorMessage: string = '') {}

  get errorMessage() {
    return this._errorMessage;
  }

  public validateInput: ValidateInputType = (req) => {
    const errors = validationResult(req);
    const errorsPresent = !errors.isEmpty();

    if (errorsPresent) {
      this._errorMessage = errors.array()[0].msg;
    }

    return !errorsPresent;
  };
}
