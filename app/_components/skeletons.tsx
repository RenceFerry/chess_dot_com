
export const ProfileDetSkeleton = () => {
  return (
    <>
      {/** profile pic */}
      <div className='h-34 w-34 sm:w-64 sm:h-64 md:h-84 md:w-84 rounded-full object-cover overflow-hidden relative bg-back1 animate-pulse' />

      {/** user details */}
      <div className='flex flex-col items-center justify-center gap-4 md:h-full p-4'>

        <div className='text-brown1 text-lg font-semibold md:text-3xl bg-back1 animate-pulse rounded-full h-6 w-40'></div>

        <div className='text-brown1 text-lg font-semibold md:text-3xl bg-back1 animate-pulse rounded-full h-6 w-40'></div>

        <div className='text-brown1 text-lg font-semibold md:text-3xl bg-back1 animate-pulse rounded-full h-6 w-40'></div>
      </div>
    </>
  )
}

export const PlayersSkeleton = () => {
  return (
    <div className='flex-1 flex w-full flex-col bg-back4 py-5 gap-4 overflow-auto no-scrollbar'>
      {
        Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='mx-auto flex flex-row h-18 md:h-20 rounded-full w-[80%] max-w-200 bg-back px-1 relative shrink-0 transform transition-all ease-in-out duration-300 hover:scale-103 hover:brightness-125 cursor-pointer animate-pulse'>

            {/** profile pic */}
            <div className='h-16 md:h-18 md:w-18 w-16 rounded-full my-auto bg-back2' />

            {/** player details */}
            <div className="flex-1 flex flex-row py-2 px-4 items-center justify-between ">

              {/** name */}
              <div className='text-md font-semibold md:text-xl bg-back3 rounded-full h-8 w-50' />

              {/** playing and streaming */}
              <div className='text-fore1 text-sm md:text-lg bg-back2 h-6 w-44 rounded-full'/>
            </div>
          </div>
        ))
      }
    </div>
  )
}