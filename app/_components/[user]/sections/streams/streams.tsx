import Search from '@/_components/[user]/search';
import StreamCards from './streamCards';
import { StreamCardsInfoType } from '@/_lib/types';

const Streams = () => {
  const streamCardsInfo: StreamCardsInfoType[] = [
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
    {
      p1: 'GM John Doe (2534)',
      p1Time: '3:07',
      p2: 'GM Alex Doe (2501)',
      p2Time: '3:07',
      mode: 'Blitz'
    },
  ]


  return (
    <div className='flex h-full w-full flex-col relative min-w-0 min-h-0'>

      {/** search bar */}
      <Search what='Streams' />

      {/** search results */}
      <StreamCards cards={streamCardsInfo}/>
    </div>
  )
}

export default Streams;