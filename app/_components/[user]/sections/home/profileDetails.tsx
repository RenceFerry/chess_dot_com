'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/_components/wrappers/button';
import { ProfileDetSkeleton } from '@/_components/skeletons';
import { useQuery } from '@tanstack/react-query';
import { getUserStat } from '@/_utils/serverActions/fetchActions';
import { formatFollowers } from '@/_utils/helpers';
import useUserDet from '@/_lib/context/userDetailsContext';

const ProfileDetails = () => {
  const userDet = useUserDet();

  const { data: userStat, isError, isPending } = useQuery({
    queryKey: ['userStat'],
    queryFn: async () => {
      const { data, error } = await getUserStat();
      if (error) {
        console.log(error, data);
        throw new Error(error);
      }
      return data;
    },
    staleTime: 1000 * 60 * 60,
    retry: 3
  });

  if (isPending) {
    return <ProfileDetSkeleton />;
  }

  if (isError) {
    return <>An error occured</>;
  }

  if (!userStat) {
    return <>failed to fetch user stat</>
  }

  console.log(userDet.image);

  return (
    <>
      {/** profile pic */}
      <div className='h-34 w-34 sm:w-64 sm:h-64 md:h-84 md:w-84 rounded-full object-cover overflow-hidden relative'>
        <Image unoptimized={true} fill alt='profile picture' src={userDet?.image || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} className='object-cover w-full h-full bg-back2' />
      </div>

      {/** user details */}
      <div className='flex flex-col items-center justify-center gap-2 md:h-full p-4'>

        <h1 className='text-brown1 text-lg font-semibold md:text-3xl'>{userDet?.name.split(' ')[0]} ({userDet.elo})</h1>

        <Button bgspan='fore/40' className='w-fit h-fit p-2 hover:bg-back2'>
          <Link href={'/user/followers'} className='w-full h-full text-fore1 text-sm md:text-xl font-semibold'>
            {formatFollowers(userStat._count.followers)} follower{userStat._count.followers > 1 && 's'}
          </Link>
        </Button>

        <p className='text-sm font-semibold text-fore1 md:text-xl'>{userStat?.win + userStat?.draw + userStat?.lose} Game{userStat?.win + userStat?.draw + userStat?.lose > 1 && 's'}</p>

        <p className='text-sm font-semibold md:text-xl text-fore1'><span className='text-green3'>W:</span> {userStat.win}&emsp; <span className='text-error2'>L:</span> {userStat.lose}&emsp; <span className='text-brown2'>D:</span> {userStat.draw}</p>
        
      </div>
    </>
  )
}

export default ProfileDetails;