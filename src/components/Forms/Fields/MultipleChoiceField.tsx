import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  Controller,
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
  const [checked, setChecked] = useState(false);
  const { register, setValue, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: name, // unique name for your Field Array
  });

  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {fields.map((field, index) => (
        <Flex key={field.id}>
          <Controller
            name={`data.isChoiceCorrect.${index}`}
            render={({ field }) => (
              <Checkbox size="lg" mr={2} {...field} isChecked={field.value} />
            )}
          />
          <Input {...register(`${name}.${index}`, constraints)} />
          <Button
            colorScheme={'red'}
            onClick={() => {
              const c = [...getValues('data.isChoiceCorrect')];
              c.splice(index, 1);
              setValue(`data.isChoiceCorrect`, c);
              remove(index);
            }}
          >
            <CloseIcon boxSize="0.75em" />
          </Button>
        </Flex>
      ))}
      <Flex>
        <Checkbox
          size="lg"
          mr={2}
          isChecked={checked}
          onChange={(e) => setChecked(e.currentTarget.checked)}
        />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Insert new choice.."
        />
        <Button
          colorScheme={'green'}
          onClick={() => {
            // appendIsChoices(checked ? 'true' : 'false');
            setValue(`data.isChoiceCorrect.${fields.length}`, checked);
            append(input);
            setInput('');
            setChecked(false);
          }}
        >
          <AddIcon boxSize="0.75em" />
        </Button>
      </Flex>
    </FormControl>
  );
};

export default ArrayField;
