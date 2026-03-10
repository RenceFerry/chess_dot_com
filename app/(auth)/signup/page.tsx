'use client';

import bgChessBoard from '@/assets/chessboard-background.346891ba.png';

import { IoPersonSharp } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { FaAt } from "react-icons/fa";

import Image from 'next/image';
import { useState, useEffect, useActionState } from 'react';
import Link from 'next/link';
import type { StateAuthForm } from '@/_lib/types';
import { signupSA } from '@/_utils/serverActions/auth/serverActions';
import clsx from 'clsx';
import { useNotif } from '@/_utils/context/notifContext';
import { redirect } from 'next/navigation';
import Logo from '@/_components/logo';

const initialState: StateAuthForm = null;

const Page = () => {
  const [ isPasswordHidden, setIsPasswordHidden ] = useState<boolean>(true);
  const [ state, formAction, pending ] = useActionState(signupSA, initialState);

  const notif = useNotif();

  useEffect(() => {
    if (state?.code === 0) {
      notif?.setNotif({
        message: state?.message || '',
        color: 'green2'
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

        {/** header / logo */}
        <Logo imgSz={2} textSz={1}/>

        <h1 className='font-bold text-brown1 text-xl my-4 md:text-2xl'>Create an account.</h1>

        {/** form */}
        <form action={formAction} className='flex flex-col gap-3 jutify-between items-center w-full pt-10 px-10 bg-back1 rounded-tl-md rounded-tr-md'>

          {/** name */}
          <div className='relative w-full h-10'>
            <input defaultValue={state?.payload?.username} title='username' type="text" placeholder='Username' name='username' className={clsx('peer w-full h-full rounded-md outline-none border bg-back pl-14', {
              'border-error1': state?.error?.properties?.username,
              'border-fore2 hover:border-fore focus:border-fore': !(state?.error?.properties?.username)
            })}/>

            <div className='peer-focus:text-fore peer-hover:text-fore text-fore2 absolute top-0 left-0 h-full ml-5 flex flex-col justify-center'>
              <IoPersonSharp className='text-xl' />
            </div>
          </div>

          {/** username error message */
            state?.error?.properties?.username &&
            <p className='text-error1 text-sm self-start inline mb-2'>{state?.error?.properties?.username?.errors[0]}</p>
          }

          {/** email */}
          <div className='relative w-full h-10'>
            <input defaultValue={state?.payload?.email} title='email' name='email' type="text" placeholder='email' className={clsx('peer w-full h-full rounded-md outline-none border bg-back pl-14', {
              'border-error1': state?.error?.properties?.email,
              'border-fore2 hover:border-fore focus:border-fore': !(state?.error?.properties?.email)
            })}/>

            <div className='peer-focus:text-fore peer-hover:text-fore text-fore2 absolute top-0 left-0 h-full ml-5 flex flex-col justify-center'>
              <FaAt className='text-xl' />
            </div>
          </div>

          {/** email error message */
            state?.error?.properties?.email &&
            <p className='text-error1 text-sm self-start inline mb-2'>{state?.error?.properties?.email?.errors[0]}</p>
          }

          {/** password */}
          <div className='relative w-full h-10'>
            <input defaultValue={state?.payload?.password} name='password' title='password' type={isPasswordHidden ? 'password' : 'text'} placeholder='Password' className={clsx('peer w-full h-full rounded-md outline-none border bg-back pl-14', {
              'border-error1': state?.error?.properties?.password,
              'border-fore2 hover:border-fore focus:border-fore': !(state?.error?.properties?.password)
            })}/>

            <div className='peer-focus:text-fore peer-hover:text-fore text-fore2 absolute top-0 left-0 h-full ml-5 flex flex-col justify-center'>
              <IoIosLock className='text-xl' />
            </div>

            <button onClick={() => setIsPasswordHidden(!isPasswordHidden)} type='button' title={isPasswordHidden ? 'show' : 'hide'} className='hover:text-fore cursor-pointer text-fore2 absolute top-0 right-0 h-full mr-5 flex flex-col justify-center'>
              {
                isPasswordHidden ?
                <LuEye className='text-xl' /> :
                <LuEyeClosed className='text-xl' />
              }
            </button>
          </div>

          {/** password error message */
            state?.error?.properties?.password &&
            <p className='text-error1 text-sm self-start inline mb-2'>{state?.error?.properties?.password?.errors[0]}</p>
          }

          {/** sign up button */}
          <button disabled={pending} type='submit' title='log in' className="rounded-md bg-brown2 my-5 w-full h-12 font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-brown3">
            Create Account
          </button>

          {/** or */}
          <div className="flex flex-row justify-center items-center gap-2 w-full">
            <div className='bg-fore2 h-0.5 flex-1'/>
            <h1 className='text-md font-normal text-fore2'>OR</h1>
            <div className='bg-fore2 h-0.5 flex-1'/>
          </div>
        </form>

        {/** login with google */}
        <form className='w-full px-10 bg-back1' action='/api/auth/login/google' method='GET'>
          <button type='submit' title='continue with goolge' className="rounded-md bg-brown5 my-5 w-full h-12 font-semibold text-lg flex flex-row justify-center items-center gap-3 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-brown4 cursor-pointer">
            <FcGoogle className='text-2xl'/>
            Continue with Google
          </button>
        </form>

        <div className="h-12 w-full bg-back2 rounded-bl-md rounded-br-md grid items-center justify-center">
          <h1 className="text-normal text-fore2">
            Already have an accout? <Link href='/login' className='text-brown1 font-semibold underline'>Log in!!</Link>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Page;