'use client';

import { useState } from 'react'
import Search from '../../search';
import Opponents from './opponents';
import { useQuery } from '@tanstack/react-query';
import { getPlayers } from '@/_utils/serverActions/fetchActions';
import { PlayersSkeleton } from '@/_components/skeletons';

import { players } from '@/_lib/test';
import ProfileCard from '../../profileCard';

const Play = () => {
  const [ profileId, setProfileId ] = useState<string>('');
  const [ search, setSearch ] = useState<string>('');

  //fetch players 
  // const { data: players, isPending, isError } = useQuery({
  //   queryKey: ['searchPlayers', search],
  //   queryFn: async () => {
  //     const { data, error } = await getPlayers(search, 0);
  //     if (error) throw new Error(error);
  //     return data;
  //   },
  //   staleTime: 1000 * 60
  // });

  const [ isPending, isError ] = [ false, false ];
  
  //view card
  function viewProfile(id: string) {
    setProfileId(id);
  }
  
  return (
    <div className='relative w-full h-full flex flex-col' >

      {/** Search bar */}
      <Search what={'Opponents'} setSearch={setSearch} />

      {/** search resultss */}
      {
        isPending ?
        <PlayersSkeleton /> :
        isError ?
        <h1 className='mt-4 text-sm md:text-lg self-center text-fore2'>Fetching players failed</h1> :
        players && players.length !== 0 ?
        <Opponents viewProfile={viewProfile} players={players} /> :
        <h1 className='mt-4 text-sm md:text-lg self-center text-fore2'>No players found</h1>
      }

      {// profile card
        profileId && 
        <ProfileCard close={() => setProfileId('')} />
      }
    </div>
  )
}

export default Play;