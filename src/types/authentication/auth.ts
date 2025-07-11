// src/types/auth.ts
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  headers: {
    accessToken: string;
    client: string;
    uid: string;
  };
  data: any;
};