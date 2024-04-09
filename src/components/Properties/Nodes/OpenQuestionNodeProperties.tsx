import { Button, Flex, useToast } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';
import ArrayField from '../../Forms/Fields/ArrayField';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const OpenQuestionNodeProperties = () => {
  const [generatingLoading, setGeneratingLoading] = useState(false);

  const { getValues, setValue } = useFormContext();
  const toast = useToast();
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="In this activity learners will answer to an Open Question"
      />
      <Button
        marginBottom={'5px'}
        id="buttonAI"
        hidden={getValues('data.aiQuestion')}
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
        Create with AI
      </Button>
      <Button
        marginBottom={'5px'}
        id="buttonManually"
        hidden={!getValues('data.aiQuestion')}
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
        Create manually
      </Button>
      <div id="manualQuestion" hidden={getValues('data.aiQuestion')}>
        <MarkDownField label="Question" name="data.question" />
        <ArrayField
          label="Correct Answers/validation material"
          name="data.correctAnswers"
          option="Answer"
        />
      </div>
      <div id="aiQuestion" hidden={!getValues('data.aiQuestion')}>
        <Flex>
          <EnumField
            label="Language"
            name="data.language"
            width="50%"
            constraints={{ valueAsNumber: false }}
            options={
              <>
                <option value={'English'} defaultChecked>
                  English
                </option>
                <option value={'Italian'}>Italian</option>
                <option value={'French'}>French</option>
                <option value={'German'}>German</option>
                <option value={'Spanish'}>Spanish</option>
              </>
            }
          />
          <EnumField
            label="Level"
            name="data.level"
            width="50%"
            constraints={{ valueAsNumber: true }}
            options={
              <>
                <option value={0} defaultChecked>
                  primary school
                </option>
                <option value={1}>middle school</option>
                <option value={2}>high school</option>
                <option value={3}>college</option>
                <option value={4}>academy</option>
              </>
            }
          />
        </Flex>
        <EnumField
          label="Question category"
          name="data.questionCategory"
          width="50%"
          constraints={{ valueAsNumber: true }}
          options={
            <>
              <option value={0} defaultChecked>
                theoretical
              </option>
              <option value={2}>problem resolution</option>
            </>
          }
        />
        <TextField label="Source material" name="data.text" isTextArea />
        <Button
          marginBottom={'5px'}
          marginTop={'5px'}
          onClick={async () => {
            try {
              setGeneratingLoading(true);
              const text = getValues('data.text');
              const title = getValues('data.title');
              const level = getValues('data.level');
              const language = getValues('data.language');
              const type = getValues('data.questionType');
              const category = getValues('data.questionCategory');
              if (!text) {
                setValue('data.questionGenerated', 'No text given');
                //
                throw ': No text given';
              }
              //block for testing purpose
              const description = getValues('description');
              console.log(description);
              if (description != 'enable') throw ': Not enabled';

              const response: AxiosResponse = await API.generateNewExercise({
                macroSubject: '',
                title: title,
                level: level,
                typeOfExercise: 1, //=question
                learningObjective: '', //ask the usage
                bloomLevel: 0, //=remember
                language: language,
                material: text,
                assignmentType: category, //0=theoretical, 1=code, 2=problem_resolution,
                topic: '',
                temperature: 0.2,
              });
              setValue('data.questionGenerated', response.data.question);
              setValue('data.possibleAnswer', response.data.solution);
              setGeneratingLoading(false);
            } catch (error) {
              setGeneratingLoading(false);
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
          isLoading={generatingLoading}
        >
          Generate question
        </Button>
        <MarkDownField
          label="Generated question (editable)"
          name="data.questionGenerated"
        />
      </div>
    </>
  );
};

export default OpenQuestionNodeProperties;
