import React from "react";

interface UserContextData {
  isLogged: boolean;
  loading: boolean;
  username: string;
  loginAction: (token: string) => void;
  logoutAction: () => void;
}

export const UserContext = React.createContext<UserContextData>(
  {} as UserContextData,
);
