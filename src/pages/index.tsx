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
  Text,
  VStack,
} from "@chakra-ui/react";

import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useRouter } from "next/router";
import { useState } from 'react';
import Navbar from "../components/NavBars/NavBarEncore";
import SearchBar from "../components/SearchBar/SearchBar";
import SideBar from "../components/SideBar/SideBar";


const Home = () => {
  const [searchValue, setSearchValue] = useState('');
  //const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestions: string[] = [] 
  const [showBox, setShowBox] = useState(false);    // used to show the options for the advanced search
  const [buttonName, setButtonName] = useState('Advanced Search');
  const [isClicked, setIsClicked] = useState(false);   // used for the button advanced search
  const router = useRouter();     // router è un hook di next.js che fornisce l'oggetto della pagina corrente


  return (
    <>
      <Navbar />
        <SideBar pagePath={router.pathname}/>
        <Box ml='60' my='70px'>

        <VStack spacing='24px' px="170px">

          <Flex 
            w="100%"
            justifyContent="center"
            //justify="space-between"
          >
            <Heading>
              Discover
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
          {showBox && 
            <Box 
              w="100%"
              px="5"
              //display="none"

            >
              <Grid templateColumns='repeat(4, 1fr)' gap={4} >
                <GridItem w='100%' h='10'>
                <Text align="left" py="1">Domain</Text>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
                    Domain
                  </MenuButton>
                  <MenuList>
                    <MenuItem><Checkbox defaultChecked>All</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Green</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Digital</Checkbox></MenuItem>
                    <MenuItem><Checkbox defaultChecked>Entrepreneurship</Checkbox></MenuItem>
                    
                  </MenuList>
                </Menu>
                </GridItem>
                <GridItem w='100%' h='10' alignItems="center">
                <Text align="left" py="1">Subject</Text>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
                    Subject
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
                    Type of resources
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
                    Audience
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
            </Box> }

          
            <Flex 
              justifyContent="center"
              py="10"
            >
              <Button
                rightIcon={
                  !isClicked ? <ChevronDownIcon/> : <ChevronUpIcon/>
                }
                onClick={(e: any) => {
                  e.preventDefault();
                  if(showBox === false) {
                    setButtonName("Close");
                    setShowBox(true);
                    setIsClicked(!isClicked);
                  }
                  else {
                    setButtonName("Advanced Search");
                    setShowBox(false);
                    setIsClicked(!isClicked);
                  }
                }}
              >
                {buttonName}
              </Button>
            </Flex>
          
          </div>
    
        </VStack>

        </Box>
    </>
  );
}

export default Home;