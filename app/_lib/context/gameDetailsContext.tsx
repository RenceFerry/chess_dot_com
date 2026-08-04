'use client';

import { useContext, useState, createContext } from 'react'
import { GameDetailsContextType, GameDetailsType } from '../types';

const GameDetailsContext = createContext<GameDetailsContextType>(null);

export const GameDetailsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [ gameDetails, setGameDetails ] = useState<GameDetailsType | null>(null);

  return (
    <GameDetailsContext.Provider value={{ gameDetails, setGameDetails }}>
      {children}
    </GameDetailsContext.Provider>
  )
}

const useGameDetails = () => useContext(GameDetailsContext);

export default useGameDetails;