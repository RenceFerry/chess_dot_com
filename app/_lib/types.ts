import { type JSX, SetStateAction } from "react";
import type { IconType } from "react-icons";
import type { Socket } from "socket.io";

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

export type NotifMessage ={
  message: string;
  Node?: never;
  color?: string;
} | null;

export type NotifNode = {
  message?: never;
  Node: () => JSX.Element;
  color?: never;
} | null;

export type NotifContextType =  {
  notif: NotifMessage | NotifNode;
  setNotif: React.Dispatch<SetStateAction<NotifMessage | NotifNode>>,
} | null;

export type SettingsType = {
    chatPrivate: boolean;
    streamGame: boolean;
    chatDisable: boolean;
} | null

export type UserInfo = {
  email: string;
  name: string;
  id: string;
  image: string | null;
  elo: number;
  _count: {
    followers: number;
  },
  settings: SettingsType;
};

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
  no: number;
  p1Name: string;
  p2Name: string;
  p2Elo: number;
  p1Elo: number;
  p1Img: string | null;
  p2Img: string | null;
  mode: Mode;
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

export type PlayerStatType = UserStatType & {
  online: boolean;
  playing: boolean;
  streaming: boolean;
  followed: boolean;
}

export type PlayersType = {
  name: string;
  id: string;
  image: string | null;
  elo: number;
  online: boolean;
  playing: boolean;
  streaming: boolean;
}

export type PlayersMapObjectType = {
  userId: string;
  name: string;
  online: boolean;
  socket: Map<string, {
    playing: boolean;
    streaming: boolean;
    socket: Socket;
  }>;
}

export type UserUpdateType = {
  email: string;
  name: string;
  file: File | string;
}

export type UserUpdateSchemaErrorType = {
  errors: string[];
  properties?: {
    email?: {
      errors: string[];
    } | undefined;
    name?: {
      errors: string[];
    } | undefined;
  } | undefined;
}

export type UserUpdateReturnType = {
  email: string
  name: string,
  image: string | null,
}

export type ChangePasswordDataType = { currentPass?: string, newPass: string, confirmPass: string}

export type ChangePasswordReturnType = {
  data: ChangePasswordDataType;
  error: null | ChangePasswordSchemaErrorType
  success: boolean
}

export type ChangePasswordSchemaErrorType = {
    errors: string[];
    properties?: {
        currentPass?: {
            errors: string[];
        } | undefined;
        newPass?: {
            errors: string[];
        } | undefined;
        confirmPass?: {
            errors: string[];
        } | undefined;
    } | undefined;
};

export type InvitationSendType = {
  id: string;
  name: string
  data: {
    pieceColor: 'White' | 'Black' | 'Random';
    mode: Mode;
    message: string;
    ex: number
  }
}

export type InvitationNewDataType = {
  fromId: string;
  fromName: string
  data: {
    pieceColor: 'White' | 'Black' | 'Random';
    mode: Mode;
    message: string;
    ex: number
  }
}

export type InvitationStateDataType = {
  fromId: string;
  pieceColor: 'White' | 'Black' | 'Random';
  mode: Mode;
  message: string;
  ex: number
}

export type InvitationStateType = {
  map: Map<string, InvitationStateDataType>;
  keys: Array<string>;
}

export type ShowInvitationCardContextType = {
  showInvitationCard: InvitationAcceptDataType | null;
  setShowInvitationCard: React.Dispatch<SetStateAction<InvitationAcceptDataType | null>>;
} | null

export type PlayerInfo = {
  name: string,
  id: string, 
  elo: number,
  image: string | null
}

export type InvitationAcceptDataType = InvitationNewDataType & {
  toName: string;
  toId: string;
  toUserId?: string
}

export type ConfirmationContextType = {
  confirmation: InvitationAcceptDataType | null;
  setConfirmation: React.Dispatch<SetStateAction<InvitationAcceptDataType | null>>;
}

export type GameDetailsType = {
  toId: string;
  toName: string;
  fromId: string;
  fromName: string;
  toColor: string;
  fromColor: string;
  mode: Mode;
}

export type GameDetailsContextType = {
  gameDetails: GameDetailsType | null;
  setGameDetails: React.Dispatch<SetStateAction<GameDetailsType | null>>;
} | null