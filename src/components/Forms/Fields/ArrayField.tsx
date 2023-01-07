import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';
import {
  RegisterOptions,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

const ArrayField = ({
  label,
  name,
  constraints,
}: {
  label: string;
  name: string;
  constraints?: RegisterOptions;
}) => {
  const [input, setInput] = useState('');
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: name, // unique name for your Field Array
  });

  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {fields.map((field, index) => (
        <Flex key={field.id}>
          <Input {...register(`${name}.${index}`, constraints)} />
          <Button
            colorScheme={'red'}
            onClick={() => {
              remove(index);
            }}
          >
            <CloseIcon boxSize="0.75em" />
          </Button>
        </Flex>
      ))}
      <Flex>
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button
          colorScheme={'green'}
          onClick={() => {
            append(input);
            setInput('');
          }}
        >
          <AddIcon boxSize="0.75em" />
        </Button>
      </Flex>
    </FormControl>
  );
};

export default ArrayField;
