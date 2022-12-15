import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { RegisterOptions, useFieldArray, useForm } from 'react-hook-form';

const MultipleChoiceField = <T extends string>({
  name,
  refreshFactor,
  array,
  checkArray,
  onChangeCheck,
  constraints,
}: {
  name: string;
  refreshFactor: any;
  array: T[];
  checkArray: boolean[];
  onChangeCheck: (e: any) => void;
  constraints: RegisterOptions;
}) => {
  const [input, setInput] = useState('');
  const [check, setCheck] = useState(false);
  const { control, register, reset } = useForm();
  const { fields, append, prepend, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: name, // unique name for your Field Array
  });

  useEffect(() => {
    const resObj: any = {};
    resObj[name] = [];
    reset(resObj);
    if (array && array.length > 0) {
      prepend(
        array?.map((val) => {
          return {
            name: '',
            value: val,
          };
        })
      );
    }
  }, [refreshFactor]);

  return (
    <>
      {fields.map((field, index) => (
        <Flex key={field.id}>
          <Checkbox
            size="lg"
            mr={2}
            isChecked={checkArray[index]}
            name={`check.${index}.value`}
            onChange={(e) => {
              onChangeCheck({
                currentTarget: {
                  name: `check.${index}.value`,
                  value: e.currentTarget.checked,
                },
              });
            }}
          />
          <Input {...register(`${name}.${index}.value`, constraints)} />
          <Button
            name={`${name}.${index}.remove`}
            bg="red.300"
            _hover={{ bg: 'red.400' }}
            onClick={(e) => {
              remove(index);
              constraints.onChange?.(e);
              onChangeCheck({
                currentTarget: {
                  name: `check.${index}.remove`,
                  value: check,
                },
              });
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
          isChecked={check}
          onChange={(e) => setCheck(e.currentTarget.checked)}
        />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <Button
          name={`${name}.0.add`}
          value={input}
          bg="green.300"
          _hover={{ bg: 'green.400' }}
          onClick={(e) => {
            append({ name: '', value: input });
            console.log(e.currentTarget);
            constraints.onChange?.(e);
            onChangeCheck({
              currentTarget: {
                name: `check.0.add`,
                value: check,
              },
            });
            setInput('');
            setCheck(false);
          }}
        >
          <AddIcon boxSize="0.75em" />
        </Button>
      </Flex>
    </>
  );
};

export default MultipleChoiceField;
