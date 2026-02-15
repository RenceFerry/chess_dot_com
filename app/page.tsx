import Image from "next/image";
import { FaChessPawn } from "react-icons/fa";
import demo from "@/assets/demo.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-back font-sans">

      {/** top section */}
      <div className="w-full flex flex-row justify-between items-center px-4 py-2 bg-back">

        {/** logo */}
        <div className="flex flex-row justify-center items-end gap-0">
          <FaChessPawn className="text-3xl md:text-4xl text-brown2" />
          <h1 className="-ml-2 text-xl md:text-2xl font-bold text-fore">Chess<span className="text-xs md:text-sm">DotCom</span></h1>
        </div>

      </div>

      {/** main section */}
      <div className="flex-1 flex w-full flex-col md:flex-row justify-center items-center p-4">

        {/** demo image */}
        <div className="w-full flex-1 md:h-full md:flex-1 flex items-center justify-center">
          <Image src={demo} alt="Chess Demo" width={600} height={400} className="w-[60%] md:w-[80%] h-auto rounded-lg shadow-lg" />
        </div>

        {/** get started */}
        <div className="w-full flex-1 flex flex-col md:h-full md:flex-1 justify-start items-center pt-4 gap-3 md:gap-5">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-brown2">Welcome to ChessDotCom</h2>
          <p className="text-center md:text-2xl text-fore">Play chess online with friends or opponents from around the world.</p>

          <Link 
            title="play"
            href="/play"
            className="w-full max-w-xs bg-brown2 hover:bg-brown3 text-fore font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 md:text-xl text-center cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
