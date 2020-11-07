import * as H from 'history';
import { Tasks, Users } from './enums';

/** TASKS  */
interface ITask {
  id: number;
  name: string;
  projectNumber: number;
  hoursAvailableToWork: number;
  hoursWorked: number;
  hoursRemaining: number;
  notes: string | null;
  numberOfReviews: number;
  reviewHours: number;
  hoursRequiredByBim: number;
  complete: boolean;
  UserId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITaskForm {
  name: string;
  projectNumber: string;
  hoursAvailableToWork: string;
  hoursWorked: string;
  notes: string;
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

/**ALERTS */
export type AlertType = string | null;
export type MessageType = {
  message: string;
};

export type VerifyType = {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type LoginType = {
  jwt: string;
  user: IUser;
};

export type RegisterType = {
  success: boolean;
};

/** MATCH OBJECT */
export interface IMatchParams {
  hash: string;
}

export interface IMatch<P> {
  params: P;
  isExact: boolean;
  path: string;
  url: string;
}

export interface IParams {
  hash: string;
}

export type VerifyProps = {
  match: IMatch<IParams>;
  location: H.Location;
  history: H.History;
  staticContext?: any;
};

/** GLOBALS */
export type GlobalStateType = {
  tasks: TaskStateType;
  user: UserStateType;
};

export type GlobalAction = TaskAction | UserAction;

export type GlobalReducer = (
  state: GlobalStateType,
  action: GlobalAction
) => GlobalStateType;
