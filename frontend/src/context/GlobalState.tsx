import React, { useReducer, useEffect } from 'react';
import combineReducers from 'react-combine-reducers';
import axios from 'axios';
import { initialTaskState } from './task-context';
import { ITask, GlobalStateType, GlobalAction, GlobalReducer } from '../type';
import { logReducer, taskReducer, userReducer } from './reducers';
import { AxiosResponse } from 'axios';
import { Tasks } from '../enums';
import { initialUserState } from './user-context';
import { initialLogState } from './log-context';
import moment from 'moment-timezone';

const [globalReducer, initialGlobalState] = combineReducers<GlobalReducer>({
  tasks: [taskReducer, initialTaskState],
  user: [userReducer, initialUserState],
  log: [logReducer, initialLogState],
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

  useEffect(() => console.log('STATE: ', state), [state]);

  useEffect(() => {
    const token = getToken();
    (async () => {
      try {
        const res: AxiosResponse<ITask[]> = await axios.get('/api/task', {
          headers: { Authorization: `Bearer ${token}` },
        });

        res.data.forEach((task) => {
          task.dateAssigned = moment(task.dateAssigned)
            .tz('America/Los_Angeles')
            .format();

          task.dueDate = moment(task.dueDate)
            .tz('America/Los_Angeles')
            .format();
        });

        dispatch({ type: Tasks.updateTasks, payload: res.data });
      } catch (error) {
        throw error;
      }
    })();
  }, []);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
