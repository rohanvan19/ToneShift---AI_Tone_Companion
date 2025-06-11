import { createContext } from 'react';

export const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  updateUserData: () => {},
  isLoading: true,
  isSignout: false,
  userToken: null,
  userData: null,
});