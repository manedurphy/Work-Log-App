import React from 'react';
import { UserStateType, UserAction } from '../type';

export const initialUserState: UserStateType = {
  firstName: '',
  lastName: '',
  email: '',
};

export const UserContext = React.createContext<{
  state: UserStateType;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialUserState,
  dispatch: () => null,
});
