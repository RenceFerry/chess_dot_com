'use client'

import Link from 'next/link';
import { FaChessPawn } from "react-icons/fa";

const Logo = ({ imgSz, textSz}: {imgSz: number, textSz: number}) => {
  return (
    <Link href={'/'} className="flex flex-row justify-center items-end">
      <FaChessPawn className={`text-${imgSz}xl md:text-${imgSz + 2}xl text-brown2`} />
      <h1 className={`-ml-2 text-${textSz}xl md:text-${textSz + 2}xl font-bold text-fore`}>Chess<span className="text-xs md:text-lg">DotCom</span></h1>
    </Link>
  )
}

export default Logo;