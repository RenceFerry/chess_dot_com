import { Server } from 'socket.io';
import { PlayersMapObjectType, StreamCardsInfoType } from './app/_lib/types';

declare global {
  var io: Server | undefined;
  var streamsInfos: Map<string, StreamCardsInfoType> | undefined;
  var streamsKeys: string[] | undefined;
  var userStatus: Map<string, PlayersMapObjectType> | undefined;
}

export {};