import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  IconButton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import FlowCard from '../../components/Card/FlowCard';
import CreateFlowModal from '../../components/models/CreateFlowModal';
import Navbar from '../../components/NavBars/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import { useUser } from '../../context/user.context';
import { APIV2 } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';

const FlowIndexPage = () => {
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const { user, loading } = useUser();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const {
    isOpen: cfOpen,
    onClose: cfOnClose,
    onOpen: cfOnOpen,
  } = useDisclosure();

  const router = useRouter();
  const query = router.query?.q?.toString();

  // User need to be loaded
  const API = useMemo(() => new APIV2(), []);

  useEffect(() => {
    API.autocomplete(searchValue).then((resp) => {
      const payload = resp.data;
      setSuggestions(payload);
    });
  }, [API, searchValue]);

  useEffect(() => {
    if (user) {
      API.loadFlowList(query).then((resp) => {
        setFlows(resp.data);
      });
    }
  }, [user, query, API]);

  if (!user && loading) return null;

  return (
    <>
      <Navbar user={user} />
      <Box px="10%">
        <Heading pt="5%">Navigate Flows</Heading>
        <SearchBar
          py="5%"
          inputValue={searchValue}
          setInputValue={setSearchValue}
          items={suggestions}
        />
        {flows.length ? (
          flows.map((flow, id) => <FlowCard key={id} flow={flow} />)
        ) : (
          <Heading size={'md'} textAlign="center">
            No flows found! <br />
            Search something different ;)
          </Heading>
        )}
        <Tooltip label="Create Flow">
          <IconButton
            hidden={!user}
            aria-label="Create Flow"
            position={'fixed'}
            right={10}
            bottom={10}
            isRound={true}
            h={12}
            w={12}
            bg={'blue.400'}
            _hover={{ bg: 'blue.600' }}
            icon={<AddIcon fontSize={'xl'} color="white" />}
            onClick={cfOnOpen}
          />
        </Tooltip>
        <CreateFlowModal isOpen={cfOpen} onClose={cfOnClose} />
      </Box>
    </>
  );
};

export default FlowIndexPage;
