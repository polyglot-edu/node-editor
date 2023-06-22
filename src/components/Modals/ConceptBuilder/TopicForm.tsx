import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

export type TopicFormProps = {
  concept: string;
  graphDepth: number;
  setConcept: Dispatch<SetStateAction<string>>;
  setGraphDepth: Dispatch<SetStateAction<number>>;
};

const TopicForm = (props: TopicFormProps) => {
  return (
    <FormControl>
      <FormLabel>What is the topic of the concept?</FormLabel>
      <Input
        placeholder="Insert the topic..."
        mb={2}
        value={props.concept}
        onChange={(value) => {
          props.setConcept(value.target.value);
        }}
      />
      <FormLabel>Insert Concept Map&apos;s depth:</FormLabel>
      <Select
        placeholder="Select option"
        value={props.graphDepth}
        onChange={(e) => {
          const value = +e.currentTarget.value;
          if (!value) return;
          props.setGraphDepth(value);
        }}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
      </Select>
    </FormControl>
  );
};

export default TopicForm;
