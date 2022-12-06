import { SearchIcon } from '@chakra-ui/icons';
import { Flex, IconButton, SpaceProps, SpacerProps } from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { Dispatch, SetStateAction } from 'react';

type SearchItems = string[];

type SearchBarProps = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  items: SearchItems;
  px?: SpaceProps['px'];
  py?: SpaceProps['py'];
  pb?: SpacerProps['pb'];
};

export default function SearchBar({
  inputValue,
  setInputValue,
  placeholder,
  items,
  px,
  py,
  pb,
}: SearchBarProps) {
  return (
    <Flex align="center" px={px} py={py} pb={pb}>
      <AutoComplete
        openOnFocus
        value={inputValue}
        onSelectOption={(e) => {
          setInputValue(e.item.value);
        }}
      >
        <AutoCompleteInput
          variant="filled"
          placeholder={placeholder || 'Search...'}
          onChange={(e) => {
            e.preventDefault();
            setInputValue(e.currentTarget.value);
          }}
        />
        <AutoCompleteList>
          {items.map((item, id) => (
            <AutoCompleteItem
              key={`option-${id}`}
              value={item}
              textTransform="capitalize"
            >
              {item}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
      <IconButton
        aria-label="Search database"
        icon={<SearchIcon />}
        ml="1"
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    </Flex>
  );
}
