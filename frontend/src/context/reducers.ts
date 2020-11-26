import { TaskStateType, TaskAction } from '../type';
import { Alerts, Logs, Tasks, Users } from '../enums';

export const taskReducer = (
  taskState: TaskStateType,
  action: TaskAction
): TaskStateType => {
  switch (action.type) {
    case Tasks.updateTasks:
      return {
        ...taskState,
        currentTasks: action.payload,
        edit: false,
        showForm: false,
      };
    case Tasks.updateTask:
      return {
        ...taskState,
        currentTask: action.payload,
        edit: true,
        showCompleted: false,
        showForm: true,
      };
    case Tasks.setShowCompleted:
      return {
        ...taskState,
        showCompleted: action.payload,
        edit: false,
        showForm: false,
      };
    case Tasks.setShowForm:
      return { ...taskState, showForm: true };
    default:
      return taskState;
  }
};

export const userReducer = (userState: any, action: any) => {
  switch (action.type) {
    case Users.clearUser:
    case Users.setUser:
      return action.payload;
    default:
      return userState;
  }
};

export const logReducer = (logState: any, action: any) => {
  switch (action.type) {
    case Logs.setLogs:
      return { ...logState, currentLogs: action.payload, edit: false };
    case Logs.setLog:
      return { ...logState, currentLog: action.payload, edit: true };
    case Logs.setShowLog:
      return { ...logState, showLog: action.payload };
    default:
      return logState;
  }
};

export const alertReducer = (alertState: any, action: any) => {
  switch (action.type) {
    case Alerts.setAlerts:
      return [...alertState, action.payload];
    case Alerts.removeAlerts:
      return action.payload;
    default:
      return alertState;
  }
};
