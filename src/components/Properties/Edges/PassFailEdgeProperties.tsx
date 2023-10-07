import EnumField from '../../Forms/Fields/EnumField';
import EdgeProperties from './EdgeProperties';

const PassFailEdgeProperties = () => {
  return (
    <>
      <EdgeProperties />
      <EnumField
        label="Condition Kind"
        name="data.conditionKind"
        options={
          <>
            <option value="pass" onSelect={() => {}}>Pass</option>
            <option value="fail">Fail</option>
          </>
        }
      />
    </>
    //idea for color change -> adding a code that on click of "option" change the color of the edge (style={{stroke:'blue'}})
  );
};

export default PassFailEdgeProperties;
