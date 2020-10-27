import { Tasks, Users } from './enums';

/** TASKS  */
interface ITask {
  _id: string;
  __v?: number;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ITaskForm {
  name: string;
  projectNumber: string;
  hoursAvailableToWork: string;
  hoursWorked: string;
  description: string;
  numberOfReviews: string;
  reviewHours: string;
  hoursRequiredByBim: string;
}

export type TaskStateType = {
  currentTask: ITask;
  currentTasks: ITask[];
  edit: boolean;
};

export type TaskAction =
  | { type: Tasks.updateTasks; payload: ITask[] }
  | { type: Tasks.updateTask; payload: ITask };

/** USERS */
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

export type UserStateType = {
  firstName: string;
  lastName: string;
  email: string;
};

export type UserAction =
  | { type: Users.setUser; payload: IUser }
  | {
      type: Users.clearUser;
      payload: {
        firstName: '';
        lastName: '';
        email: '';
      };
    };

/**Alerts */
export type AlertType = string | null;
