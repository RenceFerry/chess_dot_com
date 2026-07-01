'use client';

import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '../types';
import { getUserDet } from '@/_utils/serverActions/fetchActions';

const UserDetailsContext = createContext({} as UserInfo);

export const UserDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: userDet, isError, isPending } = useQuery({
    queryKey: ['userDetails'],
    queryFn: async () => {
      const { data, error } = await getUserDet();
      console.log('qfn called')
      if (error) throw new Error(error);
      return data;
    }
  })

  if (isPending) {
    return <div>Loading...hahahha</div>;
  }

  if (isError || !userDet) {
    return <div>Error loading user details</div>;
  }

  return (
    <UserDetailsContext.Provider value={userDet}>
      {children}
    </UserDetailsContext.Provider>
  )
}

const useUserDet = () => useContext(UserDetailsContext);

export default useUserDet;