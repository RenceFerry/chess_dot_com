'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import Button from '@/_components/wrappers/button';
import { IoArrowBackSharp } from 'react-icons/io5';
import Search from '@/_components/[user]/search';
import Followers from '@/_components/[user]/pages/followers/followers';
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { players } from '@/_lib/test';
import ProfileCard from '@/_components/[user]/profileCard';
import clsx from 'clsx';
import { getFollowPlayers } from '@/_utils/serverActions/fetchActions';
import { PlayersSkeleton } from '@/_components/skeletons';
import { PlayersType } from '@/_lib/types';

const MAX_FETCH_NUM = 25;

const Page = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [ showFollowers, setShowFollowers ] = useState<boolean>(false);
  const [ profileId, setProfileId ] = useState<string>('');
  const [ search, setSearch ] = useState('');
  const [ isFetching, setIsFetching ] = useState(false);
  const [ isErrorFetching, setIsErrorFetching ] = useState(false);
  const queryClient = useQueryClient();

  const numRef = useRef({ followers: 0, following: 0 });
  // const cursors = useRef<{
  //   followers: null | string;
  //   following: null | string;
  // }>({ followers: null, following: null });
  const nomoreRef = useRef({ followers: false, following: false });
  const divObsRef = useRef<HTMLDivElement | null>(null);
  const divConObsRef = useRef<HTMLDivElement | null>(null);
  
  // fetch followers players
  const { data: followers, isError: isErrorFollowers, isPending: isPendingFollowers, isFetching: isFetchingFollowers } = useQuery({
    queryKey: ['searchFollowers', search],
    queryFn: async () => {
      const { data, error } = await getFollowPlayers(search, 'followers', undefined, numRef.current.followers);
      if (error || !data) throw new Error(error || '');
      
      nomoreRef.current.followers = data.length < MAX_FETCH_NUM;
      numRef.current.followers = data.length;
      //cursors.current.followers = data.length > 0 ? data[data.length - 1].name : null

      return data;
    },
    staleTime: 1000 * 60,
    enabled: !isFetching
  })

  // fetch following players
  const { data: following, isError: isErrorFollowing, isPending: isPendingFollowing, isFetching: isFetchingFollowing } = useQuery({
    queryKey: ['searchFollowing', search],
    queryFn: async () => {
      const { data, error } = await getFollowPlayers(search, 'following', undefined, numRef.current.following);
      if (error || !data) throw new Error(error || '');
      
      nomoreRef.current.following = data.length < MAX_FETCH_NUM;
      numRef.current.following = data.length;
      //cursors.current.following = data.length > 0 ? data[data.length - 1].name : null

      return data;
    },
    staleTime: 1000 * 60,
    enabled: !isFetching
  })

  // for automatic refetching when scrolling
  useEffect(() => {
    if (!divObsRef.current || !divConObsRef.current) return;

    // refetching fn
    const refetch = async (what: 'Followers' | 'Following') => {
      let cursor: string | undefined = undefined;
      const isFollower = what === 'Followers' ? true : false;
      if (isFollower) {
        cursor = followers && followers.length > 0 ?
          followers[followers.length - 1].name : 
          undefined;
      } else {
        cursor = following && following.length > 0 ?
          following[following.length - 1].name : 
          undefined;
      }
      const wh: 'followers' | 'following' = isFollower ? 'followers' : 'following';

      //////// set loading
      setIsFetching(true);
      setIsErrorFetching(false);

      // refetch
      const { data, error } = await getFollowPlayers(search, wh, cursor);

      // if error
      if (error || !data) {
        setIsFetching(false);
        setIsErrorFetching(true);
        return;
      }

      // set new num and nomore
      if (isFollower) {
        numRef.current.followers += data?.length;
        nomoreRef.current.followers = data.length < MAX_FETCH_NUM;
      } else {
        numRef.current.following += data?.length;
        nomoreRef.current.following = data.length < MAX_FETCH_NUM;
      }

      // set data
      queryClient.setQueryData([`search${isFollower ? 'Followers' : 'Following'}`, search], (oldData: PlayersType[] | undefined) => {
        if (oldData) {
          return [...oldData, ...data];
        }
        return data;
      })

      // loading to false
      setIsFetching(false);
    }

    // observer
    const observer = new IntersectionObserver(async ([ent]) => {
      if (ent.isIntersecting && !isFetching) {
        console.log('observer')

        if (showFollowers && !isPendingFollowers && !isFetchingFollowers && !nomoreRef.current.followers) {
          console.log('refetch followers')
          await refetch('Followers');
        } 
        else if (!showFollowers && !isPendingFollowing && !isFetchingFollowing && !nomoreRef.current.following) {
          console.log('refetch following')
          await refetch('Following')
        }
      }
    }, {
      root: divConObsRef.current,
      rootMargin: '0px 0px 100px 0px',
      threshold: 1
    })

    // set observer
    observer.observe(divObsRef.current);

    return () => observer.disconnect();
  }, [isFetchingFollowers, isFetchingFollowing, isPendingFollowers, isPendingFollowing, showFollowers, followers, queryClient, search, following, isFetching]);

  //view card
  function viewProfile(id: string) {
    setProfileId(id);
  }

  // handle back clicking
  function handleBack() 
  {
    const param = new URLSearchParams();
    param.set('tab', 'more');
    router.replace(`/${pathname.split('/')[1]}?${param.toString()}`);
  }
  
  return (
    <div className='w-full h-full min-h-0 min-w-0 flex flex-col bg-back4 rounded-t-3xl relative' ref={divConObsRef}>
      
      {/** top section */} 
      <div className='flex flex-row py-2 px-3 md:px-5 justify-between items-center w-full text-brown1'>
        {/** back */}
        <Button bgspan='fore/20' type='button' onClick={handleBack} title='back' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
          <IoArrowBackSharp className='text-2xl md:text-3xl' />
        </Button>

        {/** followers or followed */}
        <div className='flex flex-row font-bold'>
          
          {/** followed button switch to players followed */}
          <Button bgspan='fore/20' onClick={() => setShowFollowers(false)} className={clsx('px-4 py-2', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': !showFollowers,
            'text-fore1': showFollowers,
          })}>
            <h1>Following</h1>
          </Button>

          {/** followers button switch to followers */}
          <Button bgspan='fore/20' onClick={() => setShowFollowers(true)} className={clsx('py-2 px-4', {
            'text-brown2 border-b-2 border-brown2 bg-brown5/10': showFollowers,
            'text-fore1': !showFollowers,
          })}>
            <h1>Followers</h1>
          </Button>

        </div>

        <div className='h-10 w-10' />
      </div>

      {/** main section */}
      <main className='flex-1 w-full flex-col relative min-h-0 min-w-0 overflow-auto no-scrollbar bg-back3'>

        {/** search bar */}
        <Search setSearch={setSearch} what={showFollowers ? 'followers' : 'following'} />

        <div className='flex w-full flex-col flex-1 bg-back3 py-5 gap-4 overflow-scroll no-scrollbar min-h-0 min-w-0'>

          {/** followers & following */
            showFollowers ?
              isErrorFollowers ? 
                <h1 className='text-fore1 text-xl self-center'>Fetching followers failed</h1> :
              isPendingFollowers ?
                <PlayersSkeleton /> :
              followers && followers.length > 0 ?
                <>
                  <Followers viewProfile={viewProfile} players={followers} />
                  {
                    isFetching ?
                      <PlayersSkeleton /> :
                    isErrorFetching && 
                      <h1 className='text-fore1 text-xl self-center'>Error fetching more players</h1> 
                  }
                </> :
              <h1 className='text-fore1 text-xl self-center'>No followers found</h1> 
            : isErrorFollowing ? 
                <h1 className='text-fore1 text-xl self-center'>Fetching following failed</h1> :
              isPendingFollowing ?
                <PlayersSkeleton /> :
              following && following.length > 0 ?
                <>
                  <Followers viewProfile={viewProfile} players={following} />
                  {
                    isFetching ?
                      <PlayersSkeleton /> :
                    isErrorFetching && 
                      <h1 className='text-fore1 text-xl self-center'>Error fetching more players</h1> 
                  }
                </> :
              <h1 className='text-fore1 text-xl self-center'>No following players found</h1> 
            //<PlayersSkeleton />
          }

          <div className='h-1 w-full bg-fore' ref={divObsRef} />
        </div>

      </main>

      {// profile card
        profileId && 
        <ProfileCard id={profileId} close={() => setProfileId('')} />
      }
    </div>
  )
}

export default Page;