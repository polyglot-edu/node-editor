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

  const { getValues, setValue, unregister } = useFormContext();
  const toast = useToast();
  // todo: unregister the parameters not used ->
  //    if aiQuestion==true unregister(data.correctAnswers[]) else unregister(data.language,...)
  //<option value={2}>Application of Skills</option> removed till confirmation
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will answer to an Open Question
      </div>
      <br />
      <NodeProperties platform={['WebApp']} />
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
            label="Question category"
            name="data.questionCategory"
            width="50%"
            constraints={{ valueAsNumber: true }}
            options={
              <>
                <option value={0} defaultChecked>
                  Factual Knowledge
                </option>
                <option value={1}>Understanding of Concepts</option>
                <option value={3}>Analysys And Evaluation</option>
              </>
            }
          />
        </Flex>
        <TextField label="Source material" name="data.text" />
        <Button
          marginBottom={'5px'}
          marginTop={'5px'}
          onClick={async () => {
            try {
              setGeneratingLoading(true);
              const text = getValues('data.text');
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

              const response: AxiosResponse = await API.generateNewAIQuestion({
                language: language,
                text: text,
                type: type,
                level: 0,
                category: category,
                temperature: 0,
              });
              const pos1 = response.data.search('Question: ');
              const pos2 = response.data.search('CorrectAnswer: ');
              const question = response.data.substring(pos1 + 10, pos2 - 3);
              const correctAnswers = response.data.substring(pos2 + 15);
              setValue('data.questionGenerated', question);
              setValue('data.possibleAnswer', correctAnswers);
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
