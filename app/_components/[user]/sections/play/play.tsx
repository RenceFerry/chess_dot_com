'use client';

import { useEffect, useState, useRef } from 'react'
import Search from '../../search';
import Opponents from './opponents';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlayers } from '@/_utils/serverActions/fetchActions';
import { PlayersSkeleton } from '@/_components/skeletons';

import ProfileCard from '../../profileCard';
import { PlayersType } from '@/_lib/types';

const Play = () => {
  const [ profileId, setProfileId ] = useState<string>('');
  const [ search, setSearch ] = useState<string>('');
  const divObserverRef = useRef<HTMLDivElement | null>(null);
  const divContainerRef = useRef<HTMLDivElement | null>(null);
  const cursors = useRef<{ follow: string; nonFollow: string }>({ follow: '', nonFollow: '' });
  const playersNumRef = useRef<number>(0);
  const nomore = useRef<boolean>(false);
  const queryClient = useQueryClient();
  const [ isFetchingMore, setIsFetchingMore ] = useState<boolean>(false);
  const [ isErrorFetchingMore, setIsErrorFetchingMore ] = useState<boolean>(false);

  // fetch players 
  const { data: players, isPending, isError, isFetching } = useQuery({
    queryKey: ['searchPlayers', search],
    queryFn: async () => {
      console.log('query for', search, cursors.current);
      const { data, error, cursors: newCursors } = await getPlayers(search, '', '', playersNumRef.current);

      if (error || !data) throw new Error(error || '');
      if (!data || data?.follow.length + data?.nonFollow.length < 25) nomore.current = true;

      playersNumRef.current = (data?.follow.length || 0) + (data?.nonFollow.length || 0);
      cursors.current = newCursors;

      console.log('query result', data, cursors.current);

      return structuredClone(data);
    },
    enabled: !isFetchingMore,
    staleTime: 1000 * 60
  });

  // fetch more players if needed
  useEffect(() => {

    // refetch
    const reFetch = async () => {
      setIsFetchingMore(true);
      console.log('refetching for', search, players);
      cursors.current = {
        follow: players?.follow[players?.follow.length - 1]?.name || '',
        nonFollow: players?.nonFollow[players?.nonFollow.length - 1]?.name || '',
      }
      
      const { data, error, cursors: newCursors } = await getPlayers(search, cursors.current.follow, cursors.current.nonFollow);
      if (error) {
        setIsErrorFetchingMore(true);
        setIsFetchingMore(false);
        
        return;
      }
      
      if (!data || data?.follow.length + data?.nonFollow.length < 25) nomore.current = true;
      playersNumRef.current += (data?.follow.length || 0) + (data?.nonFollow.length || 0);
      cursors.current = newCursors;
      const newData = data;
      
      queryClient.setQueryData(['searchPlayers', search], (oldData: {
        follow: PlayersType[];
        nonFollow: PlayersType[];
      } | null | undefined) => {

        if (!newData) return oldData;
        if (!oldData) return newData;

        return {
          follow: [ ...oldData.follow, ...newData.follow ],
          nonFollow: [ ...oldData.nonFollow, ...newData.nonFollow ]
        }
      });

      setIsFetchingMore(false);
    }

    // automatic fetch when scrolling
    const observer = new IntersectionObserver(async ([ent]) => {
      console.log('observer', ent.isIntersecting, !isPending, !isFetching, !nomore.current, cursors.current);
      if (ent.isIntersecting && !isPending && !isFetching && !nomore.current) {
        await reFetch();
      }
    },
    {
      root: divContainerRef.current,
      rootMargin: '0px 0px 100px 0px',
      threshold: 1.0
    });

    if (divObserverRef.current) {
      observer.observe(divObserverRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ isFetching, isPending, queryClient, search, players, nomore ]);

  //view card
  function viewProfile(id: string) {
    setProfileId(id);
  }

  // handle search change
  function handleInput(search: string) {
    playersNumRef.current = 0;
    nomore.current = false;
    cursors.current = { follow: '', nonFollow: '' };
    console.log('handleinput', search, isFetchingMore);
    setSearch(search);
  };

  console.log(players);
  
  //const [ isPending, isError ] = [ false, false ];
  return (
    <div className='relative w-full h-full flex flex-col min-h-0 min-w-0' >

      {/** Search bar */}
      <Search what={'Opponents'} setSearch={handleInput} />

      {/** search resultss */}
      <div className='flex-1 flex w-full flex-col bg-back4 py-5 gap-4 overflow-auto no-scrollbar' ref={divContainerRef}>
        {
          isError ?
          <h1 className='mt-4 text-sm md:text-lg self-center text-fore2'>Fetching players failed</h1> :
          isPending ?
          <PlayersSkeleton /> :
          players && players.follow.length + players.nonFollow.length > 0 ?
          <>
            <Opponents viewProfile={viewProfile} players={players} />
            <div ref={divObserverRef} className='h-1 w-full' />
            { isFetchingMore && !isErrorFetchingMore && <PlayersSkeleton /> }
          </> :
          <h1 className='mt-4 text-sm md:text-lg self-center text-fore2'>No players found</h1>
        }
      </div>

      {// profile card
        profileId && 
        <ProfileCard id={profileId} close={() => setProfileId('')} />
      }
    </div>
  )
}

export default Play;