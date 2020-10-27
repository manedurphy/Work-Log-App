import { ITaskModel } from '../interfaces/task';
import { model, Schema, Types } from 'mongoose';

const taskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectNumber: {
      type: Number,
      required: true,
    },
    hours: {
      hoursAvailableToWork: {
        type: Number,
        required: true,
      },
      hoursWorked: {
        type: Number,
        required: true,
      },
      hoursRemaining: {
        type: Number,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    reviews: {
      numberOfReviews: {
        type: Number,
        required: true,
      },
      reviewHours: {
        type: Number,
        required: true,
      },
      hoursRequiredByBim: {
        type: Number,
        required: true,
      },
    },
    complete: {
      type: Boolean,
      default: false,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default model<ITaskModel>('Task', taskSchema);
