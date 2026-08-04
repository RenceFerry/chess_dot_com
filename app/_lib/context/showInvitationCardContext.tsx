'use client';

import { createContext, useState, useContext } from "react";
import { InvitationAcceptDataType, ShowInvitationCardContextType } from "../types";

const ShowInvitationCardContext = createContext<ShowInvitationCardContextType>(null);

export const ShowInvitationCardProvider = ({ children }: { children: React.ReactNode}) => {
  const [ showInvitationCard, setShowInvitationCard ] = useState<InvitationAcceptDataType | null>(null);

  return (
    <ShowInvitationCardContext.Provider value={{showInvitationCard, setShowInvitationCard}} >
      {children}
    </ShowInvitationCardContext.Provider>
  )
}

const useShowInvitationCard = () => useContext(ShowInvitationCardContext);

export default useShowInvitationCard;