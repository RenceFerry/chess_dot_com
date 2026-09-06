'use server';

import prisma from "@/_lib/prisma";
import { authenticate} from "./authenticate";
import type { PlayerStatType, UserInfo, UserStatType, GameHistoryType, PlayersType, PlayersMapObjectType, StreamCardsInfoType, PlayerInfo } from "../../_lib/types";
import redis from "@/_lib/redis";

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
        },
        settings: {
          select: {
            chatDisable: true,
            chatPrivate: true,
            streamGame: true
          }
        }
      }
    });

    //const user = null;
    
    if (!user) {
      throw new Error();
    }

    console.log('hello b', user?.image);
    

    if (!user.settings) {
      const  res = await prisma.settings.create({
        data: {
          userId: user.id
        },
        select: {
          chatDisable: true,
          chatPrivate: true,
          streamGame: true
        }
      })

      console.log(user);
      return { data: { ...user, settings: {...res} }, error: null};
    }

    console.log(user);
    return { data: user, error: null};
  } catch (e) {
    console.log(e);
    return { data: null, error: 'failed to fetch user details' };
  }

}

// fetch user stat
export const getUserStat = async (): Promise<{data: UserStatType | null, error: string | null}> => {

  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };

  // default to userID if id is not provided
  const playersId = decrypted.userId;

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
export const getPlayers = async (search: string, followCursor: string, nonFollowCursor: string, plnum: number = 25): Promise<{ data: null | {
  follow: PlayersType[],
  nonFollow: PlayersType[]
}, error: string |  null, cursors: { follow: string; nonFollow: string } }> => {

  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized', cursors: { follow: '', nonFollow: '' } };
  const num = plnum === 0 ? 25 : plnum;

  try {
    let nfcursor = '', additionalPlayers; 

    console.log('fetching', search)

    const players = await prisma.users.findMany({
      where: {
        NOT: { id: decrypted.userId },
        name: {
          contains: search,
          mode: 'insensitive'
        },
        followers: {
          some: {
            followerId: decrypted.userId
          }
        }
      },
      ...(
        followCursor && followCursor.length !== 0 ?
        { skip: 1, cursor: { name: followCursor } } :
        {}
      ),
      orderBy: {
        name: 'asc'
      },
      take: num,
      select: {
        id: true,
        name: true,
        image: true,
        elo: true
      }
    });

    const fCursor = players.length > 0 ? players[players.length - 1].name : followCursor;

    if (players.length < num) {
      additionalPlayers = await prisma.users.findMany({
        where: {
          NOT: [
            { id: decrypted.userId },
            {
              followers: {
                some: {
                  followerId: decrypted.userId
                }
              }
            }
          ],
          name: {
            contains: search,
            mode: 'insensitive'
          },
        },
        ...(
          nonFollowCursor && nonFollowCursor.length !== 0 ?
          { skip: 1, cursor: { name: nonFollowCursor } } :
          {}
        ),
        orderBy: {
          name: 'asc'
        },
        take: num - players.length,
        select: {
          id: true,
          name: true,
          image: true,
          elo: true
        }
      });
      nfcursor = additionalPlayers.length > 0 ? additionalPlayers[additionalPlayers.length - 1].name : nonFollowCursor;
    }

    console.log('finished fetching', players, additionalPlayers);

    const userStatus: Map<string, PlayersMapObjectType> | undefined = global.userStatus;

    if (!userStatus) {
      throw new Error("Player's status is not available");
    }

    return {
      data: {
        follow: 
          players.map(player => {
            const status = userStatus.get(player.id);
            let playing: boolean = false, streaming: boolean = false;

            if (status) {
              for (const value of status?.socket) {
                if (!playing && value[1].playing) playing = true;
                if (!streaming && value[1].streaming) streaming = true;
                if (playing && streaming) break;
              }
            }
            
            return {
              ...player,
              online: status?.online || false,
              playing,
              streaming
            };
          }),
        nonFollow:
          (
            additionalPlayers ?
            additionalPlayers.map(player => {
              const status = userStatus.get(player.id);
              let playing: boolean = false, streaming: boolean = false;
  
              if (status) {
                for (const value of status.socket) {
                  if (!playing && value[1].playing) playing = true;
                  if (!streaming && value[1].streaming) streaming = true;
                  if (playing && streaming) break;
                }
              }
              
              return {
                ...player,
                online: status?.online || false,
                playing,
                streaming
              };
            }) : []
          )   
      },
      cursors: { follow: fCursor,
        nonFollow: nfcursor
      },
      error: null
    }
  } catch (e) {
    console.log(e);
    return { data: null, error: 'failed to fetch players', cursors: { follow: '', nonFollow: '' } };
  }
}

// fetch player stat
export const getPlayerStat = async (id: string): Promise<{
  data: PlayerStatType | null;
  error: string | null;
}> => {
  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };

  if (!id) return { data: null, error: 'Invalid Id' };

  try {
    const [ player, win, lose, draw, followed ] = await Promise.all([
      prisma.users.findUnique({
        where: {
          id
        },
        select: {
          _count: {
            select: {
              followers: true
            }
          },
          image: true,
          email: true,
          id: true,
          name: true,
          elo: true
        }
      }),
      prisma.gamePlayer.count({
        where: {
          userId: id,
          outcome: 'W'
        }
      }),
      prisma.gamePlayer.count({
        where: {
          userId: id,
          outcome: 'L'
        }
      }),
      prisma.gamePlayer.count({
        where: {
          userId: id,
          outcome: 'D'
        }
      }),
      prisma.users.count({
        where: {
          id,
          followers: {
            some: {
              followerId: decrypted.userId
            }
          }
        }
      })
    ])

    if (!player) throw 'error';

    const playerStatus: PlayersMapObjectType | undefined = global.userStatus?.get(id);
    let playing: boolean = false, streaming: boolean = false, online: boolean = false;

    if (playerStatus) {
      for (const value of playerStatus.socket) {
        if (!playing && value[1].playing) playing = true;
        if (!streaming && value[1].streaming) streaming = true;
        if (playing && streaming) break;
      }
      online = true;
    }

    console.log('fetch', player);

    return { data: {
      ...player,
      win,
      lose,
      draw,
      online,
      streaming,
      playing,
      followed: followed != 0 ? true : false 
    }, error: null };
  } catch (e) {
    console.log(e);
    return { data: null, error: 'Player Info fetching failed' };
  }
}

// get streams in redis
export const getStreams = async (search: string, cursor?: string, nums: number = 50
): Promise<{ data: null | StreamCardsInfoType[], error: null | string, cursor?: string }> => {
  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };

  // async function pause() {
  //   return new Promise((resolve) => setTimeout(resolve, 2500));
  // }

  // await pause();

  const number = nums === 0 ? 50 : nums;

  const streamsKeys = global.streamsKeys;
  const streamsInfos = global.streamsInfos;
  if (!streamsInfos || !streamsKeys) return { data: null, error: 'server error' };

  const keys = streamsKeys.filter((names) => names.toLowerCase().includes(search.toLowerCase()));
  if (cursor) {
    const cursorIndex = keys.indexOf(cursor);
    if (cursorIndex > -1) {
      keys.splice(0, cursorIndex + 1);
    }
  }

  // console.log(keys, search, keys.length);
  if (keys.length === 0) return { data: [], error: null}
  keys.splice(number, keys.length);
  
  const streamsInfosFilterd = keys.map(key => {
    return streamsInfos.get(key) as StreamCardsInfoType;
  })

  return {
    data: streamsInfosFilterd,
    error: null,
    cursor: keys.at(-1)
  }
}

// fetch followers & following
export const getFollowPlayers = async (search: string, what: 'followers' | 'following', cursor?: string, nums: number = 25): Promise<{
  data: PlayersType[] | null,
  error: string | null
}> => {
  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };

  const take = nums === 0 ? 25 : nums;

  // paause
  // const pause = async () => new Promise((resolve) => setTimeout(resolve, 2500))
  // await pause();

  try {
    // userstatus
    const usersStatus = global.userStatus;
    if (!usersStatus) throw 'error';

    // fetch players
    const players = await prisma.users.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive'
        },
        id: { not: decrypted.userId },
        // fetch depends on what
        ...(
          what === 'followers' ? {
            following: {
              some: {
                playerId: decrypted.userId
              }
            }
          } : {
            followers: {
              some: {
                followerId: decrypted.userId
              }
            }
          }
        )
      },
      ...(
        cursor ? {
          cursor: { name: cursor },
          skip: 1
        } : {}
      ),
      take,
      orderBy: { name: 'asc' },
      select: {
        name: true,
        elo: true,
        image: true,
        id: true,
      }
    });

    // attach streaming, onlline and playing to players  data
    const data = players.map((player) => {
      let streaming = false, online = false, playing = false;
      const status: PlayersMapObjectType | null = usersStatus.get(player.id);

      if (status) {
        online = true;

        for (const [, value] of status.socket) {
          if (value.playing) playing = true;
          if (value.streaming) streaming = true;
          if (playing && streaming) break;
        }
      }

      return {
        ...player,
        online,
        streaming,
        playing
      }
    })

    return {
      data,
      error: null
    }

  } catch (e) {
    return {
      data: null,
      error: 'server error'
    }
  }
}

// check if user has password
export const checkIfPassword = async (): Promise<{ hasPassword: null | boolean; error: string | null}> => {
  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { hasPassword: null, error: 'unauthorized' };

  try {
    const password = await prisma.users.findUnique({
      where: {
        id: decrypted.userId
      },
      select: {
        password: true
      }
    })

    if (!password) return { hasPassword: null, error: "canno't find user" };

    return {
      hasPassword: Boolean(password.password),
      error: null
    }
  } catch (e) {
    return { hasPassword: null, error: 'server error' };
  }
}

// get opponent info in play
export const getPlayerInfo = async (id: string): Promise<{
  data: PlayerInfo | null;
  error: null | string
}> => {
  // authenticate
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };

  if (!id) return { data: null, error: 'invalid user' };

  try {
    const player = await prisma.users.findUnique({
      where: {
        id
      },
      select: {
        name: true,
        id: true,
        elo: true,
        image: true
      }
    })

    if (!player) throw 'cannot find user';

    return {
      data: player,
      error: null
    }

  } catch (e) {
    return {
      data: null,
      error: 'server error'
    }
  }
}

// get invitations in redis
export const getInvitations = async (what: 'sent' | 'received') => {
  // authenticate
  console.log('invitation query')
  const decrypted = await authenticate();
  if (!decrypted) return { data: null, error: 'unauthorized' };
  
  try {
    const userKeyForKeys = `invitation::${what}::keys::${decrypted.userId}`;
    const userInvitationKey = `invitation::${what}::${decrypted.userId}`;

    const keys: string[] = await redis.zRange(
      userKeyForKeys,
      '+inf',
      `(${Date.now() - 1000 * 60 * 5}`,
      { BY: 'SCORE', REV: true }
    );
    console.log('keys', keys);

    // if no keys then return
    if (keys.length === 0) return { data: [], error: null };

    // transaction
    const pipeline = redis.multi(); 
    keys.forEach(key => {
      pipeline.hGet(userInvitationKey, key)
    });
    const results = await pipeline.exec();
    
    return { data: results, error: null };
  } catch (e) {
    return { data: null, error: 'Server Error'};
  }
  
}

//1c35ccc8-aa05-4e63-871f-5cb207355b32
//e11f71b6-8fd3-4eee-bc28-b622fe7e2ab2