import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Card,
  CardBody,
  Checkbox,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SpaceProps,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  LearningOutcome,
  PlanLessonNode,
  QuestionTypeMap,
} from '../../types/polyglotElements';

type FlowCardProps = {
  planNode: PlanLessonNode;
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  id: number;
  isSelected: boolean;
  suggestedType: string;
  setSelectedNode: (id: number) => void;
  updateNodeAt: (id: number, updatedNode: PlanLessonNode) => void;
};

type SpecificData = {
  solutions_number: number;
  distractors_number: number;
  easily_discardable_distractors_number: number;
};

const PlanLessonCard = ({
  planNode,
  px,
  py,
  id,
  setSelectedNode,
  isSelected,
  updateNodeAt,
  suggestedType,
}: FlowCardProps) => {
  const [specificData, setSpecificData] = useState<SpecificData>({
    solutions_number: 1,
    distractors_number: 1,
    easily_discardable_distractors_number: 1,
  });
  const planNodeSuggestedType = planNode.type;

  useEffect(() => {
    updateNodeAt(id, {
      type: planNode.type,
      topic: planNode.topic,
      details: planNode.details,
      learning_outcome: planNode.learning_outcome,
      duration: planNode.duration,
      data: specificData,
    });
  }, [specificData]);

  return (
    <Box px={px} py={py} paddingTop={'10px'}>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow=""
        variant="outline"
      >
        <CardBody>
          <Flex>
            <Box>
              <Text fontSize="sm">
                <strong>Topic:</strong> {planNode.topic}
              </Text>
              <Text fontSize="sm">
                <strong>Suggested Type:</strong> {suggestedType}
              </Text>
              <Text fontSize="sm">
                <strong>Details:</strong> {planNode.details}
              </Text>
              <Select
                borderColor={'grey'}
                onChange={(event) =>
                  updateNodeAt(id, {
                    type: planNode.type,
                    topic: planNode.topic,
                    details: planNode.details,
                    learning_outcome: event.currentTarget
                      .value as LearningOutcome,
                    duration: planNode.duration,
                    data: planNode.data,
                  })
                }
              >
                {Object.values(LearningOutcome).map((outcome) => (
                  <option
                    key={outcome}
                    value={outcome}
                    selected={planNode?.learning_outcome === outcome}
                  >
                    {planNode?.learning_outcome === outcome ? '*' : ''}
                    {outcome}
                    {planNode?.learning_outcome === outcome ? '*' : ''}
                  </option>
                ))}
              </Select>
              <Select
                borderColor={'grey'}
                onChange={(event) =>
                  updateNodeAt(id, {
                    type: event.currentTarget.value,
                    topic: planNode.topic,
                    details: planNode.details,
                    learning_outcome: planNode.learning_outcome,
                    duration: planNode.duration,
                    data: planNode.data,
                  })
                }
              >
                {QuestionTypeMap.map((qType) => {
                  if (qType.integrated)
                    return (
                      <option
                        key={qType.key}
                        value={qType.key}
                        selected={planNode?.type === qType.key}
                      >
                        {qType.key === planNodeSuggestedType ? '*' : ''}
                        {qType.key}
                        {qType.key === planNodeSuggestedType ? '*' : ''}
                      </option>
                    );
                })}
              </Select>
              {/*
            <Text fontSize="sm">
              <strong>Duration:</strong> {planNode.duration} min
            </Text>*/}
              <Flex
                paddingTop={'5px'}
                alignItems={'center'}
                hidden={
                  planNode.type != 'true or false' &&
                  planNode.type != 'multiple choice'
                }
              >
                <Text textStyle="sm">
                  N° Correct
                  {planNode.type == 'multiple choice'
                    ? ' answers'
                    : ' statements'}
                  :
                </Text>
                <NumberInput
                  float={'right'}
                  defaultValue={specificData.solutions_number}
                  min={1}
                  width={'80px'}
                  title="soon: multiple correct answer"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      onClick={() =>
                        setSpecificData({
                          solutions_number: specificData.solutions_number + 1,
                          distractors_number: specificData.distractors_number,
                          easily_discardable_distractors_number:
                            specificData.easily_discardable_distractors_number,
                        })
                      }
                    />
                    <NumberDecrementStepper
                      onClick={() =>
                        setSpecificData({
                          solutions_number: specificData.solutions_number - 1,
                          distractors_number: specificData.distractors_number,
                          easily_discardable_distractors_number:
                            specificData.easily_discardable_distractors_number,
                        })
                      }
                    />
                  </NumberInputStepper>
                </NumberInput>
                <Text textStyle="sm">
                  N° Wrong
                  {planNode.type == 'multiple choice'
                    ? ' answers'
                    : ' statements'}
                  :
                </Text>
                <NumberInput
                  defaultValue={specificData.solutions_number}
                  min={0}
                  max={6}
                  width={'80px'}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      onClick={() =>
                        setSpecificData({
                          solutions_number: specificData.solutions_number,
                          distractors_number:
                            specificData.distractors_number + 1,
                          easily_discardable_distractors_number:
                            specificData.easily_discardable_distractors_number,
                        })
                      }
                    />
                    <NumberDecrementStepper
                      onClick={() =>
                        setSpecificData({
                          solutions_number: specificData.solutions_number,
                          distractors_number:
                            specificData.distractors_number - 1,
                          easily_discardable_distractors_number:
                            specificData.easily_discardable_distractors_number,
                        })
                      }
                    />
                  </NumberInputStepper>
                </NumberInput>
                <Text textStyle="sm">
                  Easy wrong
                  {planNode.type == 'multiple choice'
                    ? ' answers'
                    : ' statements'}
                  :
                </Text>
                <NumberInput
                  defaultValue={
                    specificData.easily_discardable_distractors_number
                  }
                  min={0}
                  max={6}
                  width={'80px'}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      onClick={() =>
                        setSpecificData({
                          solutions_number: specificData.solutions_number,
                          distractors_number: specificData.distractors_number,
                          easily_discardable_distractors_number:
                            specificData.easily_discardable_distractors_number +
                            1,
                        })
                      }
                    />
                    <NumberDecrementStepper
                      onClick={() =>
                        setSpecificData({
                          solutions_number: specificData.solutions_number,
                          distractors_number: specificData.distractors_number,
                          easily_discardable_distractors_number:
                            specificData.easily_discardable_distractors_number -
                            1,
                        })
                      }
                    />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </Box>
            <Checkbox
              isChecked={isSelected}
              onChange={() => setSelectedNode(id)}
              icon={isSelected ? <CheckIcon /> : <CloseIcon />}
              colorScheme="green"
              size="lg"
            />
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default PlanLessonCard;
