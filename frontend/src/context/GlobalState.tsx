import React, { useReducer, useEffect } from 'react';
import combineReducers from 'react-combine-reducers';
import axios from 'axios';
import { initialTaskState } from './task-context';
import {
  ITask,
  GlobalStateType,
  GlobalAction,
  GlobalReducer,
  ILog,
} from '../type';
import { alertReducer, logReducer, taskReducer, userReducer } from './reducers';
import { AxiosResponse } from 'axios';
import { initialUserState } from './user-context';
import { initialLogState } from './log-context';
import moment from 'moment-timezone';
import { initialAlertState } from './alert-context';

const [globalReducer, initialGlobalState] = combineReducers<GlobalReducer>({
  tasks: [taskReducer, initialTaskState],
  user: [userReducer, initialUserState],
  log: [logReducer, initialLogState],
  alerts: [alertReducer, initialAlertState],
});

export const GlobalContext = React.createContext<{
  state: GlobalStateType;
  dispatch: React.Dispatch<GlobalAction>;
}>({
  state: initialGlobalState,
  dispatch: () => null,
});

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getTasks = async (showComplete: boolean) => {
  const res: AxiosResponse<ITask[]> = await axios.get(
    showComplete ? '/api/archive' : '/api/task',
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  res.data.forEach((task) => {
    task.dateAssigned = moment(task.dateAssigned)
      .tz('America/Los_Angeles')
      .format();

    task.dueDate = moment(task.dueDate).tz('America/Los_Angeles').format();
  });

  return res.data;
};

export const getLogs = async (projectNumber: number) => {
  const res: AxiosResponse<ILog[]> = await axios.get(
    `api/log/task/${projectNumber}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  res.data.forEach((log) => {
    log.loggedAt = moment(log.loggedAt).tz('America/Los_Angeles').format();
  });
  return res.data;
};

const GlobalState: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<GlobalReducer>(
    globalReducer,
    initialGlobalState
  );

  useEffect(() => console.log('STATE: ', state), [state]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
