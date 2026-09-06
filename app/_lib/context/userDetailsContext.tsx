'use client';

import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '../types';
import { getUserDet } from '@/_utils/serverActions/fetchActions';
import Loading from '@/loading';

const UserDetailsContext = createContext({} as UserInfo);

export const UserDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: userDet, isError, isPending } = useQuery({
    queryKey: ['userDetails'],
    queryFn: async () => {
      console.log('hello user det')
      const { data, error } = await getUserDet();
      console.log('qfn called')
      if (error || !data) throw new Error(error || '');
      return data;
    },
    staleTime: 1000 * 60 * 60
  })

  if (isPending) {
    return <Loading />;
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