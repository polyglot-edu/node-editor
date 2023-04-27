import { SearchIcon } from '@chakra-ui/icons';
import { Button, Flex, Link, SpaceProps, SpacerProps } from '@chakra-ui/react';
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

/* For multi selected tag see https://github.com/anubra266/choc-autocomplete#multi-select-with-tags */

export default function SearchBar({
  inputValue,
  setInputValue,
  placeholder,
  items,
  px, // padding orizonal
  py, //padding vertical
  pb, // padding bottom
}: SearchBarProps) {
  return (
    <Flex align="center" px={px} py={py} pb={pb} gap="10px">
      <AutoComplete
        openOnFocus
        value={inputValue}
        onSelectOption={(e) => {
          setInputValue(e.item.value);
        }}
      >
        <Flex align="center">
          <SearchIcon color="gray.300" mr="3" />
          <AutoCompleteInput
            variant="filled"
            placeholder={placeholder || 'Search...'}
            onChange={(e) => {
              e.preventDefault();
              setInputValue(e.currentTarget.value);
            }}
          />
        </Flex>
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
      <div>
        <Link href="/discover">
          {' '}
          {/* Qui usanndo il tag <a> dovrebbe funzionare, ma facendo il commit mi dava errore su sta <a> e mi diceva di usare <link> */}
          <Button
            aria-label="Search database"
            //ml="1"
            variant="primary"
            //onClick={() => {}}
            _hover={{
              bg: 'primary',
              color: 'white',
            }}
          >
            Search
          </Button>
        </Link>
      </div>
    </Flex>
  );
}
