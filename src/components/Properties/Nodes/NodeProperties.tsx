import { Flex } from '@chakra-ui/react';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

export type NodePropertiesProps = {
  platform: string[];
};

const NodeProperties = ({ platform }: NodePropertiesProps) => {
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
          hidden={true}
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
            //bug da fixare: quando apro un nuovo nodo (con un platform option diverso) non viene la piattaforma di defualt
            //ma cerca di mettere il valore di defualt che trovava prima

            //manca gestione altri campi oltre al primo dell'array =>
            //  ()=>{ const x:JSX.Element=[];
            //  platform.forEach(
            //    (p)=>x.push(<option value={platform[0]}>
            //    {platform[0]}
            //    </option>))}
            // da errore options-> cant have ()=>JSX.Element need Element
            <>
              <option value={platform[0]} defaultChecked>
                {platform[0]}
              </option>
            </>
          }
        />
      </Flex>
    </>
  );
};

export default NodeProperties;
