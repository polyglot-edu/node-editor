import { Flex } from '@chakra-ui/react';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

export type NodePropertiesProps = {};

const NodeProperties = () => {
  return (
    <>
      <TextField
        label="Title"
        name="title"
        constraints={{
          required: 'Title is required',
        }}
      />
      <TextField label="Description" name="description" isTextArea />
      <Flex>
        <EnumField
          label="Difficulty"
          name="difficulty"
          width="50%"
          constraints={{ valueAsNumber: true }}
          options={
            <>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </>
          }
        />
        <EnumField
          label="Platform"
          name="platform"
          width="50%"
          options={
            <>
              <option value={'VSCode'} defaultChecked>
                VSCode
              </option>
              <option value={'WebApp'}>WebApp</option>
            </>
          }
        />
      </Flex>
    </>
  );
};

export default NodeProperties;
