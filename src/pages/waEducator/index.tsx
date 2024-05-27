import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Select,
  SpaceProps,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API } from '../../data/api';
import cardImage from '../../public/collaborative_icon.png';
import {
  PolyglotFlow,
  PolyglotNodeValidation,
  UserBaseInfo,
} from '../../types/polyglotElements';

type FlowCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  user: UserBaseInfo;
};

const UserCard = ({ user, px, py }: FlowCardProps) => {
  console.log(user);
  const [nodeInfo, setNodeInfo] = useState<PolyglotNodeValidation>();
  const toast = useToast();

  useEffect(() => {
    API.getActualNodeInfo({ ctxId: user.key }).then((resp) => {
      setNodeInfo(resp.data);
    });
  }, [API]);

  return (
    <Flex px={px} py={py}>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '200px' }}
          src={cardImage.src}
          alt="Flow card"
        />

        <Stack w="full">
          <CardBody width={'300px'}>
            <Heading size="md">{user.ctx.username}</Heading>
            <Text pt={2} whiteSpace={'pre-wrap'}>
              Actual node: {nodeInfo?.title}
            </Text>
            {nodeInfo &&
              nodeInfo.validation.map((validation) => (
                // eslint-disable-next-line react/jsx-key
                <Button
                  backgroundColor={
                    validation.data.conditionKind == 'pass'
                      ? 'green.500'
                      : 'red.500'
                  }
                  onClick={() =>
                    API.manualProgress({
                      ctxId: user.key,
                      satisfiedConditions: [validation.id],
                      flowId: user.ctx.flowId,
                      authorId: 'admin',
                    }).then((resp) =>
                      toast({
                        title: 'Progress registered',
                        description: resp.data,
                        status: 'success',
                        duration: 3000,
                        position: 'bottom-left',
                        isClosable: true,
                      })
                    )
                  }
                >
                  {validation.title}
                </Button>
              ))}
          </CardBody>
        </Stack>
      </Card>
    </Flex>
  );
};

const FlowsListWorkadventure = () => {
  const [users, setUsers] = useState<UserBaseInfo[]>([]);
  const [flowId, setFlowId] = useState('');
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);

  const handleChange = async (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;
    await setFlowId(selectedValue);

    console.log('Selected option:', selectedValue);

    const response = await API.progressInfo({
      flowId: flowId,
      userId: 'admin',
    });

    setUsers(response.data);
  };

  useEffect(() => {
    API.loadFlowList().then((resp) => {
      setFlows(resp.data);
      setFlowId(resp.data[0]._id ?? '');
    });
  }, [API]);

  if (!users) return;
  return (
    <>
      <Box px="10%">
        <Heading py="5%">Learners doing your Learning path</Heading>
        {/*
          <SearchBar
            inputValue={searchValue}
            setInputValue={setSearchValue}
            items={suggestions}
            placeholder="Search learning paths..."
          />
        */}
        <Tabs pt="3%">
          <TabList>
            <Tab>All</Tab>
          </TabList>
          <Box p={2} paddingTop={'15px'}>
            <FormControl>
              <Select onChange={handleChange}>
                {flows.map((flow, index) => (
                  <option
                    key={index}
                    value={flow._id}
                    onSelect={() => console.log(flow._id)}
                  >
                    {flow.title}
                  </option>
                ))}
              </Select>
              <FormLabel
                style={{
                  font: '15px',
                  top: '-13px',
                  left: '15px',
                  zIndex: '2px',
                  position: 'absolute',
                  backgroundColor: 'white',
                }}
              >
                Choose your Learning Path
              </FormLabel>
            </FormControl>
          </Box>
          <TabPanels>
            <TabPanel>
              <Box
                style={{
                  padding: '5px',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  display: 'flex',
                }}
              >
                {users.length ? (
                  users.map((user, id) => (
                    <UserCard key={id} user={user} py={1} px={1} />
                  ))
                ) : (
                  <Heading size={'md'} textAlign="center">
                    No Learner found! Look in another flow ;)
                  </Heading>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default FlowsListWorkadventure;
