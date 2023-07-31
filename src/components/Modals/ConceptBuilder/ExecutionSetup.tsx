import {
  Checkbox,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  ConceptMap,
  ConceptNode,
} from '../../../types/polyglotElements/concept/Conceptmap';

export type ExecutionSetupProps = {};

const ExecutionSetup = ({}: ExecutionSetupProps) => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const { getValues, setValue } = useFormContext();

  const conceptmap = useMemo<ConceptMap>(
    () => getValues('data.conceptmap'),
    [getValues]
  );

  useEffect(() => {
    if (!conceptmap) return;
    const checks = [];
    for (let i = 0; i < conceptmap.nodes.length; i++) {
      checks.push(false);
    }
    setCheckedItems(checks);
  }, [conceptmap, conceptmap.nodes.length]);

  useEffect(() => {
    const concepts: ConceptNode[] = [];
    checkedItems.forEach((value, id) => {
      if (id != 0 && value === true) concepts.push(conceptmap.nodes[id]);
    });

    setValue('data.execution.concepts', concepts);
  }, [checkedItems, conceptmap.nodes, setValue]);

  return (
    <FormControl>
      <FormLabel>
        How many exercises you want to execute per sub concept?
      </FormLabel>
      <NumberInput
        defaultValue={1}
        min={1}
        onChange={(_, value) => {
          setValue('data.execution.numOfRes', value);
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormLabel>Select the algorithm to be used:</FormLabel>
      <Select
        placeholder="Select option"
        onChange={(e) =>
          setValue('data.execution.abstractAlgo', e.target.value)
        }
      >
        <option value={'Manual abstract algorithm'}>
          Manual Astract Algorithm
        </option>
      </Select>
      <FormLabel>What type of resources you want to generate?</FormLabel>
      <Select
        placeholder="Select option"
        onChange={(e) => setValue('data.execution.resType', e.target.value)}
      >
        <option value={'multiple choice'}>Multiple Choices Question</option>
      </Select>
      <FormLabel>What Bloom&apos;s taxonomy level you want to reach?</FormLabel>
      <Select
        placeholder="Select option"
        onChange={(e) => {
          setValue('data.execution.bloom_lv', e.target.value);
        }}
      >
        <option value={'remember'}>Remember</option>
        <option value={'understand'}>Understand</option>
        <option value={'apply'}>Apply</option>
        <option value={'analyze'}>Analyze</option>
        <option value={'evaluate'}>Evaluate</option>
        <option value={'create'}>Create</option>
      </Select>
      <FormLabel>Select concepts:</FormLabel>
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) =>
          setCheckedItems((prev) => prev.map(() => e.target.checked))
        }
      >
        {conceptmap.nodes[0].name}
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        {conceptmap.nodes.map((concept, id) => {
          if (id == 0) return null;
          return (
            <Checkbox
              key={id}
              isChecked={checkedItems[id]}
              onChange={(e) => {
                setCheckedItems((prev) => {
                  const updateCheckboxs = [...prev];
                  updateCheckboxs[id] = e.target.checked;

                  return updateCheckboxs;
                });
              }}
            >
              {concept.name}
            </Checkbox>
          );
        })}
      </Stack>
    </FormControl>
  );
};

export default ExecutionSetup;
