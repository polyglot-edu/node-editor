import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';

import Image from 'next/image';

import { useUser } from '@auth0/nextjs-auth0/client';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { VennDiagram } from 'reaviz';
import AdvancedSearch from '../components/AdvancedSearch/AdvancedSearch';
import Navbar from '../components/NavBars/NavBarEncore';
import SearchBar from '../components/SearchBar/SearchBarEncore';
import SideBar from '../components/SideBar/SideBar';
import { APIV2 } from '../data/api';
import icon_infocircle from '../public/icons/icon_infocircle.svg';
import themeEncore from '../styles/theme';
//import VennDiagramUpset from '../components/VennDiagram/VennDiagramUpsetJS';
//import dynamic from 'next/dynamic';

//const ChartComponent = dynamic(() => import('../components/VennDiagram/VennDiagramAmCharts'), { ssr: false });

type DiscoverPageProps = {
  accessToken: string | undefined;
};

const Home = (props: DiscoverPageProps) => {
  const [searchValue, setSearchValue] = useState<string[]>([]);
  //let searchValue: string[] = [];
  const [suggestions, setSuggestions] = useState<string[]>([]);
  //const suggestions: string[] = [];
  const [dataSkills, setDataSkills] = useState<any[]>([]);
  const [dataOers, setDataOers] = useState<any[]>([]);
  const [domain, setDomain] = useState<string[]>([]); // to save each type of domain of the resources
  const [subject, setSubject] = useState<string[]>([]);
  //const [typeResources, setTypeResources] = useState<string[]>([]);
  //const [audience, setAudience] = useState<string[]>([]);
  const [showBox, setShowBox] = useState(false); // used to show the options for the advanced search
  const [buttonName, setButtonName] = useState('Advanced Search');
  const [isClicked, setIsClicked] = useState(false); // used for the button advanced search

  const router = useRouter(); // router è un hook di next.js che fornisce l'oggetto della pagina corrente
  const { user } = useUser();
  /*const d: Types.Data[] = [
    { id: 1, name: 'Digital', size: 500, fillColor: 'ligthnlue' },
    { id: 2, name: 'Entrepreneurship', size: 500, fillColor: 'ligthyellow' },
    { id: 3, name: 'Green', size: 500, fillColor: 'ligthgreen' },
  ];*/

  const d = [
    { key: ['Digital'], data: 12 },
    { key: ['Entrepreneurship'], data: 12 },
    { key: ['Green'], data: 12 },
    { key: ['Digital', 'Entrepreneurship'], data: 2 },
    { key: ['Entrepreneurship', 'Green'], data: 2 },
    { key: ['Digital', 'Green'], data: 2 },
    { key: ['Digital', 'Entrepreneurship', 'Green'], data: 1 },
  ];

  //const [data, setData] = React.useState<Types.Data[]>(d.slice(1, 10));

  //let data_list: string[] = [];

  console.log(router.query);

  const searchCallback = async () => {
    const api = new APIV2(props.accessToken);

    const oers = await api.getOERs();
    //const oers = resp.data?.data || [];
    console.log(oers);
    //const labels = skills.map((skill: any) => skill.label); // extract only "label" fields from every object
    //console.log(labels);
    setDataOers(oers);
    console.log(dataOers);

    const oersSkills = oers.map((oer: any) => oer.skills);
    console.log(oersSkills);
    //const oersSkillsLabel = oersSkills.map((skill: any) => skill.label);
    //console.log(oersSkillsLabel);

    // -------------- LABEL --------------
    const oersSkillsLabel = oersSkills.flatMap((skills: any, index: number) => [
      // use of [] to store more labels for the same id_oer in the same array
      skills.length > 0
        ? skills.map((skill: any) => ({
            id_oer: oers[index].id,
            skillLabel: skill.label,
          }))
        : {
            id_oer: oers[index].id,
            skillLabel: '',
          },
    ]);

    console.log(oersSkillsLabel);

    // -------------- DOMAIN --------------

    // taking all domain arrays
    const oersSkillsDomain = oersSkills.flatMap((skills: any) =>
      skills.map((skill: any) =>
        skill.domain?.map((domain: any) => domain.name)
      )
    );

    console.log(oersSkillsDomain);

    // taking possible skill domain without duplicate

    const domainSkill = Array.from(new Set(oersSkillsDomain.flat())).filter(
      (skillDomain: any) => skillDomain !== undefined
    );
    console.log(domainSkill);
    setDomain(domainSkill);

    // -------------- SUBJECT --------------

    const oersSubject = oers.flatMap((oer: any) => [
      oer.subject?.map((subject: any) => subject.name),
    ]);
    console.log(oersSubject);
    // taking all possible type of subjects without duplicate

    const oersSubjects = Array.from(new Set(oersSubject.flat())).filter(
      (subject: any) => subject !== undefined
    );
    console.log(oersSubjects);
    setSubject(oersSubjects);
  };

  useEffect(() => {
    console.log('ciao');
    const api = new APIV2(props.accessToken);

    // nella useEffect le funzioni async fanno fatte così, è sbagliato mettere async subito la prima
    (async () => {
      try {
        const skills = await api.getSkills();
        //const skills = respSkills.data?.data || [];
        const labels = skills.map((skill: any) => skill.label); // extract only "label" fields from every object
        setDataSkills(skills);
        console.log(dataSkills);
        setSuggestions(labels);
        console.log(suggestions);
      } catch (error) {
        console.error(error);
      }
      /*const respOers = await api.getOERs();
      const oers = respOers.data?.data || [];
      console.log(oers);
      setDataOers(oers);*/
    })();
  }, []);

  return (
    <>
      <Navbar user={user} />
      <SideBar pagePath={router.pathname} />
      <Box ml="200px" mt="50px">
        <VStack spacing="24px" mx="170px">
          <Flex
            w="100%"
            justifyContent="center"
            //justify="space-between"
          >
            <Heading fontFamily={themeEncore.fonts.title}>Discover</Heading>
          </Flex>

          <Box w="100%">
            <HStack>
              <Text variant="label" my="6px">
                Keywords
              </Text>
              <Tooltip
                hasArrow
                placement="top"
                label="Keywords. Search resources in Green, Digital and Entrepreneurial skills from ENCORE OERs database."
                aria-label="Search resources in Green, Digital and Entrepreneurial skills from ENCORE OERs database."
                ml="1px"
                bg="white"
                color="primary"
                p={2}
              >
                <span>
                  {' '}
                  {/*use span element to fix problem of communication between Tooltip element and svg image*/}
                  <Image src={icon_infocircle} alt="infocircle" />
                </span>
              </Tooltip>
            </HStack>

            <SearchBar
              inputValue={searchValue}
              setInputValue={setSearchValue}
              items={suggestions}
              onSearchCallback={searchCallback}
              placeholder="Search resources..."
            />
          </Box>

          <div>
            {showBox && (
              <Box
                w="100%"
                px="5px"
                //flex="1"
                //display="none"
              >
                <AdvancedSearch domain={domain} subject={subject} />
              </Box>
            )}

            <Flex justifyContent="center" mt={isClicked ? '70px' : '5px'}>
              <Button
                variant="link"
                //textDecoration="underline"
                rightIcon={!isClicked ? <ChevronDownIcon /> : <ChevronUpIcon />}
                onClick={(e: any) => {
                  e.preventDefault();
                  if (showBox === false) {
                    setButtonName('Close');
                    setShowBox(true);
                    setIsClicked(!isClicked);
                  } else {
                    setButtonName('Advanced Search');
                    setShowBox(false);
                    setIsClicked(!isClicked);
                  }
                }}
              >
                {buttonName}
              </Button>
            </Flex>
          </div>
          {/*<BubbleChart
            bubblesData={data}
            width={1000}
            height={1000}
            textFillColor="darkgrey"
            minValue={1}
            maxValue={150}
            backgroundColor="white"
          />*/}
          <VennDiagram data={d} />
        </VStack>
      </Box>
    </>
  );
};

export default Home;
