import * as H from 'history';
import { Tasks, Users, Logs, Alerts, Dates } from '../../enums';

/** TASKS  */
export interface ITask {
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
  dateAssigned: any;
  dueDate: any;
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
  dateAssigned: any;
  dueDate: any;
}

export type TaskStateType = {
  currentTask: ITask;
  currentTasks: ITask[];
  edit: boolean;
  showForm: boolean;
  showCompleted: boolean;
};

export type TaskAction =
  | { type: Tasks.updateTasks; payload: ITask[] }
  | { type: Tasks.updateTask; payload: ITask }
  | { type: Tasks.setShowCompleted; payload: boolean }
  | { type: Tasks.setShowForm; payload: boolean }
  | { type: Tasks.removeForm; payload: boolean };

/**LOGS */
export interface ILog {
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
  loggedAt: any;
  TaskId?: number;
  createdAt?: string;
}

export interface ILogForm {
  name: string;
  projectNumber: string;
  hoursAvailableToWork: string;
  hoursWorked: string;
  notes: string | null;
  numberOfReviews: string;
  reviewHours: string;
  hoursRequiredByBim: string;
  loggedAt: any;
}

export type LogStateType = {
  currentLogs: ILog[];
  currentLog: ILog;
  showLog: boolean;
  edit: boolean;
};

export type LogAction =
  | { type: Logs.setLogs; payload: ILog[] }
  | { type: Logs.setLog; payload: ILog }
  | { type: Logs.setShowLog; payload: boolean };

/** USERS */
export interface IUser {
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

export type AlertStateType = MessageType[];

export type AlertAction =
  | { type: Alerts.setAlerts; payload: MessageType }
  | { type: Alerts.removeAlerts; payload: [] };

/** DATE STATE */
export type DateStateType = { dueDate: string; tasksDue: ITask[] };

export type DateAction = {
  type: Dates.setDate;
  payload: { dueDate: string; tasksDue: ITask[] };
};

export type MessageType = {
  message: string;
  type: 'error' | 'success' | 'info' | 'warning' | undefined;
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
  log: LogStateType;
  alerts: AlertStateType;
  date: DateStateType;
};

export type GlobalAction =
  | TaskAction
  | UserAction
  | LogAction
  | AlertAction
  | DateAction;

export type GlobalReducer = (
  state: GlobalStateType,
  action: GlobalAction
) => GlobalStateType;

export type HandleActionType = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  projectNumber: number,
  command: string
) => void;

export type HandleLogActionType = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  logItemId: number,
  command: string
) => void;
