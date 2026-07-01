'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useActionState, useState, useRef } from "react";
import { verifyEmailSA } from '@/_utils/serverActions/auth/serverActions';
import Image from 'next/image';
import bgChessBoard from '@/assets/chessboard-background.346891ba.png';
import Logo from "@/_components/logo";
import { StateAuthForm } from "@/_lib/types";
import clsx from "clsx";
import Link from "next/link";
import { useNotif } from "@/_lib/context/notifContext";
import { redirect } from 'next/navigation';
import Button from '@/_components/wrappers/button';

const initialState: StateAuthForm = null;

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ex = searchParams.get('ex');
  const [ state, formAction, pending ] = useActionState(verifyEmailSA, initialState);
  const [ timer, setTimer ] = useState<number>(5 * 60 * 1000);
  const timerRef = useRef<number | null>(null);
  const notif = useNotif();
  
  useEffect(() => {
    if (!ex) router.push('/signup');
  }, [ex, router])

  useEffect(() => {
    console.log(timerRef.current, timer, parseInt(ex || '0') - Date.now())

    if (timerRef.current === null) {
      timerRef.current = ex ? parseInt(ex) - Date.now() < 0 ? 0 : parseInt(ex) - Date.now() : 0;
      setTimer(timerRef.current);
    }

    if (timer <= 0) {
      setTimer(0);
      router.push('/signup');
      return;
    }

    console.log(timer);
    const interval = setInterval(() => {
      setTimer(prev => prev -= 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [timer, ex, router])

  useEffect(() => {
    if (state?.code === 0) {
      notif?.setNotif({
        message: state.message || '',
        color: 'green1',
      })

      redirect(state?.redirect || '/');
    }
  }, [state, notif]);

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
            <input title='otp' type="number" placeholder='Type the OTP we send to your email' name='otp' className={clsx('peer w-full h-full rounded-md outline-none border bg-back px-3 border-fore2 hover:border-fore focus:border-fore [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none', {
              'border-error1': state?.code !== 0,
            })}/>
          </div>

          {/** name error message */
            (state?.message && state?.code !== 0) &&
            <p className='text-error1 text-sm self-start inline'>{state?.message}</p>
          }
          
          {/** verify  button */}
          <Button bgspan='fore/20' disabled={pending} type='submit' title='log in' className={clsx('rounded-md bg-brown2 my-5 w-full h-12 font-bold text-lg transition duration-300 ease-in-out transform flex items-center justify-center', {
            'hover:scale-105 hover:bg-brown3 cursor-pointer': !pending,
            'cursor-not-allowed brightness-75': pending
          })}>
            {
              pending ?
              <div className='h-6 w-6 border-t-2 border-r-2 border-fore rounded-full animate-spin self-center' /> :
              <h1>Verify</h1> 
            }
          </Button>

          {/** timer */}
          <p className="text-center text-md text-fore1 mb-2">
            { timer ?
              (Math.floor(timer / 60000) > 0 ?
              (`${Math.floor(timer/60000)}:${timer % 60000 / 1000 < 10 ? '0' + Math.floor(timer % 60000 / 1000) : Math.floor(timer % 60000 / 1000)}`) :
              (Math.floor(timer % 60000 / 1000))) :
              '5:00'
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