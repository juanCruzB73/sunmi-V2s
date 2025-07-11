// src/services/AuthService.ts
import { API_BASE_URL } from "../config/config";
import { LoginResponse } from "../types/authentication/auth";
import type { LoginPayload } from "../types/authentication/auth";

export const AuthService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign_in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0] || "Login failed");
    }

    return {
      headers: {
        accessToken: response.headers.get("access-token") || "",
        client: response.headers.get("client") || "",
        uid: response.headers.get("uid") || "",
      },
      data,
    };
  },
};