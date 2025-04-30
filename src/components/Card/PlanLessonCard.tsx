import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Image,
  Select,
  SpaceProps,
  Text,
} from '@chakra-ui/react';
import cardImage from '../../public/test_card.png';
import { LearningOutcome, PlanLessonNode } from '../../types/polyglotElements';

type FlowCardProps = {
  planNode: PlanLessonNode;
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  id: number;
  isSelected: boolean;
  setSelectedNode: (id: number) => void;
  updateNodeAt: (id: number, updatedNode: PlanLessonNode) => void;
};

const PlanLessonCard = ({
  planNode,
  px,
  py,
  id,
  setSelectedNode,
  isSelected,
  updateNodeAt,
}: FlowCardProps) => {
  return (
    <Box px={px} py={py}>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow=""
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '200px' }}
          src={cardImage.src}
          alt="Flow card"
        />
        <CardBody>
          <Box key={1} p={3} borderWidth="1px" borderRadius="md">
            <Text fontSize="sm">
              <strong>Topic:</strong> {planNode.topic}
            </Text>
            <Text fontSize="sm">
              <strong>Type:</strong> {planNode.type}
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
            <Text fontSize="sm">
              <strong>Duration:</strong> {planNode.duration} min
            </Text>
          </Box>
        </CardBody>

        <CardFooter>
          {!id && (
            <>
              <Checkbox
                isChecked={isSelected}
                onChange={() => setSelectedNode(id)}
              >
                {isSelected ? 'selected' : 'not selected'}
              </Checkbox>
            </>
          )}
        </CardFooter>
      </Card>
    </Box>
  );
};

export default PlanLessonCard;
