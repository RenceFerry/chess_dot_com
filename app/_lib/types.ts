import { SetStateAction } from "react";

export type StateAuthForm = {
  message?: string;
  error?: {
    errors: string[];
    properties?: {
      nameOrEmail?: {
        errors: string[];
      } | undefined;
      password?: {
        errors: string[];
      } | undefined;
      username?: {
        errors: string[];
      } | undefined;
      email?: {
        errors: string[];
      } | undefined;
    } | undefined;
  };
  code?: number;
  redirect?: string;
  payload?: {
    nameOrEmail?: string;
    password?: string;
    email?: string;
    username?: string;
  }
} | null;

export type Notif ={
  message: string;
  color: string;
} | null;

export type NotifContextType =  {
  notif: Notif;
  setNotif: React.Dispatch<SetStateAction<Notif>>,
} | null;

export type UserInfo = {
  email: string;
  name: string;
  id: string;
  image: string | null;
}

export type SessionPayload = {
  expireAt: Date;
  userId: string;
  name: string;
};

export type RedisOtpPayload = {
  name: string;
  otp: number;
  password: string;
} | null;