import { Document, Types } from 'mongoose';

export interface ITaskModel extends Document {
  name: string;
  projectNumber: number;
  hours: {
    hoursAvailableToWork: number;
    hoursWorked: number;
    hoursRemaining: number;
  };
  description: string;
  reviews: {
    numberOfReviews: number;
    reviewHours: number;
    hoursRequiredByBim: number;
  };
  complete: boolean;
  userId: Types.ObjectId;
}
