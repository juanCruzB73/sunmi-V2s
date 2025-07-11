export interface IUser {
  userId: number | null;
  email: string;
  name: string;
  accessToken?: string;
  client?: string;
  uid?: string;
}

export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: IUser }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" };


export type AddUserAction = {
    type: string;
    userData: IUser;
}
export type UpdateUserAction = {
    type: string;
    index: number;
    userData: IUser;
}
export type RemoveUserAction = {
    type: string;
    index: number;
}

export type UserListAction = AddUserAction | UpdateUserAction | RemoveUserAction;

export type AuthState = {
    status:"non-authenticated"|"authenticated"
    info:IUser|null;
    errorMessage:string|null;
};