import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from "@chakra-ui/react";

  import { ChevronDownIcon } from '@chakra-ui/icons';
  
  import { useState } from 'react';
import Navbar from "../components/NavBars/NavBarEncore";
import SearchBar from "../components/SearchBar/SearchBar";
import SideBar from "../components/SideBar/SideBar";
  
  
  const Home = () => {
    //const router = useRouter();     // router è un hook di next.js che fornisce l'oggetto della pagina corrente
    const [searchValue, setSearchValue] = useState('');
    //const [suggestions, setSuggestions] = useState<string[]>([]);
    const suggestions: string[] = [] 
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    

    const options1: string[] = ["All", "Green", "Digital", "Entrepreneurship"];
    /*const options2: string[] = ["All", "cnacin"];
    const options3: string[] = ["All", "cnacin"];
    const options4: string[] = ["All", "cnacin"];

    const handleSelectedOption = (option: any) => {
        if(selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((o) => o != option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    }; */

    //const optionsText = selectedOptions.join(', ');

    return (
      <>
        <Navbar />
          <SideBar pagePath={'/'}/>
          <Box ml='60' my='30px' pl='30px' pr='70px'>
            <Flex 
              w="100%"
              justifyContent="left"
              //justify="space-between"
            >
              <Heading>
                <Text>Discover</Text>
              </Heading>
            </Flex>
            <Box w="100%">
            <Text py="1">Keywords</Text>
            
              <SearchBar
                inputValue={searchValue}
                setInputValue={setSearchValue}
                items={suggestions}
                placeholder="Search resources..."
              />
            
          </Box>

          <div> 
            <Box 
              w="100%"
              pt='10px'
              //display="none"

            >
              <Grid templateColumns='repeat(4, 1fr)' gap={4} >
                <GridItem w='100%' h='10'>
                <Text align="left" py="1">Domain</Text>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
                    <Text align="left">
                        {selectedOptions.includes('All') ? 'All' : selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Options'}
                    </Text>
                  </MenuButton>
                  <MenuList>
                    <MenuItem >
                        <Checkbox 
                            isChecked={selectedOptions.includes(options1[0])}       /* Per gli elementi del menù dovrei fare un array */
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedOptions(options1);
                                } else {
                                    setSelectedOptions([]);
                                }
                            }}
                            
                        >
                            All
                        </Checkbox>
                    </MenuItem>
                    <MenuItem>
                        <Checkbox 
                            isChecked={selectedOptions.includes(options1[1])}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedOptions((prev) => [...prev, options1[1]]);
                                } else {
                                    setSelectedOptions((prev) => prev.filter((option) => option != options1[1]));
                                }
                            }}
                            
                        >
                            Green
                        </Checkbox>
                    </MenuItem>
                    <MenuItem>
                        <Checkbox 
                            isChecked={selectedOptions.includes(options1[2])}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedOptions((prev) => [...prev, options1[2]]);
                                } else {
                                    setSelectedOptions((prev) => prev.filter((option) => option != options1[2]));
                                }
                            }}
                            
                        >
                            Digital
                        </Checkbox>
                    </MenuItem>
                    <MenuItem>
                        <Checkbox 
                            isChecked={selectedOptions.includes(options1[3])}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedOptions((prev) => [...prev, options1[3]]);
                                } else {
                                    setSelectedOptions((prev) => prev.filter((option) => option != options1[3]));
                                }
                            }}
                            
                        >
                            Entrepreneurship
                        </Checkbox>
                    </MenuItem>
                    
                  </MenuList>
                </Menu>
                </GridItem>
                <GridItem w='100%' h='10' alignItems="center">
                <Text align="left" py="1">Subject</Text>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
                    <Text align="left">Subject</Text>
                  </MenuButton>
                  <MenuList>
                    <MenuItem><Checkbox defaultChecked>All</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Chemistry</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>History</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Mathematic</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Psychology</Checkbox></MenuItem>
                  </MenuList>
                </Menu>
                </GridItem>
                <GridItem w='100%' h='10' >
                <Text align="left" py="1">Type of resources</Text>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
                  <Text align="left">Type of resources</Text>
                  </MenuButton>
                  <MenuList>
                    <MenuItem><Checkbox defaultChecked>All</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Articles</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Books</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Lab</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Videos</Checkbox></MenuItem>
                  </MenuList>
                </Menu>
                </GridItem>
                <GridItem w='100%' h='10' >
                <Text align="left" py="1">Audience</Text>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
                  <Text align="left">Audience</Text>
                  </MenuButton>
                  <MenuList>
                    <MenuItem><Checkbox defaultChecked>All</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>1st of Bachelor&apos;s</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>2nd of Bachelor&apos;s</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Adult Education</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Professional</Checkbox></MenuItem>
                  </MenuList>
                </Menu>
                </GridItem>
              </Grid>
            </Box>
            </div>

            <Tabs pt="5%">
                <TabList>
                    <Tab>Bubble chart</Tab>
                    <Tab>Map of concepts</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel pt="3%">
                        <Text align="center">Bubble Chart</Text>
                    </TabPanel> 
                    <TabPanel pt="3%">
                        <Text align="center">Map of concepts</Text>
                    </TabPanel> 
                </TabPanels>
            </Tabs>

          </Box>
          
      </>
    );
  }
  
  export default Home;