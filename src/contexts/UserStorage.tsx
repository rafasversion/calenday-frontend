import React from "react";
import { UserContext } from "./UserContext";
import { tokenValidate } from "../services/authService";
import { userService } from "../services/userService";

export const UserStorage = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const logoutAction = React.useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLogged(false);
    setUsername("");
    window.location.href = "/";
  }, []);

  const validateAndFetch = React.useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLogged(false);
      setUsername("");
      setLoading(false);
      return;
    }

    try {
      const isValid = await tokenValidate(token);

      if (isValid) {
        setIsLogged(true);
        const userData = await userService.getProfile();

        if (userData) {
          setUsername(userData.username);
        }
      } else {
        logoutAction();
      }
    } catch {
      logoutAction();
    }

    setLoading(false);
  }, [logoutAction]);

  const loginAction = async (token: string) => {
    localStorage.setItem("token", token);
    setIsLogged(true);

    const userData = await userService.getProfile();

    if (userData) {
      setUsername(userData.username);
    }
  };

  React.useEffect(() => {
    validateAndFetch();
  }, [validateAndFetch]);

  return (
    <UserContext.Provider
      value={{ isLogged, loading, username, loginAction, logoutAction }}
    >
      {children}
    </UserContext.Provider>
  );
};
