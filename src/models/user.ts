import { model, Schema, Types } from 'mongoose';
import { IUser } from 'src/interfaces/user';

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tasks: {
      type: [Types.ObjectId],
      ref: 'Task',
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
