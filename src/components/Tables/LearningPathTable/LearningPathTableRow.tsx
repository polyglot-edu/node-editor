import { DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';
import { Button, Flex, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Td, Tooltip, Tr } from '@chakra-ui/react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { activityType, lessonType, rowData } from './CustomLearningPathTable';

interface TableLearningPathRowProps {
  indexRow: number;
  row: rowData;
  providedDraggable: DraggableProvided;
  activityTypes: activityType[];
  lessonTypes: lessonType[];
  handleLessonTypeChange: (index: number, selectedTypeIndex: number) => void;
  handleActivityTypeChange: (index: number, selectedTypeIndex: number) => void;
  handleTimeDurationChange: (index: number, value: string) => void;
  handleDeleteRow: (index: number) => void;
  handleEditDescription: (index: number, description: string) => void;
}

export default function LearningPathTableRow({
  indexRow,
  row,
  providedDraggable,
  activityTypes,
  lessonTypes,
  handleLessonTypeChange,
  handleActivityTypeChange,
  handleDeleteRow,
  handleTimeDurationChange,
  handleEditDescription,
}: TableLearningPathRowProps) {

  const onLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex;
    handleLessonTypeChange(indexRow, selectedIndex);
  };

  const onActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex;
    handleActivityTypeChange(indexRow, selectedIndex);
    console.log('selected index', selectedIndex);
  };

  return (
    <Tr ref={providedDraggable.innerRef} {...providedDraggable.draggableProps}>
      {/* Drag item */}
        {
          <Td
            borderWidth="2px"
            borderColor="black"
            px={0}
            {...providedDraggable.dragHandleProps}
            w="fit-content"
          >
            <Flex w="100%" justify="center" px={0}>
              <DragHandleIcon />
            </Flex>
          </Td>
        }
      {/* Number */}
      <Td borderWidth="2px" borderColor="black" w="fit-content" px={2}>
        <Flex w="100%" justify="center" px={0} cursor="default">
          {`${indexRow + 1}.`}
        </Flex>
      </Td>
      {/* Lesson Type */}
      <Td
        borderWidth="2px"
        borderColor="black"
        w="fit-content"
        px={2}
      >
        <Flex w="100%" justify="center" px={0}>
          <Select 
            variant='filled'
            value={row.lessonType}
            onChange={(onLessonChange)}
          >
            {lessonTypes.map((lessonType) => (
              <option key={lessonType.name} value={lessonType.name}>
                {lessonType.name}
              </option>
            ))}

          </Select>
        </Flex>
      </Td>
      {/* Activity Type */}
      <Td
        borderWidth="2px"
        borderColor="black"
        w="fit-content"
        px={2}
      >
        <Flex w="100%" justify="center" px={0}>
          <Select
            variant='filled'
            value={row.activityType}
            onChange={(onActivityChange)}
          >
            
            {activityTypes.map((activityType) => 
              activityType.lessonType === row.lessonType ? (
                <option key={activityType.activityType}>
                  {activityType.activityType}
                </option>
              ) : null
            )}
          </Select>
        </Flex>
      </Td>
      {/* Time */}
      <Td
        borderWidth="2px"
        borderColor="black"
        w="fit-content"
        px={2}
      >
        <Flex w="100%" justify="center" px={0}>
          {
            <NumberInput 
              defaultValue={row.timeDuration}
              minW="75px"
              maxW="100px"
              size="sm"
              onChange={(value) => handleTimeDurationChange(indexRow, value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          }
        </Flex>
      </Td>
      {/* Description */}
      <Td
        borderWidth="2px"
        borderColor="black"
        // w="100%"
        w="fit-content"
        whiteSpace="pre-wrap"
        // flex="1"
        px={2}
      >
        <Flex w="100%" justify="flex-start" px={0}>
          <Input
            defaultValue={row.activityDescription}
            onChange={(e) =>{
              e.preventDefault();
              const value = e.target.value;
              console.log('value', value);
              handleEditDescription(indexRow, value)
            }}
          />
        </Flex>
      </Td>
      {/* Delete */}
      <Td
        borderWidth="2px"
        borderColor="black"
        w="fit-content"
        px={2}
      >
        <Flex w="100%" justify="center" px={0}>
          <Button>
            <Tooltip label="Delete" placement="right">
              <DeleteIcon onClick={() => handleDeleteRow(indexRow)} w={5} h={5} color="red" />
            </Tooltip>
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
}