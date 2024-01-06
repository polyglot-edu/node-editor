import { Checkbox, Flex } from '@chakra-ui/react';
import ArrayField from '../../Forms/Fields/ArrayField';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CloseEndedQuestionNodeProperties = () => {
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to complete a sentence with the
        appropriate word or phrase
      </div>
      <br />
      <NodeProperties />
      <Checkbox
        marginBottom={'5px'}
        id="checkbox"
        name="data.aiQuestion"
        onChange={() => {
          if (
            document.getElementById('aiQuestion')?.getAttribute('hidden') ===
            'true'
          ) {
            document
              .getElementById('manualQuestion')
              ?.setAttribute('hidden', 'true');
            document.getElementById('aiQuestion')?.removeAttribute('hidden');
          } else {
            document
              .getElementById('aiQuestion')
              ?.setAttribute('hidden', 'true');
            document
              .getElementById('manualQuestion')
              ?.removeAttribute('hidden');
          }
        }}
      >
        Select to generate the question with AI
      </Checkbox>
      <div id="manualQuestion">
        <MarkDownField label="Question" name="data.question" />
        <ArrayField
          label="Correct Answers"
          name="data.correctAnswers"
          option="Answer"
        />
      </div>
      <div id="aiQuestion" hidden>
        <Flex>
          <EnumField
            label="Language"
            name="language"
            width="50%"
            constraints={{ valueAsNumber: true }}
            options={
              <>
                <option value={1}>English</option>
                <option value={2}>Italian</option>
                <option value={3}>French</option>
                <option value={4}>German</option>
                <option value={5}>Spanish</option>
              </>
            }
          />
          <EnumField
            label="Question category"
            name="questionCategory"
            width="50%"
            constraints={{ valueAsNumber: true }}
            options={
              <>
                <option value={1}>Factual Knowledge</option>
                <option value={2}>Understanding of Concepts</option>
                <option value={3}>Application of Skills </option>
                <option value={4}>Analysys And Evaluation</option>
              </>
            }
          />
        </Flex>
        <EnumField
          label="Question type"
          name="questionType"
          constraints={{ valueAsNumber: true }}
          options={
            <>
              <option value={1}>Open</option>
              <option value={2}>Short Answer</option>
              <option value={3}>TrueFalse</option>
            </>
          }
        />
        <MarkDownField
          label="Material for the AI Question generation"
          name="data.question"
        />
      </div>
    </>
  );
};

export default CloseEndedQuestionNodeProperties;
