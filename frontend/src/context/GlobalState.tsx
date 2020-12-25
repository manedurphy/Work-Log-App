import React, { useReducer, useEffect } from 'react';
import combineReducers from 'react-combine-reducers';
import { initialTaskState } from './task-context';
import { initialUserState } from './user-context';
import { initialLogState } from './log-context';
import { initialAlertState } from './alert-context';
import { initialDateState } from './date-context';
import { initialProductivityState } from './productivity-context';
import { initialHoursWorked } from './hours-context';
import {
  GlobalStateType,
  GlobalAction,
  GlobalReducer,
} from '../global/types/type';
import {
  alertReducer,
  dateReducer,
  hoursWorkedReducer,
  logReducer,
  productivityReducer,
  taskReducer,
  userReducer,
} from './reducers';

const [globalReducer, initialGlobalState] = combineReducers<GlobalReducer>({
  tasks: [taskReducer, initialTaskState],
  user: [userReducer, initialUserState],
  log: [logReducer, initialLogState],
  alerts: [alertReducer, initialAlertState],
  date: [dateReducer, initialDateState],
  productivity: [productivityReducer, initialProductivityState],
  hoursWorked: [hoursWorkedReducer, initialHoursWorked],
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

  // useEffect(() => console.log('STATE: ', state), [state]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
