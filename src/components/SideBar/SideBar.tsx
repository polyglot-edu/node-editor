import {
  Box,
  BoxProps,
  useDisclosure
} from '@chakra-ui/react';
import { ReactNode, useEffect } from 'react';
import {
  FaVoteYea
} from 'react-icons/fa';
import {
  IoTelescope
} from 'react-icons/io5';
import {
  RiDashboardFill,
  RiNodeTree,
} from 'react-icons/ri';

import { useState } from 'react';
import { IconType } from 'react-icons';
import NavItem from '../NavItems/NavItem';


interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: RiDashboardFill, link: '/dashboard'},
  { name: 'Discover', icon: IoTelescope, link: '/'},
  { name: 'Your resources', icon: FaVoteYea, link: '/resources'},
  { name: 'Plan', icon: RiNodeTree, link: '/flows'},
];

export default function Sidebar({
  pagePath
}: {
  children?: ReactNode;
  pagePath: string;
}) {
  const { onClose } = useDisclosure();
  //const [selectIndex, setSelectIndex] = useState(-1); // -1 indica nessun elemento selezionato
  const [selectedLink, setSelectedLink] = useState<string>('');
  const setIsSelected = (link: string) => {
    setSelectedLink(link);
  };

  // permette di aggiornare il link di riferimento ogni volta che cambiamo pagina richiamando la funzione setSelectedLink()
  useEffect(() => {
    setSelectedLink(pagePath);
  }, [pagePath]); // l'array [pagePath] indica che bisogna richiamare la funzione solo quando cambia la variabile pagePath. Altrimenti lo farebbe ad ogni render della pagina per qualsiasi modifica
  
  return (
    <Box >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'vartical-flex', md: 'block' 
                    /* questa dicitura serve a specificare 
                    come deve essere mostrata la sidebar per i viewport 'base', quindi
                    più piccoli (metà finestra), e per i viewport più grandi (md) */
                }}
        selectedLink={selectedLink}
        setIsSelected={setIsSelected}
      />
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose?: () => void;
  selectedLink: string;
  setIsSelected: (link: string) => void;
}

const SidebarContent = ({ selectedLink: selectedLink, setIsSelected, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={'white'}
      borderRight="1px"
      borderRightColor={'gray.200'}
      w={{ base: 'flex', md: 'auto' }}
      pos="fixed"
      zIndex="sticky"
      left="0"
      h="full"
      {...rest}>

      {LinkItems.map((link) => (
        <NavItem 
          key={link.name} 
          icon={link.icon} 
          link={link.link}
          isSelected={link.link === selectedLink}
          setIsSelected={() => setIsSelected(link.link)}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};