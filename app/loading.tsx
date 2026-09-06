import Image from "next/image";
import bgChessBoard from '@/assets/chessboard-background.346891ba.png';
import { FaChessPawn } from "react-icons/fa";

const Loading = () => {
  return (
    <div className='center h-full w-full flex-col'>

      {/** bg image */}
      <Image loading="eager" src={bgChessBoard} className='absolute w-full bottom-0' alt="bgchessboard" />

      {/** logo large*/}
      <FaChessPawn className="text-2xl md:text-3xl text-brown2 shadow-2xs animate-bounce" size={100} />

      {/** logo title */}
      <h1 className="text-brown2 text-2xl md:text-3xl font-extrabold">ChessDotCom</h1>

    </div>
  )
}

export default Loading;