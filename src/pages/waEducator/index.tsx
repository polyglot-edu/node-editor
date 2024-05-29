import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
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
import flowImage from '../../public/test_card.png';
import {
  PolyglotFlow,
  PolyglotNodeValidation,
  UserBaseInfo,
} from '../../types/polyglotElements';

type UserCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  user: UserBaseInfo;
};

const UserCard = ({ user, px, py }: UserCardProps) => {
  const [nodeInfo, setNodeInfo] = useState<PolyglotNodeValidation>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    API.getActualNodeInfo({ ctxId: user.key }).then((resp) => {
      setNodeInfo(resp.data);
    });
  }, [API]);

  const completeHidden = !nodeInfo?.validation[0];

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
              nodeInfo.validation.map((validation) => {
                if (validation.type != 'manuallyProgressEdge')
                  return (
                    <Heading
                      size="xs"
                      color="#bd7342"
                      float={'right'}
                      hidden={!nodeInfo?.validation}
                    >
                      validation edge
                    </Heading>
                  );
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Button
                    backgroundColor={
                      validation.data.conditionKind == 'pass'
                        ? 'green.300'
                        : 'red.300'
                    }
                    float={'right'}
                    height={'6'}
                    marginRight={'5px'}
                    isLoading={isLoading}
                    onClick={() => {
                      setIsLoading(true);
                      API.manualProgress({
                        ctxId: user.key,
                        satisfiedConditions: [validation.id],
                        flowId: user.ctx.flowId,
                        authorId: 'admin', //userId with authentication enabled
                      }).then((resp) => {
                        setIsLoading(false);
                        console.log(resp.data);
                        setNodeInfo(resp.data);
                        toast({
                          title: 'Progress registered',
                          description:
                            'The progress had been registered correctly.',
                          status: 'success',
                          duration: 3000,
                          position: 'bottom-left',
                          isClosable: true,
                        });
                      });
                    }}
                  >
                    {validation.title}
                  </Button>
                );
              })}
            <Heading
              size="xs"
              color="#3c9e56"
              float={'right'}
              hidden={!completeHidden}
            >
              completed
            </Heading>
          </CardBody>
        </Stack>
      </Card>
    </Flex>
  );
};

type FlowCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  setSelected: (flowId: string) => void;
  setUsers: (arg0: any) => void;
  flow: PolyglotFlow;
};

const SimpleFlowCard = ({
  flow,
  px,
  py,
  setSelected,
  setUsers,
}: FlowCardProps) => {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
      px={px}
      py={py}
      onClick={async () => {
        const response = await API.progressInfo({
          flowId: flow._id ?? '',
          userId: 'admin',
        });

        setUsers(response.data);
        setSelected(flow._id ?? '');
      }}
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '200px' }}
        src={flowImage.src}
        alt="Flow card"
      />

      <Stack w="full">
        <CardBody>
          <Heading size="md">{flow.title}</Heading>
          <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
            {flow.description}
          </Text>
          <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
            In this Learning Path there are: {flow.nodes.length} learning
            activities
          </Text>
        </CardBody>
      </Stack>
    </Card>
  );
};

const FlowsListWorkadventure = () => {
  const [users, setUsers] = useState<UserBaseInfo[]>([]);
  const [flowId, setFlowId] = useState('');
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);

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
        <Heading py="3%">Learners doing your Learning paths</Heading>
        {/*
          <SearchBar
            inputValue={searchValue}
            setInputValue={setSearchValue}
            items={suggestions}
            placeholder="Search learning paths..."
          />
        */}
        <Tabs>
          <TabList>
            <Tab>All</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {flows.length ? (
                flows.map((flow, id) => (
                  <Box key={id} marginBottom={'5px'}>
                    <SimpleFlowCard
                      key={id}
                      flow={flow}
                      py={1}
                      setSelected={setFlowId}
                      setUsers={setUsers}
                    />
                    <Box
                      style={{
                        padding: '5px',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                        display: 'flex',
                      }}
                      hidden={flowId != flow._id}
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
                  </Box>
                ))
              ) : (
                <Heading size={'md'} textAlign="center">
                  You have created 0 Learning paths! <br />
                  Go create one ;)
                </Heading>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default FlowsListWorkadventure;
