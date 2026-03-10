import GameHistory from './gameHistory';
import ProfileDetails from '@/_components/[user]/home/profileDetails';

const Home = () => {
  return (
    <div className='w-full h-full min-h-0 flex flex-col justify-start p-5 items-center'>
      
      {/** profile details */}
      <div className='w-full max-w-225 flex justify-center gap-5 items-center sm:flex-row'>
        <ProfileDetails />
      </div>

      {/** game history */}
      <div className='flex-1 min-h-0 mt-5 rounded-lg overflow-auto w-full bg-back4 scrollbar'>
        <GameHistory />
      </div>

    </div>
  )
}

export default Home;