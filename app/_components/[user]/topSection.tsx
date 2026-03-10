'use client'

import Logo from '@/_components/logo';

const TopSection = () => {
  return (
    <div className='flex flex-row w-full h-12 md:h-14 justify-start items-center px-5'>
      <Logo imgSz={2} textSz={0}/>
    </div>
  )
}

export default TopSection;