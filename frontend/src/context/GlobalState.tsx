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
