
import Link from 'next/link';
import { headers } from 'next/headers';
import Image from 'next/image';
import bgChessBoard from '@/assets/chessboard-background.346891ba.png';

const Page = async () => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const origin = `${protocol}://${host}`;

  return (
    <div className='bg-back3 w-full h-full min-h-0 min-w-0 flex flex-col gap-8 justify-center items-center relative'>

      {/** bg image */}
      <Image loading="eager" src={bgChessBoard} className='absolute w-full bottom-0' alt="bgchessboard" />

      <div className='text-center text-fore2 text-lg'>
        <span className='text-xl font-bold mr-2 text-fore'>404 |</span>This page does not exist.
      </div>

      <Link href={origin} className='underline text-blue-500'>Go Back Home</Link>
    </div>
  )
}

export default Page;