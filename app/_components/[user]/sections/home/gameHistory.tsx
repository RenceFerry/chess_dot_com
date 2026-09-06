'use client';

import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { GameHistoryType } from '@/_lib/types';
import { fetchGameHistory } from '@/_utils/serverActions/fetchActions';
import { formatDate } from '@/_utils/helpers';
import useUserDet from '@/_lib/context/userDetailsContext';

const GameHistory = () => {
  const userDet = useUserDet();

  const { data: history, isError, isPending } = useQuery({
    queryKey: ['gameHistory'],
    queryFn: async () => {
      const { data, error } = await fetchGameHistory();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 60
  });
  //const history = undefined, isError = false, isLoading = true;

  return (
    <table className='w-full text-center border-collapse min-w-max'>
      <thead className='bg-brown2 h-12 font-bold text-fore sticky top-0 z-10'>
        {/** title table */}
        <tr>
          <th>Opponent</th>
          <th>Outcome</th>
          <th>Mode</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody className='font-semibold text-fore1 bg-back4'>
        { history && history?.length !== 0 ?
          history.map((his: GameHistoryType, i: number) => {
            const opponent = his.players.find(p => p.userId !== userDet.id);

            return (
            <tr className='group h-12 cursor-pointer' key={i}>
              {/** opponent's name */}
              <td className='min-w-max'>{opponent?.player.name}</td>
              {/** w or l */}
              <td className={clsx({
                'text-error1': opponent?.outcome === 'W',
                'text-green2': opponent?.outcome === 'L',
              })}>{opponent?.outcome === 'W' ? 'L' : 'W'}</td>
              {/** game mode */}
              <td>{his.mode}</td>
              {/** game date */}
              <td>{formatDate(his.date)}</td>
            </tr>
          )}) :
          isPending ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td colSpan={4}>
                  <div className='w-[95%] mx-auto h-10 bg-back2 my-4 rounded-lg animate-pulse' />
                </td>
              </tr>
            ))
          ) :
          isError ? <tr><td colSpan={4}>Error loading game history</td></tr> :
          <tr><td colSpan={4} className='text-fore'>No game history found</td></tr>
        }
      </tbody>
    </table>
  )
}

export default GameHistory;