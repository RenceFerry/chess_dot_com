
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