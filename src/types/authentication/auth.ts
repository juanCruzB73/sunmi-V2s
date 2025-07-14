// src/types/auth.ts
export type LoginPayload = {
  email: string;
  password: string;
};

export interface IAuthHeaders {
  accessToken: string;
  client: string;
  uid: string;
}

export type LoginResponse = {
  headers: IAuthHeaders;
  data: any;
};