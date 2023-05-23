import { Checkbox } from '@chakra-ui/react';

type DropDownMenuItemProps = {
  item: string;
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function DropDownMenuItem({
  item,
  options,
  selectedOptions,
  setSelectedOptions,
}: DropDownMenuItemProps) {
  // to handle when we click on the checkbox
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (item === options[0]) {
      if (e.target.checked) {
        setSelectedOptions(options);
      } else {
        setSelectedOptions([]);
      }
    } else {
      if (e.target.checked) {
        if (
          selectedOptions.length === options.length - 2 &&
          !selectedOptions.includes(options[0]) &&
          !selectedOptions.includes(item)
        ) {
          setSelectedOptions(options);
        } else {
          setSelectedOptions((prev) => [...prev, item]);
        }
      } else {
        setSelectedOptions((prev) =>
          prev.filter((option) => option != item && option != options[0])
        );
      }
    }
  };

  return (
    <>
      <Checkbox
        isChecked={selectedOptions.includes(item)}
        onChange={handleChange}
      >
        {item}
      </Checkbox>
    </>
  );
}
