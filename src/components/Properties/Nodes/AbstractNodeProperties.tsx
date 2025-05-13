import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  Collapse,
  Flex,
  IconButton,
  SkeletonText,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Toggle } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useStore from '../../../store';
import { LearningOutcome, Topic } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import NodeProperties from './NodeProperties';

const AbstractNodeProperties = () => {
  const { setValue, getValues } = useFormContext();
  const [toggleFlowData, setToggleFlowData] = useState<boolean>(true);

  const [generatingLoading, setGeneratingLoading] = useState(false);
  const [learningOutcome, setLearningOutcome] = useState<LearningOutcome>(
    getValues('data.learning_outcome') as LearningOutcome
  );
  const [sourceMaterial, setSourceMaterial] = useState(
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
      console.log('reset to flowData');
      if (!flow) return;
      setValue('data.learning_outcome', flow?.learning_outcome);
      setLearningOutcome(flow?.learning_outcome as LearningOutcome);
      setValue('data.sourceMaterial', flow?.sourceMaterial);
      setSourceMaterial(flow?.sourceMaterial);
      setValue('data.macro_subject', flow?.macro_subject);
      setMacroSubject(flow?.macro_subject);
      setValue('data.topicsAI', flow?.topicsAI);
      setTopicsAI(flow.topicsAI || []);
    }
  }, [toggleFlowData]);

  const toggleTopic = (topic: Topic) => {
    setTopicsAI((prev) => {
      const exists = prev.some((t) => t.topic === topic.topic);
      return exists
        ? prev.filter((t) => t.topic !== topic.topic)
        : [...prev, topic];
    });
  };
  useEffect(() => {
      setValue('data.topicsAI',topicsAI);
  }, [topicsAI]);
  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

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
          <Text>
            <Flex fontWeight={'bold'}>Macro Subject: </Flex>
            {macroSubject}
          </Text>
        </SkeletonText>
        <SkeletonText
          paddingTop={'5px'}
          noOfLines={2}
          spacing="8"
          skeletonHeight="10"
          isLoaded={!generatingLoading}
        >
          <Text fontWeight={'bold'}>List of Topics</Text>

          {flow?.topicsAI &&
            flow?.topicsAI.map((topicObj, index) => (
              <Flex key={index} align="start" mb={3} direction="column">
                <Flex align="center">
                  <Checkbox
                    isChecked={topicsAI?.includes(topicObj)}
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
                    {learningOutcome === outcome ? '*' : ''}
                    {outcome}
                    {learningOutcome === outcome ? '*' : ''}
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
