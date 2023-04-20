import {
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";
  
import { useRouter } from "next/router";
import ResourceCard from "../components/Card/ResourceCard";
import Navbar from "../components/NavBars/NavBarEncore";
import SideBar from "../components/SideBar/SideBar";
  
  
  
  const Home = () => {
    const router = useRouter();     // router è un hook di next.js che fornisce l'oggetto della pagina corrente
  
    return (
      <>
        <Navbar />
          <SideBar pagePath={router.pathname}/>
          <Box ml='60' my='70px' pl='40px'>
            <Flex 
              w="100%"
              justifyContent="left"
              //justify="space-between"
            >
              <Heading>
                Your Resources
              </Heading>
            </Flex>

            <Box my="40px">
              <ResourceCard />
            </Box>
          </Box>
          
      </>
    );
  }
  
  export default Home;