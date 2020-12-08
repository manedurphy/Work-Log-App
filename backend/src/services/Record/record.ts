import { ISecureRequest } from '@overnightjs/jwt';

export class Record {
  public static createRecord(req: ISecureRequest) {
    const {
      name,
      projectNumber,
      hoursAvailableToWork,
      hoursWorked,
      notes,
      numberOfReviews,
      reviewHours,
      hoursRequiredByBim,
    } = req.body;

    const hoursRemaining =
      +hoursAvailableToWork - +hoursWorked - +reviewHours - +hoursRequiredByBim;

    return {
      name,
      projectNumber: +projectNumber,
      hoursAvailableToWork: +hoursAvailableToWork,
      hoursWorked: +hoursWorked,
      notes,
      hoursRemaining,
      numberOfReviews: +numberOfReviews,
      reviewHours: +reviewHours,
      hoursRequiredByBim: +hoursRequiredByBim,
      complete: false,
    };
  }
  public createARecord(req: ISecureRequest) {
    const {
      name,
      projectNumber,
      hoursAvailableToWork,
      hoursWorked,
      notes,
      numberOfReviews,
      reviewHours,
      hoursRequiredByBim,
    } = req.body;

    const hoursRemaining =
      +hoursAvailableToWork - +hoursWorked - +reviewHours - +hoursRequiredByBim;

    return {
      name,
      projectNumber: +projectNumber,
      hoursAvailableToWork: +hoursAvailableToWork,
      hoursWorked: +hoursWorked,
      notes,
      hoursRemaining,
      numberOfReviews: +numberOfReviews,
      reviewHours: +reviewHours,
      hoursRequiredByBim: +hoursRequiredByBim,
      complete: false,
    };
  }
}
