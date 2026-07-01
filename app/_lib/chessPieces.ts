import { FaChessBishop, FaChessKing, FaChessKnight, FaChessQueen, FaChessPawn, FaChessRook } from 'react-icons/fa';
import type { ChessPiecesType } from './types';

const chessPieces: ChessPiecesType = {
  'r': FaChessRook,
  'n': FaChessKnight,
  'b': FaChessBishop,
  'q': FaChessQueen,
  'k': FaChessKing,
  'p': FaChessPawn,
}

export default chessPieces;