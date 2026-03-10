'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useActionState, useState, useRef, RefObject } from "react";
import { verifyEmailSA } from '@/_utils/serverActions/auth/serverActions';
import Image from 'next/image';
import bgChessBoard from '@/assets/chessboard-background.346891ba.png';
import Logo from "@/_components/logo";
import { StateAuthForm } from "@/_lib/types";
import clsx from "clsx";
import Link from "next/link";

const initialState: StateAuthForm = null;

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ex = searchParams.get('ex');
  const [ state, formAction, pending ] = useActionState(verifyEmailSA, initialState);
  const [ timer, setTimer ] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!ex) router.push('/signup');
  }, [ex, router])

  useEffect(() => {
    if (!timerRef.current) {
      timerRef.current = ex ? parseInt(ex) - Date.now() < 0 ? 0 : parseInt(ex) - Date.now() / 1000 : 0;
      setTimer(timerRef.current);
    }

    if (timer < 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev--);
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [timer, ex])

  return (
    <div className='relative h-full w-full flex justify-center items-center'>
    
      {/** bg image */}
      <Image src={bgChessBoard} className='absolute w-full bottom-0 -z-10' alt="bgchessboard" />

      {/** form container */}
      <div className='flex flex-col min-w-84 w-[75%] max-w-125 items-center'>

        {/** header */}
        <Logo imgSz={2} textSz={1}/>

        <h1 className='font-bold text-brown1 text-xl md:text-2xl my-4'>Verify your email.</h1>

        {/** form */}
        <form action={formAction} className='flex flex-col gap-3 jutify-between items-center w-full pt-10 px-10 bg-back1 rounded-tl-md rounded-tr-md'>

          {/** name, email */}
          <div className='relative w-full h-10'>
            <input title='otp' type="text" placeholder='Type the OTP we send to your email' name='otp' className={clsx('peer w-full h-full rounded-md outline-none border bg-back px-3 border-fore2 hover:border-fore focus:border-fore', {
              'border-error1': state?.code !== 0,
            })}/>
          </div>

          {/** name error message */
            state?.message &&
            <p className='text-error1 text-sm self-start inline'>{state?.message}</p>
          }
          
          {/** verify  button */}
          <button disabled={pending} type='submit' title='log in' className="rounded-md bg-brown2 mt-2 w-full h-12 font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-brown3 cursor-pointer">
            Verify
          </button>

          {/** timer */}
          <p className="text-center text-md text-fore1 mb-2">
            { Math.floor(timer / 60) > 0 ?
              (`${Math.floor(timer/60)}:${timer % 60 < 10 ? '0' + timer % 60 : timer % 60}`) :
              (timer % 60)
            }
          </p>

        </form>

        <div className="h-12 w-full bg-back2 rounded-bl-md rounded-br-md grid items-center justify-center">
          <h1 className="text-normal text-fore2">
            Having Problems? <Link href='/signup' className='text-brown1 font-semibold underline'>Try signing up again!!</Link>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Page;