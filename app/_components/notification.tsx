"use client";

import { useNotif } from "@/_utils/context/notifContext";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

const Notification = () => {
  const notif = useNotif();

  useEffect(() => {
    const timer = setTimeout(() => {
      notif?.setNotif(null);
    }, 5000);

    return () => clearTimeout(timer); // cleanup on unmount or re-render
  }, [notif]);

  const abortTimeOut = () => {
    notif?.setNotif(null);
  };

  return (
    <>
      { notif && notif.notif &&
        <div className='absolute right-5 top-5 bg-back2 border-brown4 border-3 rounded-3xl min-h-20 min-w-64 flex justify-between items-center flex-row p-4 text-fore1 z-10'>
          <h1 className={`text-md text-${notif?.notif?.color || 'fore2'}`}>{notif?.notif?.message}</h1>
          <button onClick={abortTimeOut} className='flex justify-center items-center ml-2 h-10 w-10 cursor-pointer hover:bg-back rounded-full hover:text-brown2' type='button' title='close'>
            <IoClose className="text-error1 text-xl md:text-2xl" />
          </button>
        </div>
      }
    </>
  );
}

export default Notification;