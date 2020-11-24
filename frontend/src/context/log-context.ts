import React from 'react';
import { LogStateType, LogAction } from '../type';

export const initialLogState: LogStateType = {
  currentLogs: [],
  currentLog: {
    id: 0,
    name: '',
    projectNumber: 0,
    hoursAvailableToWork: 0,
    hoursWorked: 0,
    hoursRemaining: 0,
    notes: '',
    numberOfReviews: 0,
    reviewHours: 0,
    hoursRequiredByBim: 0,
    complete: false,
    loggedAt: new Date(),
    TaskId: -1,
  },
  showLog: false,
};

export const LogContext = React.createContext<{
  state: LogStateType;
  dispatch: React.Dispatch<LogAction>;
}>({
  state: initialLogState,
  dispatch: () => null,
});
