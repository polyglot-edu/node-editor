import Link from 'next/link';
import { useEffect, useState } from 'react';
import FlowCard, { ScheletonFlowCards } from '../../components/Card/FlowCard';
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
    <>
      <Navbar user={user}/>
      <div className="flex flex-col items-center justify-center h-full w-screen">        
        <ScheletonFlowCards/>
        {flows.length ? (
          flows.map((flow, id) => (
            <FlowCard flow={flow} key={id}/>
          ))) : (
            <span className="text-xl font-bold text-center">No flows found! <br/>Sign in to access more content</span>
          )}
      </div>
      <Link href="/flows/create">
        <div className="rounded-full w-10 h-10 bg-red-500 fixed right-10 bottom-10"></div>
      </Link>
      
    </>
    
  );
};

export default FlowIndexPage;
