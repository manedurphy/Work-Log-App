import React from 'react';
import { LogStateType, LogAction } from '../type';

export const initialLogState: LogStateType = {
  currentLog: [],
};

export const LogContext = React.createContext<{
  state: LogStateType;
  dispatch: React.Dispatch<LogAction>;
}>({
  state: initialLogState,
  dispatch: () => null,
});
