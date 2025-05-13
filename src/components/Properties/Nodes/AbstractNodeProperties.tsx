import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  IconButton,
  SkeletonText,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { Toggle } from '@fluentui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';
import useStore from '../../../store';
import {
  EducationLevel,
  LearningOutcome,
  Topic,
} from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import NodeProperties from './NodeProperties';

const AbstractNodeProperties = () => {
  const { setValue, getValues } = useFormContext();
  const [toggleFlowData, setToggleFlowData] = useState<boolean>();

  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>(
    getValues('data.learning_outcome') as LearningOutcome
  );
  const [sourceMaterial, setSourceMaterial] = useState<string>(
    getValues('data.sourceMaterial')
  );
  const [macroSubject, setMacroSubject] = useState(
    getValues('data.macro_subject')
  );
  const [topicsAI, setTopicsAI] = useState<Topic[]>(getValues('data.topicsAI'));
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [flow] = useStore((state) => [state.getFlow()]);

  useEffect(() => {
    setToggleFlowData(getValues('data.useFlowData'));
  }, []);

  useEffect(() => {
    setValue('data.useFlowData', toggleFlowData);
    if (toggleFlowData) {
      if (!flow) return;
      setValue('data.learning_outcome', flow?.learning_outcome);
      setLearningOutcome(flow?.learning_outcome as LearningOutcome);
      setValue('data.sourceMaterial', flow?.sourceMaterial);
      setSourceMaterial(flow?.sourceMaterial || '');
      setValue('data.macro_subject', flow?.macro_subject);
      setMacroSubject(flow?.macro_subject);
      setValue('data.topicsAI', flow?.topicsAI);
      console.log('testing topicsAI ');
      setTopicsAI(flow.topicsAI || []);
    }
  }, [toggleFlowData]);
  const combinedTopics = useMemo(() => {
    const allTopics = [...topicsAI, ...(flow?.topicsAI || [])];

    // Rimuove duplicati basati su id
    const uniqueTopicsMap = new Map();
    allTopics.forEach((topic) => {
      uniqueTopicsMap.set(topic.topic, topic);
    });

    return Array.from(uniqueTopicsMap.values());
  }, [topicsAI, flow?.topicsAI]);

  const [topicsSelectable, setTopicsSelectable] =
    useState<Topic[]>(combinedTopics);
  const toggleTopic = (topic: Topic) => {
    setTopicsAI((prev) => {
      const exists = prev.some((t) => t.topic === topic.topic);
      return exists
        ? prev.filter((t) => t.topic !== topic.topic)
        : [...prev, topic];
    });
  };

  useEffect(() => {
    setValue('data.topicsAI', topicsAI);
  }, [topicsAI]);

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toast = useToast();
  return (
    <>
      <NodeProperties platform={['Library', 'WebApp']} />
      <Text fontWeight={'bold'} float={'left'} paddingRight={'10px'}>
        Use learning path data
      </Text>
      <Toggle
        checked={toggleFlowData || toggleFlowData == undefined}
        onChange={() => setToggleFlowData(!toggleFlowData)}
      />
      <Box hidden={toggleFlowData}>
        <SkeletonText
          noOfLines={4}
          spacing="4"
          skeletonHeight="2"
          isLoaded={!generatingLoading}
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            fontWeight="bold"
            width="100%"
            mb={2}
          >
            Material to use:{' '}
            <Button
              mb="2"
              float={'right'}
              title={
                sourceMaterial === flow?.sourceMaterial
                  ? 'Your material is the same of the learning path base material.'
                  : 'Click to analyze the new material.'
              }
              isDisabled={sourceMaterial === flow?.sourceMaterial}
              isLoading={generatingLoading}
              onClick={async () => {
                try {
                  setGeneratingLoading(true);
                  if (!sourceMaterial) {
                    toast({
                      title: 'Material missing',
                      description:
                        'Please, insert your material before pressing analye button.',
                      status: 'error',
                      duration: 3000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                    return;
                  }
                  if (sourceMaterial === flow?.sourceMaterial) {
                    toast({
                      title: 'Material duplicate',
                      description:
                        'You cannot analyze the same material of the Learning path. Please, modify your material, then try again.',
                      status: 'error',
                      duration: 3000,
                      position: 'bottom-left',
                      isClosable: true,
                    });
                    return;
                  }
                  const response: AxiosResponse = await API.analyseMaterial({
                    text: sourceMaterial,
                  });
                  setLearningOutcome(
                    response.data.learning_outcome as LearningOutcome
                  );
                  setTopicsSelectable(response.data.topics);
                  setMacroSubject(response.data.macro_subject);
                  setValue('data.macro_subject', response.data.macro_subject);
                  setValue('data.language', response.data.language);
                  setValue(
                    'data.learning_outcome',
                    response.data.learning_outcome as LearningOutcome
                  );
                  setValue(
                    'data.education_level',
                    response.data.education_level as EducationLevel
                  );
                } catch (error: any) {
                  console.log(error);
                  toast({
                    title: 'Generic Error',
                    description: 'Try later ' + (error as Error),
                    status: 'error',
                    duration: 5000,
                    position: 'bottom-left',
                    isClosable: true,
                  });
                } finally {
                  setGeneratingLoading(false);
                }
              }}
            >
              Analyze material
            </Button>
          </Flex>

          <Textarea
            minHeight={'150px'}
            maxHeight={'350px'}
            placeholder="Insert your material here, you can put your plain text."
            value={sourceMaterial}
            overflowY={'auto'}
            onChange={(e) => {
              setSourceMaterial(e.currentTarget.value);
            }}
            onBlur={() => setValue('data.sourceMaterial', sourceMaterial)}
          />
          <Flex alignItems="center" mt={'2'}>
            <Text fontWeight={'bold'} mr={2}>
              Macro Subject:{' '}
            </Text>
            <Text fontWeight="normal">{macroSubject}</Text>
          </Flex>
        </SkeletonText>
        <SkeletonText
          paddingTop={'5px'}
          noOfLines={2}
          spacing="8"
          skeletonHeight="10"
          isLoaded={!generatingLoading}
        >
          <Text fontWeight={'bold'}>List of Topics</Text>

          {topicsSelectable.map((topicObj, index) => (
            <Flex key={index} align="start" mb={3} direction="column">
              <Flex align="center">
                <Checkbox
                  isChecked={topicsAI?.some((t) => t.topic === topicObj.topic)}
                  onChange={() => toggleTopic(topicObj)}
                  size="lg"
                  mr={2}
                  colorScheme="green"
                />
                <Text>{topicObj.topic}</Text>
                <IconButton
                  size="sm"
                  ml={2}
                  aria-label="Toggle explanation"
                  icon={
                    expandedIndexes.includes(index) ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )
                  }
                  onClick={() => toggleExpand(index)}
                  variant="ghost"
                />
              </Flex>
              <Collapse in={expandedIndexes.includes(index)} animateOpacity>
                <Box mt={2} ml={6}>
                  <Text fontSize="sm" color="gray.600">
                    {topicObj.explanation}
                  </Text>
                </Box>
              </Collapse>
            </Flex>
          ))}
        </SkeletonText>
        <SkeletonText
          paddingTop={'5px'}
          noOfLines={2}
          spacing="8"
          skeletonHeight="10"
          isLoaded={!generatingLoading}
        >
          <Text fontWeight={'bold'}>List of Learning Outcomes</Text>

          <EnumField
            label="learning outcomes"
            name="data.learning_outcome"
            width="50%"
            constraints={{ valueAsNumber: false }}
            defaultValue={learningOutcome}
            options={
              <>
                {Object.values(LearningOutcome).map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {flow?.learning_outcome === outcome ? '*' : ''}
                    {outcome}
                    {flow?.learning_outcome === outcome ? '*' : ''}
                  </option>
                ))}
              </>
            }
          />
        </SkeletonText>
      </Box>
    </>
  );
};

export default AbstractNodeProperties;
