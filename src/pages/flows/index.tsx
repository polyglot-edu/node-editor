import { Heading, VStack } from '@chakra-ui/react';
import { DefaultButton } from '@fluentui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FlowCard from '../../components/Card/FlowCard';
import Navbar from '../../components/NavBars/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useUser } from '../../context/user.context';
import { API } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';

const FlowIndexPage = () => {
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const { user, loading } = useUser();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const query = router.query?.q?.toString();

  useEffect(() => {
    API.autocomplete(searchValue).then((resp) => {
      const payload = resp.data;
      setSuggestions(payload);
    });
  }, [searchValue]);

  useEffect(() => {
    if (user) {
      API.loadFlowList(query).then((resp) => {
        setFlows(resp.data);
      });
    }
  }, [user, query]);

  if (!user && loading) return null;

  return (
    <>
      <Navbar user={user} />
      <Heading px="10%" pt="5%">
        Navigate Flows
      </Heading>
      <SearchBar
        inputValue={searchValue}
        setInputValue={setSearchValue}
        items={suggestions}
      />
      <VStack alignItems={'center'}>
        {flows.length ? (
          flows.map((flow, id) => <FlowCard key={id} flow={flow} />)
        ) : (
          <span className="text-xl font-bold text-center">
            No flows found! <br />
            Sign in to access more content
          </span>
        )}
      </VStack>
      <Link href="/flows/create">
        <DefaultButton
          toggle
          checked={false}
          iconProps={{ iconName: 'Add' }}
          className="border-0 w-10 h-10 rounded-full fixed right-10 bottom-10 p-0 m-0 bg-green-300"
        />
      </Link>
    </>
  );
};

export default FlowIndexPage;
