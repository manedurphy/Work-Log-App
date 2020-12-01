import { TaskStateType, TaskAction } from '../global/types/type';
import { Alerts, Dates, Logs, Tasks, Users } from '../enums';

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
    case Tasks.removeForm:
      return { ...taskState, showForm: action.payload };
    case Tasks.setEdit:
      return { ...taskState, edit: action.payload };
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
    case Logs.setEditLog:
      return { ...logState, edit: action.payload };
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

export const dateReducer = (dateState: any, action: any) => {
  switch (action.type) {
    case Dates.setDateAndTasksDue:
      return {
        ...dateState,
        dueDate: action.payload.dueDate,
        tasksDue: action.payload.tasksDue,
      };
    default:
      return dateState;
  }
};
