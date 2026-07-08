
export const gameMoves = [
  { move: 1, white: "e4", black: "e5" },
  { move: 2, white: "Nf3", black: "Nc6" },
  { move: 3, white: "Bc4", black: "Bc5" },
  { move: 4, white: "c3", black: "Nf6" },
  { move: 5, white: "d4", black: "exd4" },
  { move: 6, white: "cxd4", black: "Bb4+" },
  { move: 7, white: "Nc3", black: "Nxe4" },
  { move: 8, white: "O-O", black: "Bxc3" },
  { move: 9, white: "d5", black: "Ne5" },
  { move: 10, white: "Qd4", black: "Nxf3+" },
  { move: 11, white: "gxf3", black: "Qf6" },
  { move: 12, white: "Qxe4+", black: "Qe5" },
  { move: 13, white: "Re1", black: "Qxe4" },
  { move: 14, white: "Rxe4+", black: "Kf8" },
  { move: 15, white: "bxc3", black: "d6" },
  { move: 16, white: "Bg5", black: "Bf5" },
  { move: 17, white: "Re3", black: "Re8" },
  { move: 18, white: "Rae1", black: "Rxe3" },
  { move: 19, white: "Rxe3", black: "h6" },
  { move: 20, white: "Be7+", black: "Kg8" },
  { move: 21, white: "Bd8", black: "Kf8" },
  { move: 22, white: "Bxc7", black: "g5" },
  { move: 23, white: "Bxd6+", black: "Kg7" },
  { move: 24, white: "Be5+", black: "f6" },
  { move: 25, white: "Bd4", black: "Rd8" },
  { move: 26, white: "Re7+", black: "Kg6" },
  { move: 27, white: "Bd3+", black: "Kh5" },
  { move: 28, white: "Rh7", black: "Bxd3" },
  { move: 29, white: "Bxf6", black: "Rf8" },
  { move: 30, white: "Bg7", black: "Rf7" },
  { move: 31, white: "Rxh6#", black: null }
];

export const message = [
  { sender: 'opponent', text: 'Good luck!' },
  { sender: 'player', text: 'Thanks, you too!' },
  { sender: 'opponent', text: 'Have fun playing!' },
  { sender: 'opponent', text: 'Good luck!' },
  { sender: 'player', text: 'Thanks, you too!' },
  { sender: 'opponent', text: 'Have fun playing!' },
  { sender: 'opponent', text: 'Good luck!' },
  { sender: 'player', text: 'Thanks, you too!' },
  { sender: 'opponent', text: 'Have fun playing!' },
  { sender: 'opponent', text: 'Good luck!' },
  { sender: 'player', text: 'Thanks, you too!' },
  { sender: 'opponent', text: 'Have fun playing!' },
  { sender: 'opponent', text: 'Good luck!' },
  { sender: 'player', text: 'Thanks, you too!' },
  { sender: 'opponent', text: 'Have fun playing!' },
  { sender: 'opponent', text: 'Good luck!' },
  { sender: 'opponent', text: 'Have fun playing!' },
  { sender: 'player', text: 'Thanks, you too!' },
  { sender: 'player', text: 'I love youuu :)' },
]

export type PlayersType = {
  name: string;
  status: 'online' | 'offline';
  playing: 'not playing' | 'playing';
  stream: 'not streaming' | 'streaming';
}

export const players: PlayersType[] = [
    {
      name: 'John Doe',
      status: 'online',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'Alex Doe',
      status: 'online',
      playing: 'playing',
      stream: 'streaming',
    },
    {
      name: 'John Town',
      status: 'offline',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'John Doe',
      status: 'online',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'Alex Doe',
      status: 'online',
      playing: 'playing',
      stream: 'streaming',
    },
    {
      name: 'John Town',
      status: 'offline',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'John Doe',
      status: 'online',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'Alex Doe',
      status: 'online',
      playing: 'playing',
      stream: 'streaming',
    },
    {
      name: 'John Town',
      status: 'offline',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'John Town',
      status: 'offline',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'John Doe',
      status: 'online',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'Alex Doe',
      status: 'online',
      playing: 'playing',
      stream: 'streaming',
    },
    {
      name: 'John Town',
      status: 'offline',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'John Town',
      status: 'offline',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'John Doe',
      status: 'online',
      playing: 'not playing',
      stream: 'not streaming',
    },
    {
      name: 'Alex Doe',
      status: 'online',
      playing: 'playing',
      stream: 'streaming',
    },
    {
      name: 'John Town',
      status: 'offline',
      playing: 'not playing',
      stream: 'not streaming',
    },
  ]

export const streams = [
  {
    no: 0,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 1,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 2,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 3,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 4,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 5,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 6,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 7,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 8,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 9,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 10,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 11,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 12,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 13,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 14,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 15,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 16,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 17,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 18,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 19,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 20,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 21,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 22,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 23,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 24,
    p1: "GM John Doe",
    p1Elo: 2804,
    p2: "GM Alex Doe",
    p2Elo: 2543,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Paul Muller",
    p1Elo: 2407,
    p2: "GM Sam Nakamura",
    p2Elo: 2602,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Mark Doe",
    p1Elo: 2695,
    p2: "GM John Garcia",
    p2Elo: 2663,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Dan Walker",
    p1Elo: 2301,
    p2: "GM Nick Hall",
    p2Elo: 2847,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Leo Muller",
    p1Elo: 2354,
    p2: "GM Dan Kim",
    p2Elo: 2421,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Owen Silva",
    p1Elo: 2825,
    p2: "GM Jack Wilson",
    p2Elo: 2732,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM John Muller",
    p1Elo: 2504,
    p2: "GM Mark Brown",
    p2Elo: 2589,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Chris Wilson",
    p1Elo: 2692,
    p2: "GM Leo Silva",
    p2Elo: 2355,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Leo Wilson",
    p1Elo: 2602,
    p2: "GM Adam Lewis",
    p2Elo: 2349,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Sean Smith",
    p1Elo: 2427,
    p2: "GM Jack Taylor",
    p2Elo: 2475,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Steve Taylor",
    p1Elo: 2810,
    p2: "GM Ryan Kim",
    p2Elo: 2339,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Max Lewis",
    p1Elo: 2432,
    p2: "GM Dan Hall",
    p2Elo: 2369,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Alex Nakamura",
    p1Elo: 2763,
    p2: "GM John Lewis",
    p2Elo: 2574,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Nick Nakamura",
    p1Elo: 2422,
    p2: "GM Dan Hall",
    p2Elo: 2712,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Ryan Smith",
    p1Elo: 2590,
    p2: "GM Tom Moore",
    p2Elo: 2772,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Sam Ivanov",
    p1Elo: 2407,
    p2: "GM Chris Doe",
    p2Elo: 2735,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM John Hall",
    p1Elo: 2694,
    p2: "GM Mike Muller",
    p2Elo: 2764,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Sam Walker",
    p1Elo: 2637,
    p2: "GM Adam Kim",
    p2Elo: 2370,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Paul Ivanov",
    p1Elo: 2763,
    p2: "GM Alex Silva",
    p2Elo: 2633,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Dan Rossi",
    p1Elo: 2575,
    p2: "GM John Muller",
    p2Elo: 2507,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Nick Wong",
    p1Elo: 2500,
    p2: "GM Mike Hall",
    p2Elo: 2448,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Steve Wong",
    p1Elo: 2448,
    p2: "GM Adam Moore",
    p2Elo: 2581,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Nick Doe",
    p1Elo: 2688,
    p2: "GM Adam Rossi",
    p2Elo: 2777,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Mark Rossi",
    p1Elo: 2665,
    p2: "GM Nick Muller",
    p2Elo: 2794,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Owen Clark",
    p1Elo: 2625,
    p2: "GM Mike Moore",
    p2Elo: 2614,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Mike Moore",
    p1Elo: 2801,
    p2: "GM Mike Hall",
    p2Elo: 2811,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Dan Wilson",
    p1Elo: 2656,
    p2: "GM Paul Taylor",
    p2Elo: 2333,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Mike Petrov",
    p1Elo: 2481,
    p2: "GM Steve Smith",
    p2Elo: 2813,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Jack Wilson",
    p1Elo: 2594,
    p2: "GM Leo Nakamura",
    p2Elo: 2460,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Mark Brown",
    p1Elo: 2678,
    p2: "GM Chris Petrov",
    p2Elo: 2460,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Mark Silva",
    p1Elo: 2705,
    p2: "GM Dan Silva",
    p2Elo: 2332,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Tom Moore",
    p1Elo: 2345,
    p2: "GM Luke Taylor",
    p2Elo: 2709,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM John Taylor",
    p1Elo: 2592,
    p2: "GM Mike Silva",
    p2Elo: 2677,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Chris Doe",
    p1Elo: 2333,
    p2: "GM Paul Carlsen",
    p2Elo: 2738,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Adam Garcia",
    p1Elo: 2505,
    p2: "GM Paul Wilson",
    p2Elo: 2406,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Sean Walker",
    p1Elo: 2493,
    p2: "GM Alex Muller",
    p2Elo: 2648,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Mike Rossi",
    p1Elo: 2711,
    p2: "GM Chris Petrov",
    p2Elo: 2775,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Mark Smith",
    p1Elo: 2705,
    p2: "GM Alex Brown",
    p2Elo: 2400,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Alex Nakamura",
    p1Elo: 2522,
    p2: "GM Mike Kim",
    p2Elo: 2720,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Ryan Doe",
    p1Elo: 2776,
    p2: "GM Steve Wong",
    p2Elo: 2530,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Sam Doe",
    p1Elo: 2467,
    p2: "GM Sam Muller",
    p2Elo: 2323,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Nick Brown",
    p1Elo: 2826,
    p2: "GM Tom Silva",
    p2Elo: 2583,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Max Petrov",
    p1Elo: 2363,
    p2: "GM Dan Lewis",
    p2Elo: 2569,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Leo Muller",
    p1Elo: 2500,
    p2: "GM Jack Carlsen",
    p2Elo: 2368,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Paul Ivanov",
    p1Elo: 2528,
    p2: "GM Dan Taylor",
    p2Elo: 2377,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Max Rossi",
    p1Elo: 2467,
    p2: "GM Mike Brown",
    p2Elo: 2503,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Jack Carlsen",
    p1Elo: 2301,
    p2: "GM Nick Lewis",
    p2Elo: 2518,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Mike Walker",
    p1Elo: 2649,
    p2: "GM Owen Lewis",
    p2Elo: 2654,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Sam Walker",
    p1Elo: 2470,
    p2: "GM Jack Petrov",
    p2Elo: 2677,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Mark Muller",
    p1Elo: 2682,
    p2: "GM Chris Wong",
    p2Elo: 2565,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Sean Garcia",
    p1Elo: 2471,
    p2: "GM Sean Wilson",
    p2Elo: 2521,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Owen Moore",
    p1Elo: 2491,
    p2: "GM Mike Moore",
    p2Elo: 2574,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Dan Wong",
    p1Elo: 2842,
    p2: "GM Nick Nakamura",
    p2Elo: 2607,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Dan Muller",
    p1Elo: 2662,
    p2: "GM Nick Lewis",
    p2Elo: 2384,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Mike Petrov",
    p1Elo: 2665,
    p2: "GM Paul Carlsen",
    p2Elo: 2720,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Paul Carlsen",
    p1Elo: 2416,
    p2: "GM John Ivanov",
    p2Elo: 2525,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Nick Wilson",
    p1Elo: 2825,
    p2: "GM Max Carlsen",
    p2Elo: 2620,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Jack Garcia",
    p1Elo: 2475,
    p2: "GM Paul Smith",
    p2Elo: 2693,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Sam Lewis",
    p1Elo: 2842,
    p2: "GM Max Walker",
    p2Elo: 2548,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Jack Lewis",
    p1Elo: 2513,
    p2: "GM Dan Petrov",
    p2Elo: 2811,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Dan Lewis",
    p1Elo: 2368,
    p2: "GM Mark Smith",
    p2Elo: 2404,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Sam Nakamura",
    p1Elo: 2848,
    p2: "GM Luke Moore",
    p2Elo: 2359,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Max Doe",
    p1Elo: 2453,
    p2: "GM Mike Moore",
    p2Elo: 2688,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Sam Petrov",
    p1Elo: 2388,
    p2: "GM Luke Moore",
    p2Elo: 2550,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Max Hall",
    p1Elo: 2830,
    p2: "GM Mark Wong",
    p2Elo: 2415,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Dan Rossi",
    p1Elo: 2606,
    p2: "GM Mark Petrov",
    p2Elo: 2762,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Dan Wong",
    p1Elo: 2480,
    p2: "GM Dan Muller",
    p2Elo: 2513,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Luke Petrov",
    p1Elo: 2540,
    p2: "GM John Nakamura",
    p2Elo: 2496,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Owen Nakamura",
    p1Elo: 2598,
    p2: "GM Adam Muller",
    p2Elo: 2621,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Tom Brown",
    p1Elo: 2354,
    p2: "GM Steve Kim",
    p2Elo: 2467,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Nick Rossi",
    p1Elo: 2782,
    p2: "GM Adam Silva",
    p2Elo: 2664,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Eric Silva",
    p1Elo: 2700,
    p2: "GM Paul Taylor",
    p2Elo: 2835,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Mike Lewis",
    p1Elo: 2552,
    p2: "GM Eric Smith",
    p2Elo: 2619,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Ryan Doe",
    p1Elo: 2675,
    p2: "GM Max Muller",
    p2Elo: 2555,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Alex Walker",
    p1Elo: 2706,
    p2: "GM Steve Smith",
    p2Elo: 2385,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Jack Lewis",
    p1Elo: 2326,
    p2: "GM Mike Silva",
    p2Elo: 2782,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Dan Nakamura",
    p1Elo: 2333,
    p2: "GM Mark Lewis",
    p2Elo: 2615,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Paul Walker",
    p1Elo: 2443,
    p2: "GM Dan Ivanov",
    p2Elo: 2835,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Sean Doe",
    p1Elo: 2392,
    p2: "GM Nick Doe",
    p2Elo: 2434,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Ryan Kim",
    p1Elo: 2703,
    p2: "GM Sean Ivanov",
    p2Elo: 2715,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Luke Lewis",
    p1Elo: 2727,
    p2: "GM Eric Nakamura",
    p2Elo: 2531,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Dan Garcia",
    p1Elo: 2452,
    p2: "GM Max Taylor",
    p2Elo: 2313,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Eric Garcia",
    p1Elo: 2307,
    p2: "GM Max Muller",
    p2Elo: 2321,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM John Smith",
    p1Elo: 2686,
    p2: "GM Luke Wilson",
    p2Elo: 2727,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Tom Carlsen",
    p1Elo: 2737,
    p2: "GM Eric Lewis",
    p2Elo: 2471,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Steve Silva",
    p1Elo: 2422,
    p2: "GM Sam Carlsen",
    p2Elo: 2579,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Luke Doe",
    p1Elo: 2478,
    p2: "GM Ryan Kim",
    p2Elo: 2752,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Eric Nakamura",
    p1Elo: 2840,
    p2: "GM Paul Ivanov",
    p2Elo: 2561,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Paul Doe",
    p1Elo: 2622,
    p2: "GM Adam Nakamura",
    p2Elo: 2430,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Ryan Petrov",
    p1Elo: 2516,
    p2: "GM John Wilson",
    p2Elo: 2354,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Leo Garcia",
    p1Elo: 2393,
    p2: "GM Mark Doe",
    p2Elo: 2308,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Mark Clark",
    p1Elo: 2463,
    p2: "GM Max Lewis",
    p2Elo: 2646,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Tom Rossi",
    p1Elo: 2798,
    p2: "GM Luke Kim",
    p2Elo: 2682,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Dan Brown",
    p1Elo: 2597,
    p2: "GM Alex Taylor",
    p2Elo: 2631,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Jack Petrov",
    p1Elo: 2751,
    p2: "GM Chris Moore",
    p2Elo: 2557,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Mark Clark",
    p1Elo: 2813,
    p2: "GM Nick Walker",
    p2Elo: 2562,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Sean Smith",
    p1Elo: 2783,
    p2: "GM Max Taylor",
    p2Elo: 2597,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Chris Moore",
    p1Elo: 2796,
    p2: "GM Luke Walker",
    p2Elo: 2565,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Max Lewis",
    p1Elo: 2579,
    p2: "GM John Silva",
    p2Elo: 2825,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Ryan Kim",
    p1Elo: 2601,
    p2: "GM Sean Doe",
    p2Elo: 2351,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Ryan Rossi",
    p1Elo: 2579,
    p2: "GM John Garcia",
    p2Elo: 2680,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Chris Doe",
    p1Elo: 2681,
    p2: "GM Nick Brown",
    p2Elo: 2515,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Nick Moore",
    p1Elo: 2470,
    p2: "GM Adam Smith",
    p2Elo: 2353,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM John Wilson",
    p1Elo: 2413,
    p2: "GM Dan Taylor",
    p2Elo: 2582,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Tom Taylor",
    p1Elo: 2790,
    p2: "GM Jack Muller",
    p2Elo: 2499,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM John Ivanov",
    p1Elo: 2440,
    p2: "GM Max Brown",
    p2Elo: 2848,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM John Carlsen",
    p1Elo: 2465,
    p2: "GM Mark Wilson",
    p2Elo: 2345,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Mike Hall",
    p1Elo: 2782,
    p2: "GM Chris Nakamura",
    p2Elo: 2486,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Jack Clark",
    p1Elo: 2472,
    p2: "GM Max Kim",
    p2Elo: 2317,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Sam Clark",
    p1Elo: 2834,
    p2: "GM Alex Carlsen",
    p2Elo: 2746,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Dan Silva",
    p1Elo: 2378,
    p2: "GM Adam Taylor",
    p2Elo: 2536,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Steve Hall",
    p1Elo: 2541,
    p2: "GM Sean Wilson",
    p2Elo: 2355,
    mode: "Rapid"
  },
  {
    no: 0,
    p1: "GM Leo Hall",
    p1Elo: 2466,
    p2: "GM Sean Wong",
    p2Elo: 2418,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Ryan Clark",
    p1Elo: 2442,
    p2: "GM Leo Brown",
    p2Elo: 2396,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Paul Clark",
    p1Elo: 2452,
    p2: "GM Luke Kim",
    p2Elo: 2796,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Jack Clark",
    p1Elo: 2725,
    p2: "GM Ryan Garcia",
    p2Elo: 2533,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Max Lewis",
    p1Elo: 2706,
    p2: "GM Sean Moore",
    p2Elo: 2550,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Mark Petrov",
    p1Elo: 2368,
    p2: "GM Eric Wong",
    p2Elo: 2441,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Owen Petrov",
    p1Elo: 2565,
    p2: "GM Luke Lewis",
    p2Elo: 2515,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Luke Lewis",
    p1Elo: 2749,
    p2: "GM Owen Muller",
    p2Elo: 2301,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Leo Muller",
    p1Elo: 2497,
    p2: "GM Tom Wilson",
    p2Elo: 2674,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Sam Smith",
    p1Elo: 2822,
    p2: "GM Mike Brown",
    p2Elo: 2388,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Leo Muller",
    p1Elo: 2413,
    p2: "GM Luke Wong",
    p2Elo: 2326,
    mode: "Classical"
  },
  {
    no: 0,
    p1: "GM Eric Ivanov",
    p1Elo: 2654,
    p2: "GM Tom Walker",
    p2Elo: 2637,
    mode: "Blitz"
  },
  {
    no: 0,
    p1: "GM Paul Doe",
    p1Elo: 2491,
    p2: "GM Leo Silva",
    p2Elo: 2555,
    mode: "Bullet"
  },
  {
    no: 0,
    p1: "GM Ryan Carlsen",
    p1Elo: 2324,
    p2: "GM Nick Ivanov",
    p2Elo: 2598,
    mode: "Bullet"
  }
];