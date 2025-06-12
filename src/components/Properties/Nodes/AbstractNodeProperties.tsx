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
import { useFormContext, useWatch } from 'react-hook-form';
import { API } from '../../../data/api';
import useStore from '../../../store';
import { LearningOutcome, Topic } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import InfoButton from '../../InfoButton/InfoButton';
import NodeProperties from './NodeProperties';

const AbstractNodeProperties = () => {
  const { setValue, getValues } = useFormContext();
  const toast = useToast();

  const toggleFlowData = useWatch({ name: 'data.useFlowData' });
  const sourceMaterial = useWatch({ name: 'data.sourceMaterial' });
  const macroSubject = useWatch({ name: 'data.macro_subject' });
  const topicsAI = useWatch({ name: 'data.topicsAI' });
  const learningOutcome = useWatch({ name: 'data.learning_outcome' });

  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [flow] = useStore((state) => [state.getFlow()]);

  const combinedTopics = useMemo(() => {
    const allTopics = [...(topicsAI || []), ...(flow?.topicsAI || [])];

    const uniqueTopicsMap = new Map();
    allTopics.forEach((topic) => {
      uniqueTopicsMap.set(topic.topic, topic);
    });

    return Array.from(uniqueTopicsMap.values());
  }, [topicsAI, flow?.topicsAI]);

  const [topicsSelectable, setTopicsSelectable] =
    useState<Topic[]>(combinedTopics);

  useEffect(() => {
    setTopicsSelectable(combinedTopics);
  }, [combinedTopics]);

  const toggleTopic = (topic: Topic) => {
    const currentTopics = getValues('data.topicsAI') as Topic[];
    const exists = currentTopics.some((t) => t.topic === topic.topic);
    const updatedTopics = exists
      ? currentTopics.filter((t) => t.topic !== topic.topic)
      : [...currentTopics, topic];
    setValue('data.topicsAI', updatedTopics);
  };

  const handleAnalyzeMaterial = async () => {
    try {
      setGeneratingLoading(true);
      if (!sourceMaterial) {
        toast({
          title: 'Material missing',
          description:
            'Please, insert your material before pressing analyze button.',
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
            'You cannot analyze the same material of the Learning path.',
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
      setValue(
        'data.learning_outcome',
        response.data.learning_outcome as LearningOutcome
      );
      setValue('data.macro_subject', response.data.macro_subject);
      setValue('data.language', response.data.language);
      setValue('data.title', response.data.title);
      setValue('data.education_level', response.data.education_level);
      const genTopics = response.data.topics;
      const allTopics = [...(genTopics || []), ...(flow?.topicsAI || [])];

      const uniqueTopicsMap = new Map();
      allTopics.forEach((topic) => {
        uniqueTopicsMap.set(topic.topic, topic);
      });
      setTopicsSelectable(Array.from(uniqueTopicsMap.values()));
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
  };

  useEffect(() => {
    if (toggleFlowData && flow) {
      setValue('data.learning_outcome', flow?.learning_outcome);
      setValue('data.sourceMaterial', flow?.sourceMaterial);
      setValue('data.macro_subject', flow?.macro_subject);
      setValue('data.topicsAI', flow?.topicsAI);
    }
  }, [toggleFlowData]);

  return (
    <>
      <NodeProperties platform={['Library', 'WebApp']} />
      <Text fontWeight={'bold'} float={'left'} paddingRight={'10px'}>
        Use learning path data
      </Text>
      <Toggle
        checked={toggleFlowData ?? true}
        onChange={() => setValue('data.useFlowData', !toggleFlowData)}
      />
      <Box hidden={toggleFlowData}>
        <SkeletonText
          noOfLines={4}
          spacing="4"
          skeletonHeight="2"
          isLoaded={!generatingLoading}
        >
          {/* Material Section */}
          <Flex
            justifyContent="space-between"
            alignItems="center"
            fontWeight="bold"
            width="100%"
            mb={2}
          >
            Material to use:{' '}
            <InfoButton
              title="Material to Analyze"
              description="Provide the source content you want the learning path to be built upon. This could be a text, article, lesson plan, or any other educational material."
              placement="right"
            />
            <Button
              mb="2"
              float={'right'}
              title={
                sourceMaterial === flow?.sourceMaterial
                  ? 'Your material is the same as the learning path base material.'
                  : 'Click to analyze the new material.'
              }
              isDisabled={sourceMaterial === flow?.sourceMaterial}
              isLoading={generatingLoading}
              onClick={handleAnalyzeMaterial}
            >
              Analyze material
            </Button>
          </Flex>
          <Textarea
            minHeight="150px"
            maxHeight="350px"
            placeholder="Insert your material here"
            value={sourceMaterial}
            onChange={(e) => setValue('data.sourceMaterial', e.target.value)}
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
                  isChecked={topicsAI?.some(
                    (t: { topic: string }) => t.topic === topicObj.topic
                  )}
                  onChange={() => toggleTopic(topicObj)}
                  size="lg"
                  mr={2}
                  colorScheme="green"
                />
                <Text>
                  {topicObj.topic}{' '}
                  {flow?.topicsAI.includes(topicObj)
                    ? '(from Learning Path)'
                    : ''}
                </Text>
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
                  onClick={() => {
                    setExpandedIndexes((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    );
                  }}
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
          <Text fontWeight={'bold'}>
            List of Learning Outcomes
            <InfoButton
              title="Learning Outcome"
              description="Describe the intended educational goal of the learning path. For example: 'the ability to recall or recognize simple facts and definitions.'"
              placement="right"
            />
          </Text>
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
