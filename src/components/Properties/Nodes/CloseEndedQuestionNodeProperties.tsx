import { Button, Flex, useToast } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';
import ArrayField from '../../Forms/Fields/ArrayField';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CloseEndedQuestionNodeProperties = () => {
  const { getValues, setValue, unregister } = useFormContext();
  const toast = useToast();
  // todo: unregister the parameters not used ->
  //    if aiQuestion==true unregister(data.correctAnswers[]) else unregister(data.language,...)
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
      <Button
        marginBottom={'5px'}
        id="buttonAI"
        hidden={!getValues('data.aiQuestion')}
        onClick={() => {
          setValue('data.aiQuestion', true);
          document
            .getElementById('manualQuestion')
            ?.setAttribute('hidden', 'true');
          document.getElementById('buttonAI')?.setAttribute('hidden', 'true');
          document.getElementById('aiQuestion')?.removeAttribute('hidden');
          document.getElementById('buttonManually')?.removeAttribute('hidden');
        }}
      >
        Form to generate the question with AI
      </Button>
      <Button
        marginBottom={'5px'}
        id="buttonManually"
        hidden={getValues('data.aiQuestion')}
        onClick={() => {
          setValue('data.aiQuestion', false);
          document.getElementById('aiQuestion')?.setAttribute('hidden', 'true');
          document
            .getElementById('buttonManually')
            ?.setAttribute('hidden', 'true');
          document.getElementById('manualQuestion')?.removeAttribute('hidden');
          document.getElementById('buttonAI')?.removeAttribute('hidden');
        }}
      >
        Form to create the question manually
      </Button>
      <div id="manualQuestion" hidden={!getValues('data.aiQuestion')}>
        <MarkDownField label="Question" name="data.question" />
        <ArrayField
          label="Correct Answers"
          name="data.correctAnswers"
          option="Answer"
        />
      </div>
      <div id="aiQuestion" hidden={getValues('data.aiQuestion')}>
        <Flex>
          <EnumField
            label="Language"
            name="data.language"
            width="50%"
            constraints={{ valueAsNumber: false }}
            options={
              <>
                <option value={'English'}>English</option>
                <option value={'Italian'}>Italian</option>
                <option value={'French'}>French</option>
                <option value={'German'}>German</option>
                <option value={'Spanish'}>Spanish</option>
              </>
            }
          />
          <EnumField
            label="Question category"
            name="data.questionCategory"
            width="50%"
            constraints={{ valueAsNumber: false }}
            options={
              <>
                <option value={0}>Factual Knowledge</option>
                <option value={1}>Understanding of Concepts</option>
                <option value={2}>Application of Skills</option>
                <option value={3}>Analysys And Evaluation</option>
              </>
            }
          />
        </Flex>
        <EnumField
          label="Question type"
          name="data.questionType"
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
          name="data.text"
        />
        <Button
          marginBottom={'5px'}
          marginTop={'5px'}
          onClick={async () => {
            try {
              const response: AxiosResponse = await API.generateNewAIQuestion({
                language: 'English',
                text: 'https://www.britannica.com/place/ancient-Egypt',
                type: 0,
                level: 2,
                category: 1,
                temperature: 0,
              });
              console.log(response);
              const questionGenerated = 'generateNewAIQuestion';
              setValue('data.question', response.data.errors);
            } catch (error) {
              if ((error as Error).name === 'SyntaxError') {
                toast({
                  title: 'Invalid syntax',
                  description: (error as Error).toString(),
                  status: 'error',
                  duration: 3000,
                  position: 'bottom-left',
                  isClosable: true,
                });
                return;
              }
              toast({
                title: 'Internal Error',
                description: 'Try later' + (error as Error),
                status: 'error',
                duration: 3000,
                position: 'bottom-left',
                isClosable: true,
              });
            }
          }}
        >
          Generate question
        </Button>
        <MarkDownField
          label="Question generated for the AI Question generation (editable)"
          name="data.question"
        />
      </div>
    </>
  );
};

export default CloseEndedQuestionNodeProperties;
