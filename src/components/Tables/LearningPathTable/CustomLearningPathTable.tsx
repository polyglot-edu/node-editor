import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { forwardRef, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DropResult,
  Droppable,
  DroppableProvided,
} from 'react-beautiful-dnd';

import { useHasHydrated } from '../../../utils/utils';
import LearningPathTableRow from './LearningPathTableRow';

export type TableLearningPathProps = {
  titles: string[]; // title of the columns
  data: rowData[];
  activityTypes: activityType[];
  lessonTypes: lessonType[];
  handleLessonTypeChange: (index: number, selectedTypeIndex: number) => void;
  handleActivityTypeChange: (index: number, selectedTypeIndex: number) => void;
  handleTimeDurationChange: (index: number, value: string) => void;
  handleEditDescription: (index: number, description: string) => void;
  handleDeleteRow: (index: number) => void;
  setTableData: (data: rowData[]) => void;
};

export type lessonType = {
  name: string;
  colorBackground: string;
};

export type activityType = {
  lessonType: string;
  activityType: string;
  icon?: JSX.Element;
};

const CustomLearningPathTable = forwardRef<
HTMLDivElement,
TableLearningPathProps
>((props, ref) => {
const {
  titles,
  data,
  activityTypes,
  lessonTypes,
  handleLessonTypeChange,
  handleActivityTypeChange,
  handleTimeDurationChange,
  handleEditDescription,
  handleDeleteRow,
  setTableData,
} = props;
  const hydrated = useHasHydrated();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTableData(items);
  };

  return (
    <Flex>
      <TableContainer fontSize={'sm'} borderRadius="md" borderStyle="solid">
        <Table borderWidth="1px" borderColor="black">
          <Thead
            bg="primary"
            color="black"
            borderWidth="2px"
            borderColor="black"
          >
            <Tr w="fit-content">
              {titles.map((title: string, index: number) => (
                  <Th
                    key={index}
                    borderWidth="2px"
                    borderColor="black"
                    color="black"
                    textTransform="none"
                    px={0}
                    display="Table-cell"
                    // className={isPrinting && title === 'Action' ? 'hide-on-print' : ''}
                    // maxW={index === 4 ? "30%" : 'auto'}
                    cursor="default"
                  >
                    <Flex justify="center" p={0}>
                      {title}
                    </Flex>
                  </Th>
                ))}
            </Tr>
          </Thead>
          {(
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided: DroppableProvided) => (
                  <Tbody
                    bg="white"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {hydrated &&
                      data.map((row: rowData, indexRow: number) => (
                        <Draggable
                          key={`row-${indexRow}`}
                          draggableId={`draggable-${indexRow}`}
                          index={indexRow}
                        >
                          {(provided: DraggableProvided) =>
                            hydrated && (
                              <LearningPathTableRow
                                lessonTypes={lessonTypes}
                                activityTypes={activityTypes}
                                indexRow={indexRow}
                                row={row}
                                handleLessonTypeChange={handleLessonTypeChange}
                                providedDraggable={provided}
                                handleDeleteRow={handleDeleteRow}
                                handleActivityTypeChange={handleActivityTypeChange}
                                handleTimeDurationChange={handleTimeDurationChange}
                                handleEditDescription={handleEditDescription}
                              />
                            )
                          }
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Tbody>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Table>
      </TableContainer>
    </Flex>
  );
});

CustomLearningPathTable.displayName = 'CustomLearningPathTable';
export default CustomLearningPathTable;

export type rowData = {
  lessonType: string;
  activityType: string;
  timeDuration: number;
  activityDescription: string;
};