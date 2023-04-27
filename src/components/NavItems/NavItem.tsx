/* NavItems for the SideBar */

import { Flex, FlexProps, Icon, Link, Text } from '@chakra-ui/react';

import { ReactText } from 'react';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText | string;
  link: string;
  isSelected: boolean;
  setIsSelected: (value: boolean) => void;
}

const NavItem = ({
  link,
  icon,
  children,
  isSelected,
  setIsSelected,
  ...rest
}: NavItemProps) => {
  return (
    <Link
      href={link}
      style={{ textDecoration: 'none' }}
      //_focus={{ boxShadow: 'none' }}
    >
      <Flex
        height="45px"
        width="196px"
        ml="1px"
        pl="20px"
        align="center"
        //p="4"
        role="group"
        cursor="pointer"
        onClick={() => {
          setIsSelected(!isSelected);
        }}
        borderLeft="5px"
        borderLeftColor={isSelected ? 'accent.900' : 'white'}
        borderLeftStyle={'solid'}
        _hover={{
          bg: 'white',
          color: 'accent.900',
        }}
        bg={isSelected ? 'accent.200' : ''}
        color={'primary'}
        {...rest}
      >
        {icon && (
          <Icon
            width="20px"
            height="20px"
            mr="3"
            fontSize="16"
            _hover={{
              color: 'primary',
            }}
            as={icon}
          />
        )}
        <Text
          fontFamily={'text'}
          fontSize="18px"
          fontWeight="500"
          lineHeight="25px"
          letterSpacing="0em"
          textAlign="left"
        >
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

export default NavItem;
