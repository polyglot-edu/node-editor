import { Button, HStack, Text } from "@chakra-ui/react";

import Nav from "../Layout/NavBar";

export default function Navbar() {
    return (
      <Nav bg="white" color="black">
        <HStack>
          <Text>ENCORE</Text>
        </HStack>
        <HStack>
          <div>

            <Button colorScheme="red" size={['sm', 'md']}>
              Log in
            </Button>
          </div>
        </HStack>
      </Nav>
    );
  }