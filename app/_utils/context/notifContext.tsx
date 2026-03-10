"use client";

import { createContext, useContext, useState } from "react";
import type { NotifContextType, Notif } from "../../_lib/types";

const NotifContext = createContext<NotifContextType>(null);

export default function NotifProvider({ children }: { children: React.ReactNode}) {
  const [ notif, setNotif ] = useState<Notif>(null);

  return (
    <NotifContext.Provider value={{ notif, setNotif }} >
      { children }
    </NotifContext.Provider>
  )
}

export const useNotif = () => useContext(NotifContext);