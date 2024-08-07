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
import DeleteCourseModal from '../../components/Modals/DeleteCourseModal';
import EditCourseModal from '../../components/Modals/EditCourseModal';
import Navbar from '../../components/NavBars/NavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import { APIV2 } from '../../data/api';
import { PolyglotFlow } from '../../types/polyglotElements';
import {
  PolyglotCourse,
  PolyglotCourseInfo,
} from '../../types/polyglotElements/course/PolyglotCourse';
import auth0 from '../../utils/auth0';

type CourseIndexPageProps = {
  accessToken: string | undefined;
};

const CourseIndexPage = ({ accessToken }: CourseIndexPageProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [flows, setFlows] = useState<PolyglotFlow[]>([]);
  const [courses, setCourses] = useState<PolyglotCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<
    string | undefined
  >();
  const { user, isLoading, error } = useUser();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [openModal, setOpenModal] = useState('');
  const {
    isOpen: ccOpen,
    onClose: ccOnClose,
    onOpen: ccOnOpen,
  } = useDisclosure();
  const {
    isOpen: dcOpen,
    onClose: dcOnClose,
    onOpen: dcOnOpen,
  } = useDisclosure();
  const {
    isOpen: ecOpen,
    onClose: ecOnClose,
    onOpen: ecOnOpen,
  } = useDisclosure();

  // User need to be loaded
  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

  const deleteCourse = useCallback(
    async (courseId: string) => {
      await API.deleteCourse(courseId);
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    },
    [API]
  );

  const enrollCourse = useCallback(
    async (courseId: string) => {
      console.log('Enrolling in course', courseId);
      await API.enrollCourse(courseId);
    },
    [API]
  );

  const updateCourseInfo = useCallback(
    async (courseId: string, course: PolyglotCourseInfo) => {
      await API.editCourseInfo(courseId, course);
    },
    [API]
  );

  useEffect(() => {
    if (user || process.env.TEST_MODE === 'true') {
      let queryparams = '';
      if (currentTab === 0) queryparams = '?me=true&';
      else if (searchValue) queryparams = '?';
      if (searchValue) queryparams += 'q=' + searchValue;
      API.loadCourses(queryparams).then((resp) => {
        setCourses(resp.data);
        setSuggestions([...new Set(resp.data.map((flow) => flow.title))]);
      });
    }
  }, [user, searchValue, API, currentTab, openModal]);

  useEffect(() => {
    console.log('openModal', openModal);
    switch (openModal) {
      case 'create':
        ccOnOpen();
        break;
      case 'edit':
        ecOnOpen();
        break;
      case 'delete':
        dcOnOpen();
        break;
      default:
        ccOnClose();
        ecOnClose();
        dcOnClose();
        break;
    }
  }, [selectedCourseId, openModal]);

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
                    canEdit={true}
                    setSelected={setSelectedCourseId}
                    setOpenModal={setOpenModal}
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
                  aria-label="Create Course"
                  position={'fixed'}
                  right={10}
                  bottom={10}
                  isRound={true}
                  h={12}
                  w={12}
                  bg={'blue.400'}
                  _hover={{ bg: 'blue.600' }}
                  icon={<AddIcon fontSize={'xl'} color="white" />}
                  onClick={() => {
                    setOpenModal('create');
                  }}
                />
              </Tooltip>
            </TabPanel>
            <TabPanel pt="3%">
              {courses.length ? (
                courses.map((course, id) => (
                  <CourseCard
                    key={id}
                    course={course}
                    py={1}
                    canDelete={false}
                    canEdit={false}
                    setSelected={setSelectedCourseId}
                    setOpenModal={setOpenModal}
                  />
                ))
              ) : (
                <Heading size={'md'} textAlign="center">
                  You have 0 Courses available! <br />
                  Create one with the + button ;)
                </Heading>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <CreateCourseModal
          isOpen={ccOpen}
          onClose={() => {
            ccOnClose();
            setOpenModal('');
          }}
          setOpenModal={setOpenModal}
          API={API}
        />
        {selectedCourseId && (
          <EditCourseModal
            isOpen={ecOpen}
            onClose={() => {
              ecOnClose();
              setSelectedCourseId(undefined);
              setOpenModal('');
            }}
            course={courses.find((course) => course._id === selectedCourseId)!}
            courseId={selectedCourseId}
            updateInfo={updateCourseInfo}
          />
        )}
        {selectedCourseId && (
          <DeleteCourseModal
            isOpen={dcOpen}
            onClose={() => {
              dcOnClose();
              setSelectedCourseId(undefined);
              setOpenModal('');
            }}
            deleteFunc={deleteCourse}
            courseId={selectedCourseId}
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
