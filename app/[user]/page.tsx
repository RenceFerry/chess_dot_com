'use client'

import Navbar from "@/_components/[user]/sections/navbar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import More from "@/_components/[user]/sections/more/more";
import Home from '@/_components/[user]/sections/home/home';
import Play from '@/_components/[user]/sections/play/play';
import Streams from '@/_components/[user]/sections/streams/streams';

const Page = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  useEffect(() => {
    if (!currentTab) {
      replace(`${pathname}?tab=home`);
    }
  }, [pathname, replace, currentTab])

  const changeTab = (tab: string) => {
    if (tab !== currentTab) replace(`${pathname}?tab=${tab}`);
  }

  return (
    <div className="h-full w-full min-w-0 min-h-0 flex flex-col justify-between items-center">

      {/** nav and pages */}
      <div className="flex flex-col lg:flex-row flex-1 w-full min-w-0 min-h-0">

        {/** navigation bar */}
        <Navbar activeTab={currentTab || 'home'} change={changeTab}/>

        {/** pages */}
        <div className="flex-1 w-full bg-back3 lg:h-full min-h-0 lg:flex-1">

          {/** home */}
          { currentTab === 'home' &&
            <Home />
          }

          {/** play */}
          { currentTab === 'play' && 
            <Play />
          }

          {/** streams */}
          { currentTab === 'streams' &&
            <Streams />
          }

          {/** more */}
          { currentTab === 'more'  &&
            <More />
          }
        </div>
      </div>
    </div>
  )
}

export default Page;