import Link from 'next/link';
import Navbar from '../components/Layout/NavBar';
import { useUser } from '../context/user.context';


const Home = () => {
  const {user} = useUser();

  return (
    <div className=''>
      <Navbar user={user}/>
      <div className='flex flex-col space-y-4 items-center justify-center h-screen w-screen'>
        <span className='font-bold text-xl'>Go to Flow</span>
        <div className="rounded bg-cyan-500 pr-2 pl-2 pt-1 pb-1">
          <Link href={'/flows'} className="text-white" style={{ textDecoration: 'none' }}>Enter</Link>
        </div>
      </div>
    </div>
    
  );
};

export default Home;
