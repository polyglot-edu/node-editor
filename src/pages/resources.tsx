import { Box, Flex, Heading } from '@chakra-ui/react';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import ResourceCard from '../components/Card/ResourceCard';
import Navbar from '../components/NavBars/NavBarEncore';
import SideBar from '../components/SideBar/SideBar';

const Home = () => {
  const router = useRouter(); // router è un hook di next.js che fornisce l'oggetto della pagina corrente
  const { user } = useUser();

  return (
    <>
      <Navbar user={user} />
      <SideBar pagePath={router.pathname} />
      <Box ml="200px" my="70px" pl="40px">
        <Flex
          w="100%"
          justifyContent="left"
          //justify="space-between"
        >
          <Heading fontFamily="title">Your resources</Heading>
        </Flex>

        <Box my="40px">
          <ResourceCard />
        </Box>
      </Box>
    </>
  );
};

export default Home;
