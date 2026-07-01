'use client';

import { StreamCardsInfoType } from '@/_lib/types';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/demo.png';
import Button from '@/_components/wrappers/button';

const StreamCards = ({ cards }: { cards: StreamCardsInfoType[] }) => {
  const pathname = usePathname();
  const router = useRouter();

  function watchStream(id: string) {
    const params = new URLSearchParams();
    params.set('id', 'ab131434-1817-40ed-81a4-44db0bf503c8');
    router.push(`/${pathname.split('/')[1]}/stream?${params.toString()}`);
  }

  return (
    <div className='bg-back4 flex-1 overflow-y-auto no-scrollbar py-4 min-h-0 min-w-0'>
      <div className='flex flex-col gap-5 items-center'>
        {
          cards.map((card: StreamCardsInfoType, i: number) => (
            <Button bgspan='fore/20' onClick={() => watchStream('3')} key={i} className='flex mx-auto w-[90%] max-w-200 h-80 rounded-xl flex-col bg-back2 overflow-hidden transition duration-150 hover:scale-103 ease-in-out transform cursor-pointer hover:brightness-125'>

              {/** topcard section */}
              <div className='flex flex-row justify-around items-center flex-4'>

                {/** p1 pic */}
                <div className='flex flex-col gap-2 items-center text-fore1'>
                  <Image src={logo} alt='profile pic' className='h-30 md:h-40 md:w-40 w-30 rounded-full my-auto' />

                  {/** p1 time */}
                  <h1>( {card.p1Time} )</h1>
                </div>

                <h1 className='text-6xl text-error3 font-bold'>VS</h1>

                {/** p2 pic */}
                <div className='flex flex-col gap-2 items-center text-fore1'>
                  <Image src={logo} alt='profile pic' className='h-30 md:h-40 md:w-40 w-30 rounded-full my-auto' />

                  {/** p2 time */}
                  <h1>( {card.p2Time} )</h1>
                </div>
              </div>

              {/** bottom card section */}
              <div className="flex-1 flex flex-row items-center justify-around bg-brown4 text-md md:text-lg font-semibold text-fore1">
                {/** p1 name */}
                <h1>{card.p1}</h1>
                {/** game mode */}
                <h1 className='text-fore2'>{card.mode}</h1>
                {/** p2 name */}
                <h1>{card.p2}</h1>
              </div>

            </Button>
          ))
        }
      </div>
    </div>
  )
}

export default StreamCards;