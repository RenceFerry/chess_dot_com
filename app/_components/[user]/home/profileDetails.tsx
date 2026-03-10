import demo from '@/assets/demo.png';
import Image from 'next/image';

const ProfileDetails = () => {
  return (
    <>
      {/** profile pic */}
      <div className='h-34 w-34 sm:w-64 sm:h-64 md:h-84 md:w-84 rounded-full object-cover overflow-hidden'>
        <Image alt='profile picture' src={demo} />
      </div>

      {/** user details */}
      <div className='flex flex-col items-center justify-center gap-2 md:h-full p-4'>
        <h1 className='text-brown1 text-lg font-semibold md:text-3xl'>John Doe (1234)</h1>
        <p className='text-sm font-semibold mt-2 text-fore1 md:text-xl'>1M followers</p>
        <p className='text-sm font-semibold text-fore1 md:text-xl'>37 Games</p>
        <p className='text-sm font-semibold md:text-xl text-fore1'><span className='text-green3'>W:</span> 34&emsp; <span className='text-error2'>L:</span> 2&emsp; <span className='text-brown2'>D:</span> 1</p>
      </div>
    </>
  )
}

export default ProfileDetails;