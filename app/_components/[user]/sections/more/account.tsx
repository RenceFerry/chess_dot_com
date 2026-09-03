'use client';

import { useState, useRef } from 'react'
import { IoClose } from 'react-icons/io5';
import { RiEdit2Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import Image from 'next/image';
import Button from '@/_components/wrappers/button';
import useUserDet from '@/_lib/context/userDetailsContext';
import ImageCropper from '@/_components/imageCropper';
import clsx from 'clsx';
import { updateUserDet } from '@/_utils/serverActions/postActions';
import { UserInfo, UserUpdateReturnType, UserUpdateSchemaErrorType } from '@/_lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useNotif } from '@/_lib/context/notifContext';

const AccountWindow = ({ close }: { close: () => void }) => {
  const [ editAccount, setEditAccount ] = useState<boolean>(false);
  const userDet = useUserDet();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [ newImgSrc, setNewImgSrc ] = useState<string | null>(null);
  const [ imgSrc, setImgSrc ] = useState<string | null>(userDet.image);
  const [ processing, setProccessing ] = useState(false);
  const fileRef = useRef<File | null>(null);
  const [ payload, setPayload ] = useState<UserUpdateReturnType>({ name: userDet.name, email: userDet.email, image: null });
  const [ payloadError, setPayloadError ] = useState<UserUpdateSchemaErrorType | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const notif = useNotif();

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log(e.target?.result);
      setNewImgSrc(e?.target?.result as string);
    };

    reader.readAsDataURL(file);
  }
  
  async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setProccessing(true);

    const formData = new FormData(e.currentTarget);
    formData.append('file', fileRef.current || 'null');

    const { data, error } = await updateUserDet(formData);
    setPayload(data);
    setProccessing(false);
    if (error) {
      setPayloadError(error);
      return;
    }

    setPayloadError(null);

    queryClient.setQueryData(['userDetails'] , (prev: UserInfo): UserInfo => {
      return {...prev, image: data.image}
    });

    notif?.setNotif({
      message: 'User details successfully updated',
      color: 'green1'
    })

    setEditAccount(false);
    router.replace(`/${data.name.replaceAll(' ', '')}?tab=more`);
  }

  return (
    <div className={clsx(`absolute flex w-full h-full justify-center items-center backdrop-blur-xs z-20`, {
      'bg-black/40': !newImgSrc,
    })}>

      {/** actual window */
        !newImgSrc &&
        <div className='flex flex-col rounded-lg bg-back4 border-brown2 border min-w-64 w-9/10 md:w-[65%] max-w-150'>

          {/** title & close button */}
          <div className='w-full flex flex-row p-3 justify-between'>

            {/** title */}
            <h1 className='text-lg text-brown1'>Account details</h1>

            {/** close button */}
            <Button bgspan='fore/20' onClick={close} title='close' type='button' className='p-2 rounded-full hover:bg-back2 cursor-pointer'>
              <IoClose className='text-fore2 text-xl' />
            </Button>
          </div>

          {/** content */}
          <div className='flex flex-col p-3 justify-start items-center w-full gap-1'>

            {/** avatar container */}
            <div className='rounded-full relative w-[50%] h-auto'>

              {/** edit avatar button */
                editAccount && 
                <div className='w-[25%] aspect-square absolute bottom-[5%] right-[5%] z-3 bg-back rounded-full hover:bg-back3'>
                  <Button bgspan='fore/20' className='w-full h-full grid items-center rounded-full'>

                    <RiEdit2Line className='text-lg md:text-4xl m-auto' />

                    <input disabled={processing} onChange={(e) => handleFile(e.target.files?.[0])} ref={inputFileRef} type='file' title='change avatar' accept='image/*' className='absolute top-0 left-0 z-3 opacity-0 cursor-pointer w-full h-full' />
                  </Button>
                </div>
              }

              {/** avatar */}
              <Image unoptimized={true} src={imgSrc || 'https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg'} alt='avatar' width={100} height={100} className={clsx(`rounded-full overflow-hidden w-full bg-black p-1`, {
                'opacity-40': processing,
                'opacity-100': !processing
              })} />

              { /** proccessing */
                editAccount && processing &&
                <div className='absolute top-0 left-0 flex justify-center items-center w-full h-full'>
                  <div className='h-[20%] w-[20%] rounded-full border-fore border-r-2 border-t-2 animate-spin' />
                </div>
              }

            </div>

            {/** username */}
            <form onSubmit={handleSave} className='flex flex-col w-full'>
              <fieldset disabled={!editAccount} className='flex flex-col w-full'>
                <div className='flex flex-col gap-2 mt-4 w-full bg-back3 p-1'>
                  <label htmlFor='name' className='text-xs text-brown1 md:text-sm'>Username</label>
                  <input id='name' name='name' type='text' className='text-fore2 md:text-lg p-2' defaultValue={payload.name || ''} />
                </div>
                {/** name error message */
                  payloadError &&
                  <p className='text-error1 pl-3 text-xs md:text-sm'>{payloadError.properties?.name?.errors[0]}</p>
                }

                {/** email */}
                <div className='flex flex-col gap-2 mt-4 w-full bg-back3 p-1'>
                  <label htmlFor='email' className='text-xs text-brown1 md:text-sm'>Email</label>
                  <input readOnly title='Changing email is disabled right now' name='email' id='email' type='email' className='text-fore2 md:text-lg p-2' defaultValue={userDet.email} />
                </div>
                {/** email error message */}

                {/** general error message */
                  payloadError &&
                  <p className='text-error1 pl-3 text-xs md:text-sm'>{payloadError.errors[0]}</p>
                }
              </fieldset>

              {/** edit button */
                editAccount ? 
                <div className='flex justify-around flex-row w-full mt-4'>

                  {/** cancel */}
                  <Button bgspan='back4/20' title='cancel' type='button' onClick={close} className='bg-error1 text-sm md:text-lg text-back3 rounded-md w-26 py-2 cursor-pointer flex flex-row justify-center items-center gap-1'>
                    <IoClose />
                    <h1>Cancel</h1>
                  </Button>

                  {/** save */}
                  <Button disabled={processing} bgspan='back4/20' title='save' type='submit' className={clsx(`bg-green1 text-sm md:text-lg text-back3 rounded-md w-26 py-2 flex flex-row justify-center items-center gap-1`, {
                    'opacity-40 cursor-not-allowed': processing,
                    'opacity-100 cursor-pointer': !processing
                  })}>
                    { processing ?
                      <div className='h-[85%] aspect-square rounded-full border-back border-r-2 border-t-2 animate-spin' /> :
                      <>
                        <FaCheck />
                        <h1>Save</h1>
                      </>
                    }
                  </Button>

                </div> :
                <div className='flex justify-end flex-row w-full mt-4'>
                  <Button bgspan='fore/20' onClick={() => setEditAccount(true)} type='button' title='edit' className='p-2 hover:bg-brown2 bg-brown3 text-fore1 rounded-full text-2xl md:p-3 md:text-3xl cursor-pointer'>
                    <RiEdit2Line />
                  </Button>
                </div>
              }
            </form>
          </div>
        </div>
      }

      {/** view profile */
        newImgSrc &&
        <ImageCropper file={fileRef} imgSrc={newImgSrc} setProccessing={setProccessing} setImgSrc={(src: string | null) => {
          if (src) {
            setImgSrc(src);
            setNewImgSrc(null);
          } else {
            setNewImgSrc(null);
          }
        }} />
      }

    </div>
  )
}

export default AccountWindow;