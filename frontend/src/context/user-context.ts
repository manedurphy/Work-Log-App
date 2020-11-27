import React from 'react';
import { UserStateType, UserAction } from '../global/types/type';

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
