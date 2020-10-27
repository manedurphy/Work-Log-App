import React, { useReducer, useEffect } from 'react';
import combineReducers from 'react-combine-reducers';
import axios from 'axios';
import { initialTaskState } from './task-context';
import {
  ITask,
  TaskAction,
  TaskStateType,
  UserAction,
  UserStateType,
} from '../type';
import { taskReducer, userReducer } from './reducers';
import { AxiosResponse } from 'axios';
import { Tasks } from '../enums';
import { initialUserState } from './user-context';

type GlobalStateType = {
  tasks: TaskStateType;
  user: UserStateType;
};

type GlobalAction = TaskAction | UserAction;

type GlobalReducer = (
  state: GlobalStateType,
  action: GlobalAction
) => GlobalStateType;

const [globalReducer, initialGlobalState] = combineReducers<GlobalReducer>({
  tasks: [taskReducer, initialTaskState],
  user: [userReducer, initialUserState],
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

const GlobalState: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<GlobalReducer>(
    globalReducer,
    initialGlobalState
  );

  useEffect(() => {
    const token = getToken();
    axios
      .get('/api/task', { headers: { Authorization: `Bearer ${token}` } })
      .then((res: AxiosResponse<ITask[]>) => {
        dispatch({ type: Tasks.updateTasks, payload: res.data });
      })
      .catch((err: Error) => {
        throw err;
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
