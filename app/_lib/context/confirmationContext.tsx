'use client';

import { createContext, useState, useContext } from "react";
import { ConfirmationContextType, InvitationAcceptDataType, } from "../types";

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

export const ConfirmationContextProvider = ({ children }: { children: React.ReactNode}) => {
  const [ confirmation, setConfirmation ] = useState<InvitationAcceptDataType | null>(null);

  return (
    <ConfirmationContext.Provider value={{confirmation, setConfirmation}} >
      {children}
    </ConfirmationContext.Provider>
  )
}

const useConfirmation = () => useContext(ConfirmationContext);

export default useConfirmation;