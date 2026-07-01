import { SetStateAction } from "react";
import type { IconType } from "react-icons";

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
  elo: number;
  _count: {
    followers: number;
  }
}

export type SessionPayload = {
  expireAt: Date;
  userId: string;
  name: string;
  iat?: number;
  exp?: number;
};

export type CookiesType = {
  session: string;
  userId: string;
}

export type StreamCardsInfoType = {
  p1: string;
  p1Time: string;
  p2: string;
  p2Time: string;
  mode: 'Blitz' | 'Rapid' | 'Classic';
}

export type ChessPiecesType = {
  'r': IconType;
  'n': IconType;
  'b': IconType;
  'q': IconType;
  'k': IconType;
  'p': IconType;
}

export type PlaySettingsType = {
  chat: boolean;
  stream: boolean;
  privateChat: boolean;
}

export type Mode = 'Blitz' | 'Rapid' | 'Classic' | 'Bullet';

export type Outcome = 'W' | 'L' | 'D';

export type GameHistoryType = {
  players: ({
    player: {
      id: string;
      name: string;
    };
  } & {
    id: string;
    userId: string;
    outcome: Outcome;
    gameId: string;
  })[];
} & {
  id: string;
  date: Date;
  fen: string;
  moves: string;
  mode: Mode;
}

export type UserStatType =  {
  name: string;
  id: string;
  email: string;
  image: string | null;
  elo: number;
  _count: {
    followers: number;
  };
  win: number;
  draw: number;
  lose: number;
}

export type PlayersType = {
  name: string;
  id: string;
  email: string;
  image: string | null;
  elo: number;
  status: 'online' | 'offline';
  playing: 'not playing' | 'playing';
  stream: 'not streaming' | 'streaming';
}