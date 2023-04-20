/* NavItems for the SideBar */

import {
  Flex,
  FlexProps,
  Icon,
  Link,
} from '@chakra-ui/react';

import { ReactText } from 'react';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText | string;
    link: string;
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
  }
  
const NavItem = ({ link, icon, children, isSelected, setIsSelected, ...rest }: NavItemProps) => {
    return (
      
      <Link 
        href={link} 
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          role="group"
          cursor="pointer"
          {...rest}
          onClick={() => {
            setIsSelected(!isSelected);
          }}
          bg={isSelected ? "yellow.100" : ""}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'black',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
      
    );
  };

export default NavItem;