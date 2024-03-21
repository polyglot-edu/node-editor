import { Button, Flex, useToast } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import NumberField from '../../Forms/Fields/NumberField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const MultipleChoiceQuestionNodeProperties = () => {
  const [generatingLoading, setGeneratingLoading] = useState(false);

  const { getValues, setValue, unregister } = useFormContext();
  const toast = useToast();
  // todo: unregister the paramete
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        In this activity learners will have to select the correct answer from
        multiple options provided
      </div>
      <br />
      <NodeProperties platform={['WebApp', 'VSCode']} />
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
              </>
            }
          />
        </Flex>
        <Flex>
          <NumberField
            defaultValue={1}
            min={1}
            max={5}
            label={'N° Correct Answers:'}
            name="data.n_o_ca"
          />
          <NumberField
            defaultValue={1}
            min={1}
            max={5}
            label={'n_o_d'}
            name="data.n_o_d"
          />
          <NumberField
            label={'nedd'}
            name={'data.nedd'}
            defaultValue={1}
            min={1}
            max={5}
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
              const n_o_ca = getValues('data.n_o_ca');
              const n_o_d = getValues('data.n_o_d');
              const nedd = getValues('data.nedd');
              const category = getValues('data.questionCategory');
              if (!text) {
                setValue('data.question', 'No text given');
                //
                throw ': no text given';
              }
              //block for testing purpose
              const description = getValues('description');
              console.log(description);
              if (description != 'enable') throw ': Not enabled';

              const response: AxiosResponse =
                await API.generateNewAIMultiChoice({
                  language: language,
                  text: text,
                  type: true,
                  level: 0,
                  category: category,
                  temperature: 0,
                  n_o_ca: n_o_ca,
                  nedd: nedd,
                  n_o_d: n_o_d,
                });
              const pos1 = response.data.search('Question: ');
              const pos2 = response.data.search('CorrectAnswerIndex: ');
              const pos3 = response.data.search('Answers: ');
              const pos4 = response.data.search('Solution: ');
              const question = response.data.substring(pos1 + 10, pos2 - 1);
              const CorrectAnswerIndex = response.data.substring(
                pos2 + 20,
                pos3 - 2
              );
              const answers = response.data.substring(pos3 + 9, pos4 - 2);
              const solution = response.data.substring(pos4 + 10);
              setValue('data.question', question);
              //missing to set the correct index true and the others false (setValue('data.', CorrectAnswerIndex);)
              //idea: create an array false and set true the corresponding index, set('data.isChoiceCorrect', array);
              //missing to set the array of answers (setValue('data.choices', answers);)
              //need to create the array first (se filippo mette json è automatico)
              setValue('data.solution', solution);
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
      </div>
      <TextField label="Question" name="data.question" isTextArea />
      <MultipleChoiceField
        label="Choices"
        name="data.choices"
        option="Risposta"
      />
    </>
  );
};

export default MultipleChoiceQuestionNodeProperties;
