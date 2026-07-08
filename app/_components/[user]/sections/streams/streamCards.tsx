'use client';

import { StreamCardsInfoType } from '@/_lib/types';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/demo.png';
import Button from '@/_components/wrappers/button';
import { FaChessPawn } from "react-icons/fa6";

const StreamCards = ({ cards }: { cards: StreamCardsInfoType[] }) => {
  const pathname = usePathname();
  const router = useRouter();

  function watchStream(card: StreamCardsInfoType) {
    const params = new URLSearchParams();
    params.set('pl', card.p1Name);
    params.set('op', card.p2Name);
    router.push(`/${pathname.split('/')[1]}/stream?${params.toString()}`);
  }

  return (
    <>
      {
        cards.map((card: StreamCardsInfoType, i: number) => (
          <Button bgspan='fore/20' onClick={() => watchStream(card)} key={i} className='flex mx-auto w-[90%] max-w-200 h-80 rounded-xl flex-col bg-back2 overflow-hidden transition duration-150 hover:scale-103 ease-in-out transform cursor-pointer hover:brightness-125 relative'>

            {/** stream number identifier */
              card.no > 0 &&
              <div className='absolute top-5 left-5 px-2 bg-green3 text-sm md:text-lg rounded-full aspect-square flex items-center text-back4 font-bold'>
                {card.no}
              </div>
            }


            {/** topcard section */}
            <div className='flex flex-row justify-around items-center flex-4'>

              {/** p1 pic */}
              <div className='flex items-center justify-center text-fore1 aspect-square rounded-full w-[25%] overflow-hidden min-h-0 min-w-0 relative'>
                <Image src={card.p1Img || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile (1).jpg'} fill alt='profile pic' className='object-cover rounded-full h-full w-full' />
              </div>

              <h1 className='text-6xl text-error3 font-bold'>VS</h1>

              {/** p2 pic */}
              <div className='flex items-center justify-center text-fore1 aspect-square rounded-full w-[25%] overflow-hidden min-h-0 min-w-0 relative'>
                <Image src={card.p2Img || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile (1).jpg'} fill alt='profile pic' className='object-cover rounded-full h-full w-full' />
              </div>
            </div>

            {/** bottom card section */}
            <div className="flex-1 flex flex-row items-center justify-around bg-brown4 text-md md:text-lg font-semibold text-fore1">
              {/** p1 name */}
              <h1>{`${card.p1Name} (${card.p1Elo})`}</h1>
              {/** game mode */}
              <h1 className='text-fore2'>{card.mode}</h1>
              {/** p2 name */}
              <h1>{`${card.p2Name} (${card.p2Elo})`}</h1>
            </div>

          </Button>
        ))
      }
    </>
  )
}

export default StreamCards;