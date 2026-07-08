'use client';

import { useState, useRef, useEffect } from 'react';
import { StreamCardsSkeleton } from '@/_components/skeletons';
import Search from '@/_components/[user]/search';
import StreamCards from './streamCards';
import { StreamCardsInfoType } from '@/_lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getStreams } from '@/_utils/serverActions/fetchActions';

const NOMORE = 50;

const Streams = () => {
  const queryClient = useQueryClient();
  const [ search, setSearch ] = useState<string>('');
  const cursorRef = useRef<string | undefined>(undefined);
  const nomoreRef = useRef<boolean>(false);
  const numsRef = useRef<number>(0);
  const divObsConRef = useRef<HTMLDivElement | null>(null);
  const divObsRef = useRef<HTMLDivElement | null>(null);
  const [ isFetchingMore, setIsFetchingMore ] = useState<boolean>(false);
  const [ isErrorFetchingMore, setIsErrorFetchingMore ] = useState<boolean>(false);

  // fetch players
  const { data: streams, isPending, isError, isFetching } = useQuery({
    queryKey: [ 'searchStreams', search ],
    queryFn: async () => {
      const { data, error, cursor } = await getStreams(search, undefined, numsRef.current);
      console.log(error);
      if (error || !data) throw new Error(error || '');
      cursorRef.current = cursor;
      nomoreRef.current = data.length < NOMORE;
      numsRef.current = data.length;

      return data;
    },
    staleTime: 1000 * 30,
    enabled: !isFetchingMore
  })

  // auto refetch when needed for scrolling
  useEffect(() => {
    const reFetch = async () => {
      setIsFetchingMore(true);
      setIsErrorFetchingMore(false);
      cursorRef.current = streams ? streams.length > 0 ? streams.at(-1)?.p1Name + '::' + streams.at(-1)?.p2Name + '::' + streams.at(-1)?.no : undefined : undefined;
      
      const { data, error, cursor } = await getStreams(search, cursorRef.current);
      if (error || !data) {
        setIsErrorFetchingMore(true);
        setIsFetchingMore(false);
        
        return;
      }
      
      nomoreRef.current = data?.length < NOMORE;
      numsRef.current += data.length;
      cursorRef.current = cursor;
      
      queryClient.setQueryData(['searchStreams', search], (oldData: StreamCardsInfoType[] | undefined) => {
        if (!oldData) return data;
        return [ ...oldData, ...data ];
      });

      setIsFetchingMore(false);
    }

    // observer
    const observer = new IntersectionObserver(async ([ent]) => {
      console.log(!isPending, !isFetching, !nomoreRef.current)
      if (ent.isIntersecting && !isPending && !isFetching && !nomoreRef.current) {
        await reFetch();
      }
    },{
      root: divObsConRef.current,
      rootMargin: '0px 0px 100px 0px',
      threshold: 1.0
    })

    if (divObsRef.current) {
      observer.observe(divObsRef.current);
    }

    return () => {
      observer.disconnect();
    }
  }, [queryClient, search, streams, isPending, isFetching]);

    // handle search change
  function handleInput(search: string) {
    numsRef.current = 0;
    nomoreRef.current = false;
    cursorRef.current = undefined;
    setSearch(search);
  };

  return (
    <div className='flex h-full w-full flex-col relative min-w-0 min-h-0'>

      {/** search bar */}
      <Search setSearch={handleInput} what='Streams' />


      {/** search results */}
      <div ref={divObsConRef} className='bg-back4 flex-1 overflow-y-auto no-scrollbar py-4 min-h-0 min-w-0'>
        <div className='flex flex-col gap-5 items-center w-full'>
          {
          isError ?
          <h1 className='mt-4 text-sm md:text-lg self-center text-fore2'>Fetching streams failed</h1> :
          isPending ?
          <StreamCardsSkeleton /> :
          streams && streams.length > 0 ?
          <>
            <StreamCards cards={streams} />
            <div ref={divObsRef} className='h-1 w-full' />
            { isFetchingMore && !isErrorFetchingMore && <StreamCardsSkeleton /> }
          </> :
          <h1 className='mt-4 text-sm md:text-lg self-center text-fore2'>No streams found</h1>
        }
        </div>
      </div>
    </div>
  )
}

export default Streams;