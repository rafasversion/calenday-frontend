import { fetchApi } from "./api";
import type { LoginResponse } from "../types/loginResponse";

export const authService = async (options: RequestInit) => {
  return await fetchApi<LoginResponse>("/login", {
    ...options,
    method: "POST",
  });
};

export const tokenValidate = async (
  token: string,
): Promise<boolean> => {
  const data = await fetchApi<{
    id: number;
    username: string;
  }>("/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return !!data;
};

export const googleLoginService = async (
  token: string,
  email: string,
  username?: string,
  picture?: string,
) => {
  return await fetchApi<LoginResponse>("/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      email,
      username,
      picture,
    }),
  });
};