'use client';

import { useState, useEffect, useActionState, useRef } from "react";
import Button from "@/_components/wrappers/button";
import { IoClose } from 'react-icons/io5';
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { ChangePasswordSkeleton } from "@/_components/skeletons";
import { checkIfPassword } from "@/_utils/serverActions/fetchActions";
import { changePasswordAction } from "@/_utils/serverActions/postActions";
import { ChangePasswordReturnType } from "@/_lib/types";
import clsx from "clsx";
import { useNotif } from "@/_lib/context/notifContext";

const initialState: ChangePasswordReturnType | null = null;

const ChangePassword = ({ close }: { close: () => void }) => {
  const [ showPasswords, setShowPasswords ] = useState({
    current: false,
    new: false
  })
  const [ loading, setLoading ] = useState(true);
  const [ errorLoading, setErrorLoading ] = useState(false);
  const [ hasPassword, setHasPassword ] = useState(false);
  const [ state, formAction, isPending ] = useActionState(changePasswordAction, initialState);
  const notif = useNotif();
  const notifiedRef = useRef(false);

  useEffect(() => {
    // check if password exist
    const check = async () => {
      const { hasPassword: havePassword, error } = await checkIfPassword();
      setLoading(false);
      if (error || havePassword === null) {
        setErrorLoading(true);
        return;
      }
      setHasPassword(havePassword);
    }

    check();
  }, [])

  useEffect(() => {
    if (state?.success && !notifiedRef.current) {
      notifiedRef.current = (true);
      notif?.setNotif({
        message: `You're password was successfully updated`,
        color: 'green2'
      })
      close();
    }
  }, [state, notif, close]);

  if (loading) {
    return <ChangePasswordSkeleton close={close} />
  }

  return (
    <div className='absolute z-100 rounded-[inherit] w-full h-full flex justify-center items-center backdrop-blur-xs bg-black/10 p-5'>

      {/** actual card */}
      <div className='w-full max-w-100 border border-brown2 bg-back4 rounded-lg flex flex-col'>

        {/** top section */}
        <div className='flex flex-row p-3 justify-between items-center'>

          {/** title */}
          <h1 className='text-brown1'>Change your password</h1>

          {/** close */}
          <Button bgspan='fore/20' click={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
            <IoClose className='text-fore2 text-xl' />
          </Button>
        </div>

        {/** content */
          !errorLoading ?
            <form action={formAction} className='flex flex-col py-2 px-10 gap-3 items-center w-full'>

              {/** current pass */
                hasPassword ?
                  <div className='w-full flex flex-col'>
                    <label htmlFor="currentPass" className='text-fore2 text-sm md:text-md'>Current Password</label>

                    <div className='relative w-full'>
                      <input type={showPasswords.current ? 'text' : 'password'} className='w-full p-2 rounded-md bg-back2' placeholder='current password' title="current password" name="currentPass" defaultValue={state?.data.currentPass || ''} />

                      {/** error message */
                        state && state.error && state.error.properties?.currentPass &&
                        <p className="text-error1 text-sm">{
                          state.error.properties?.currentPass.errors[0]
                        }</p>
                      }

                      <button onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current})} type='button' title={showPasswords.current ? 'hide' : 'show'} className='hover:text-fore cursor-pointer text-fore2 absolute top-0 right-0 h-full mr-5 flex flex-col justify-center'>
                        {
                          showPasswords.current ?
                          <LuEyeClosed className='text-xl' /> :
                          <LuEye className='text-xl' /> 
                        }
                      </button>
                    </div>
                  </div>
                : 
                  <h1 className="text-md text-brown2">We&apos;ve detected that you don&apos;t have a password yet, set a new password so you could log in using it.</h1>
              }

              {/** new pass */}
              <div className='w-full flex flex-col'>
                <label htmlFor="newPass" className='text-fore2 text-sm md:text-md'>New Password</label>

                <div className='relative w-full'>
                  <input type={showPasswords.new ? 'text' : 'password'} className='w-full p-2 rounded-md bg-back2' placeholder='new password' title="new password" name="newPass" defaultValue={state?.data.newPass || ''} />

                  {/** error message */
                    state && state.error && state.error.properties?.newPass &&
                    <p className="text-error1 text-sm">{
                      state.error.properties?.newPass.errors[0]
                    }</p>
                  }

                  <button onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new})} type='button' title={showPasswords.new ? 'hide' : 'show'} className='hover:text-fore cursor-pointer text-fore2 absolute top-0 right-0 h-full mr-5 flex flex-col justify-center'>
                    {
                      showPasswords.new ?
                      <LuEyeClosed className='text-xl' /> :
                      <LuEye className='text-xl' /> 
                    }
                  </button>
                </div>
              </div>

              {/** confirm new pass */}
              <div className='w-full flex flex-col'>
                <label htmlFor="confirmPass" className='text-fore2 text-sm md:text-md'>Confirm New Password</label>

                <div className='relative w-full'>
                  <input type={'password'} className='w-full p-2 rounded-md bg-back2' placeholder='confirm new password' title="confirm new password" name='confirmPass' defaultValue={state?.data.confirmPass || ''} />

                  {/** error message */
                    state && state.error && state.error.properties?.confirmPass &&
                    <p className="text-error1 text-sm">{
                      state.error.properties?.confirmPass.errors[0]
                    }</p>
                  }

                </div>
              </div>

              {/** general error */
                state?.error?.errors &&
                <p className="text-error1 text-sm self-start">{
                  state.error.errors[0]
                }</p>
              }

              {/** submit button */}
              <div className='w-full flex flex-row justify-end'>
                <Button type='submit' bgspan='fore/20' className={clsx('w-20 h-10 rounded-md text-back4 bg-brown3 font-semibold', {
                  'opacity-60': isPending
                })} disabled={isPending} >
                  {
                    isPending ?
                      <div className="h-[60%] rounded-full aspect-square border-t-2 border-r-2 border-back3 animate-spin m-auto" />
                    : 'Change'
                  }
                </Button>
              </div>
            </form>
          :
            <h1 className="text-fore1 text-lg self-center">An error has occured</h1>
        }
      </div>
    </div>
  )
}

export default ChangePassword;