import { fetchApi } from "./api";
import type { LoginResponse } from "../types/loginResponse";
import { googleLoginService } from "./authService";

export const userService = {
  async login(credentials: { email: string; password: string }) {
    const response = await fetchApi<LoginResponse>("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response?.token) {
      localStorage.setItem("token", response.token);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email,
          user_picture: response.user_picture,
        }),
      );
    }

    return response;
  },

  async googleLogin(
    token: string,
    email: string,
    username?: string,
    picture?: string,
  ) {
    const response = await googleLoginService(
      token,
      email,
      username,
      picture,
    );

    if (response?.token) {
      localStorage.setItem("token", response.token);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email,
          user_picture: response.user_picture,
        }),
      );
    }

    return response;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    const username = userData.email.split("@")[0];

    return fetchApi("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        username,
      }),
    });
  },

  async getProfile(): Promise<any> {
    const token = localStorage.getItem("token");

    if (!token) return null;

    return fetchApi("/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async updateProfile(data: {
    name: string;
    email: string;
    password?: string;
  }) {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const response = await fetchApi<{
      error?: string;
      message?: string;
    }>("/user", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response && !response.error) {
      const stored = localStorage.getItem("userData");

      if (stored && stored !== "undefined") {
        const user = JSON.parse(stored);

        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...user,
            name: data.name,
            email: data.email,
          }),
        );
      }
    }

    return response;
  },

  async deleteProfile() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const response = await fetchApi("/user", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    return response;
  },
};