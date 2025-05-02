import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';
import EdgeProperties from './EdgeProperties';

type Topic = {
  Topic: string;
  Type: string;
  Description: string;
};

const FailDebtEdgeProperties = () => {
  const { setValue, getValues } = useFormContext();
  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [topicGen, setTopicGen] = useState<Topic[]>([getValues('data.topic')]);
  console.log(topicGen);
  const [topicIndex, setTopicIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([
    getValues('data.learningObjective'),
  ]);
  const [hide1, setHide1] = useState(!topicGen[0]);
  const [description, setDescription] = useState('');

  return (
    <>
      <EdgeProperties />
      <EnumField
        label="Exercise Type"
        name="data.typeOfExercise"
        options={
          <>
            <option value={0}>OpenQuestionNode</option>
            <option value={3}>Close Ended Question </option>
            <option value={4}>True False Question </option>
            <option value={4}>Multichoice Question</option>
          </>
        }
      />
      <EnumField
        label="Level"
        name="data.level"
        options={
          <>
            <option value={0} defaultChecked>
              Primary School
            </option>
            <option value={1}>Middle School</option>
            <option value={2}>High School</option>
            <option value={3}>College</option>
            <option value={4}>Academy</option>
          </>
        }
      />
      <Box>
        <Text>
          Submit the material you want to use to check the student knowledge.
        </Text>
        <TextField
          label={'Insert your material here...'}
          name="data.material"
        />
        <Button
          marginBottom={'5px'}
          marginTop={'5px'}
          onClick={async () => {
            try {
              if (!generatingLoading) return;
              setGeneratingLoading(true);
              const response: AxiosResponse = await API.analyseMaterial({
                text: getValues('data.material'),
              });
              //da gestire la response è cambiata aaaaaaaaaaaaaaaaaaaaaaaaa
              setValue('data.title', response.data.Title);
              setValue('data.language', response.data.Language);
              setValue('data.macroSubject', response.data.MacroSubject);
              setTopicGen(response.data.MainTopics);
              console.log(response.data.MainTopics);
              setGeneratingLoading(false);
              setHide1(false);
            } catch (error) {
              setGeneratingLoading(false);
              if ((error as Error).name === 'SyntaxError') {
                console.log('Syntax Error');
                return;
              }
              console.log('Internal Error');
            }
          }}
          isLoading={generatingLoading}
        >
          Analyse Material
        </Button>
        <Box hidden={hide1}>
          <FormControl label="Topic" paddingTop={'5px'}>
            <Select
              borderColor={'grey'}
              onChange={(event) => {
                console.log('stuff');
                setTopicIndex(Number(event.currentTarget.value));
                setValue('data.topic', topicGen[topicIndex]);
                setDescription(topicGen[topicIndex].Description);
              }}
            >
              {
                <>
                  {topicGen.map((p, index) => {
                    if (!p) return;
                    return (
                      <option key={index} value={index} defaultChecked>
                        <Box width={'100px'}>Topic: {p.Topic}</Box>
                      </option>
                    );
                  })}
                </>
              }
            </Select>
          </FormControl>
          <FormLabel
            mb={2}
            fontWeight={'bold'}
            paddingTop={'5px'}
            paddingBottom={'-5px'}
          >
            Topic Description:
          </FormLabel>
          <Text>{description}</Text>
          <Button
            marginBottom={'5px'}
            marginTop={'5px'}
            onClick={async () => {
              try {
                if (!topicGen) throw ': No topic generated';
                setGeneratingLoading(true);
                const level: number = getValues('data.level');
                console.log(level);
                /*const response: AxiosResponse = await API.generateLO({
                  Topic: topicGen[topicIndex].Topic,
                  Level: Number(level),
                  Context: '',
                });
                setChoices([
                  response.data.Remembering[0],
                  response.data.Remembering[1],
                  response.data.Understanding[0],
                  response.data.Understanding[1],
                  response.data.Applying[0],
                  response.data.Applying[1],
                  response.data.Analyzing[0],
                  response.data.Analyzing[1],
                  response.data.Evaluating[0],
                  response.data.Evaluating[1],
                ]);*/
                console.log('step2');
                setGeneratingLoading(false);
              } catch (error) {
                setGeneratingLoading(false);
              }
            }}
            isLoading={generatingLoading}
          >
            Submit Topic
          </Button>
        </Box>
        <Box hidden={choices[0] == '' || choices[0] == undefined}>
          <FormControl label="Learning Objective">
            <Select
              borderColor={'grey'}
              onChange={(event) => {
                setValue(
                  'data.learningObjective',
                  choices[Number(event.currentTarget.value)]
                );
                console.log('aaaaaaaaaaaaaaaaaaaaa');
                console.log(getValues('data.learningObjective'));
              }}
            >
              {
                <>
                  {choices.map((p, id) => (
                    <option key={id} value={id}>
                      <p>{p}</p>
                    </option>
                  ))}
                </>
              }
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default FailDebtEdgeProperties;
