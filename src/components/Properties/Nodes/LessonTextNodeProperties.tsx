import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const LessonTextNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        Insert a text, learners will be able to read the formatted text as in
        the right side.
      </div>
      <br />
      <NodeProperties />
      <MarkDownField label="Text" name="data.text" />
    </>
  );
};

export default LessonTextNodeProperties;
