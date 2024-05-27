import { useUser } from '@auth0/nextjs-auth0/client';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CourseCard from '../../components/Card/CourseCard';
import CreateCourseModal from '../../components/Modals/CreateCourseModal';
import DeleteFlowModal from '../../components/Modals/DeleteFlowModal';
import Navbar from '../../components/NavBars/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import { APIV2 } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';
import { PolyglotCourse } from '../../types/polyglotElements/course/PolyglotCourse';
import auth0 from '../../utils/auth0';

type CourseIndexPageProps = {
  accessToken: string | undefined;
};

const CourseIndexPage = ({ accessToken }: CourseIndexPageProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const [courses, setCourses] = useState<PolyglotCourse[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>();
  const { user, isLoading, error } = useUser();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const {
    isOpen: cfOpen,
    onClose: cfOnClose,
    onOpen: cfOnOpen,
  } = useDisclosure();
  const {
    isOpen: dfOpen,
    onClose: dfOnClose,
    onOpen: dfOnOpen,
  } = useDisclosure();

  // User need to be loaded
  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

  const deleteFlow = useCallback(
    async (flowId: string) => {
      await API.deleteFlow(flowId);
      setFlows((prev) => prev.filter((flow) => flow._id !== flowId));
    },
    [API]
  );

  useEffect(() => {
    if (!selectedFlowId) return;
    dfOnOpen();
  }, [dfOnOpen, selectedFlowId]);

  useEffect(() => {
    if (user || process.env.TEST_MODE === 'true') {
      API.loadCourses().then((resp) => {
        setCourses(resp.data);
      });
    }
  }, [user, searchValue, API, currentTab]);

  if (isLoading) return null;

  if (error) console.error(error);
  
  return (
    <>
      <Navbar user={user} />
      <Box px="10%">
        <Heading py="5%">Courses</Heading>
        <SearchBar
          inputValue={searchValue}
          setInputValue={setSearchValue}
          items={suggestions}
          placeholder="Search courses..."
        />
        <Tabs pt="3%" onChange={(index) => setCurrentTab(index)}>
          <TabList>
            <Tab>My Courses: {courses.length}</Tab>
            <Tab>All courses</Tab>
            <Tab>Subscribed Courses</Tab>
          </TabList>

          <TabPanels>
            <TabPanel pt="3%">
              {courses.length ? (
                courses.map((course, id) => (
                  <CourseCard
                    key={id}
                    course={course}
                    py={1}
                    canDelete={true}
                    setSelected={setSelectedFlowId}
                  />
                ))
              ) : (
                <Heading size={'md'} textAlign="center">
                  You have 0 Courses available! <br />
                  Create one with the + button ;)
                </Heading>
              )}
              <Tooltip label="Create Course">
                <IconButton
                  hidden={!(user || process.env.TEST_MODE === 'true')}
                  aria-label="Course Flow"
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
            </TabPanel>
          </TabPanels>
        </Tabs>
        <CreateCourseModal isOpen={cfOpen} onClose={cfOnClose} API={API} />
        {selectedFlowId && (
          <DeleteFlowModal
            isOpen={dfOpen}
            onClose={() => {
              dfOnClose();
              setSelectedFlowId(undefined);
            }}
            deleteFunc={deleteFlow}
            flowId={selectedFlowId}
          />
        )}
      </Box>
    </>
  );
};

export default CourseIndexPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth0.getSession(ctx.req, ctx.res);

  if (!session) return { props: {} };

  return {
    props: {
      accessToken: session.accessToken,
    },
  };
};
