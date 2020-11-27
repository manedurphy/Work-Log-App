import React from 'react';
import { AlertAction, AlertStateType } from '../global/types/type';

export const initialAlertState: AlertStateType = [];

export const AlertContext = React.createContext<{
  state: AlertStateType;
  dispatch: React.Dispatch<AlertAction>;
}>({
  state: initialAlertState,
  dispatch: () => null,
});
