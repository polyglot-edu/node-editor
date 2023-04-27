import { Button, HStack, Image, Text } from '@chakra-ui/react';
import brandLogo from '../../public/logo_encore.png';
import themeEncore from '../../styles/theme';
import Nav from '../Layout/NavBarEncore';

export default function Navbar() {
  return (
    <Nav>
      <HStack>
        <Image
          src={brandLogo.src}
          className="mr-3"
          alt="Encore Logo"
          height="43.046356201171875px"
          width="100px"
          left="50px"
          top="8px"
          border-radius="0px"
        />

        <Text
          fontFamily={themeEncore.fonts.text}
          fontSize="14px"
          fontWeight="300"
          lineHeight="19px"
          letterSpacing="0em"
          textAlign="left"
        >
          Discover
        </Text>
      </HStack>
      <HStack>
        <div>
          <Button
            colorScheme="red"
            size={['sm', 'md']}
            height="60px"
            gap="26px"
          >
            Log in
          </Button>
        </div>
      </HStack>
    </Nav>
  );
}
