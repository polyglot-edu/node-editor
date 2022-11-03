import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Layout/NavBar';
import { useUser } from '../../context/user.context';
import { API } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';


const FlowIndexPage = () => {
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const {user, loading} = useUser();

  useEffect(() => {
    if (user) {
      API.loadFlowList().then((resp) => {
        setFlows(resp.data);
      });
    }
  }, [user]);

  if (!user && loading) return null;

  return (
    <div className='h-screen w-screen'>
      <Navbar user={user}/>
      <div className="flex flex-col items-center justify-center h-full w-screen">        
        {flows.length ? (
          flows.map((flow, id) => (
            <Link href={`/flows/${flow._id}`} key={id} style={{ textDecoration: 'none' }}>
              <div className="border border-solid border-black w-auto h-auto p-3">
                <div className="font-bold text-black">{flow.title}</div>
                <div className='text-black'>{flow.description}</div>
              </div>
            </Link>
          ))) : (
            <span className="text-xl font-bold text-center">No flows found! <br/>Sign in to access more content</span>
          )}
      </div>
    </div>
    
  );
};

export default FlowIndexPage;
