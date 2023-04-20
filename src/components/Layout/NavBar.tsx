import { Flex } from '@chakra-ui/react';

type NavProps = {
  children?: React.ReactNode;
  p?: number;
  bg?: string;
  color?: string;
  justify?: string;
};

export default function Nav({ children, p, bg, color, justify }: NavProps) {
  return (
    <Flex
      as="nav"
      align="center"
      justify={justify || 'space-between'}
      wrap="wrap"
      p={p || 4}
      bg={bg || 'black'}
      color={color || 'white'}
      borderBottom="1px"
      borderBottomColor={'gray.200'}
    >
      {children}
    </Flex>
  );
}
