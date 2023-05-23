import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import DropDownMenuItem from '../DropDownMenuItem/DropDownMenuItem';

type DropDownMenuProps = {
  options: string[];
};

export default function DropDownMenu({ options }: DropDownMenuProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false); // for the open Menu

  const handleToggleMenu = () => {
    setIsOpen(!isOpen); // invert open menu state
  };

  return (
    <>
      <Box flex="1">
        <Menu
          isOpen={isOpen}
          onOpen={handleToggleMenu}
          onClose={handleToggleMenu}
        >
          <MenuButton
            as={Button}
            variant="dropdown"
            rightIcon={<ChevronDownIcon />}
            //w={buttonWidth}
            w="100%"
          >
            <Text align="left" overflow="hidden" whiteSpace="nowrap">
              {selectedOptions.includes('All') &&
              options.length === selectedOptions.length
                ? 'All'
                : selectedOptions.length > 0
                ? selectedOptions.join(', ')
                : 'Select Options'}
            </Text>
          </MenuButton>
          <MenuList
            maxH="20rem"
            maxW="100px"
            overflowY="auto"
            whiteSpace="pre-wrap"
            overflowWrap={'normal'}
          >
            {options.map((option) => (
              <MenuItem key={option}>
                <DropDownMenuItem
                  item={option}
                  options={options}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                />
              </MenuItem>
            ))}
            {/*<MenuItem>
            <DropDownMenuItem
              item={options[0]}
              options={options}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          </MenuItem>
          <MenuItem>
            <DropDownMenuItem
              item={options[1]}
              options={options}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          </MenuItem>
          <MenuItem>
            <DropDownMenuItem
              item={options[2]}
              options={options}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          </MenuItem>
          <MenuItem>
            <DropDownMenuItem
              item={options[3]}
              options={options}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          </MenuItem> */}
          </MenuList>
        </Menu>
      </Box>
    </>
  );
}
