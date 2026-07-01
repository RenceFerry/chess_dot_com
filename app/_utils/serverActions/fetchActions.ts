'use server';

import prisma from "@/_lib/prisma";
import { authenticate} from "./authenticate";
import type { UserInfo, UserStatType, GameHistoryType, PlayersType } from "../../_lib/types";

// fetch game history of a user
export const fetchGameHistory = async (): Promise<{ data: GameHistoryType[]; error: string | null}> => {
  const decrypted = await authenticate();

  if (!decrypted) return { data: [], error: 'unauthorized' };

  try {

    const games = await prisma.game.findMany({
      where: {
        players: {
          some: {
            userId: decrypted.userId as string,
          }
        }
      },
      include: {
        players: {
          include: {
            player: {
              select: {
                name: true,
                id: true,
              }
            }
          }
        },
      }
    })
  
    return { data: games, error: null};

  } catch(e) {
    console.log(e);
    return { data: [], error: 'failed to fetch game history' };
  }
}

// fetch user details
export const getUserDet = async (): Promise<{ data: UserInfo | null; error: string | null}> => {
  const decrypted = await authenticate();
  
  if (!decrypted) return { data: null, error: 'unauthorized' };
  
  try {
    console.log('hello a', decrypted.userId);

    const user = await prisma.users.findUnique({
      where: {
        id: decrypted.userId as string,
      },
      select: {
        name: true,
        id: true,
        image: true,
        elo: true,
        email: true,
        _count: {
          select: {
            followers: true,
          }
        }
      }
    })

    console.log('hello b');

    if (!user) {
      throw new Error();
    }

  
    return { data: user, error: null};
  } catch (e) {
    console.log(e);
    return { data: null, error: 'failed to fetch user details' };
  }

}

// fetch user stat
export const getUserStat = async (id?: string): Promise<{data: UserStatType | null, error: string | null}> => {

  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };

  // default to userID if id is not provided
  const playersId = id ? id : decrypted.userId;

  try {

    // fetch
    const [ userStat, win, draw, lose ] = await prisma.$transaction([
      prisma.users.findUnique({
        where: {
          id: playersId
        },
        select: {
          elo: true,
          name: true,
          image: true,
          email: true,
          id: true,
          _count: {
            select: {
              followers: true,
            },
          }
        }
      }),
      prisma.gamePlayer.count({
        where: {
          userId: playersId,
          outcome: 'W'
        }
      }),
      prisma.gamePlayer.count({
        where: {
          userId: playersId,
          outcome: 'D'
        }
      }),
      prisma.gamePlayer.count({
        where: {
          userId: playersId,
          outcome: 'L'
        }
      })
    ])
  
    if (!userStat) {
      throw new Error();
    }

    return { data: {...userStat, win, draw, lose }, error: null };
  } catch (e) {
    console.log(e);
    return { data: null, error: 'failed to fetch stats' }
  }
}

// fetch players
export const getPlayers = async (search: string, skip: number): Promise<{ data: null | PlayersType[], error: string |  null }> => {

  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };

  try {
    const players = await prisma.users.findMany({
      where: {
        NOT: { id: decrypted.userId },
        name: {
          contains: search
        },
        OR: [
          {
            following: {
              some: {
                playerId: decrypted.userId
              }
            }
          },
          {
            followers: {
              some: {
                playerId: decrypted.userId
              } 
            }
          }
        ]
      },
      skip,
      take: 25,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        elo: true
      }
    });

    return {
      data: players,
      error: null
    }
  } catch (e) {
    return { data: null, error: 'failed to fetch players' };
  }
}