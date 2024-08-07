import { Button, Flex } from '@chakra-ui/react';
import produce from 'immer';
import { forwardRef, useEffect, useState } from 'react';
import { useHasHydrated } from '../../../utils/utils';
import { Activity } from '../../Modals/CreateCourseModal';
import CustomLearningPathTable, { rowData } from './CustomLearningPathTable';

const titleColumns = [
  ' ',
  'Nb',
  'Type',
  'Activity',
  'Time',
  'Description',
  'Action',
];

const activityTypes = [
  {
    lessonType: 'Assessment',
    activityType: 'Open Question',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Short Answer Question',
  },
  {
    lessonType: 'Assessment',
    activityType: 'True or False',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Fill in the Blanks',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Single Choice',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Multiple Choice',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Essay',
  },
  {
    lessonType: 'Learning',
    activityType: 'Knowledge Exposition',
  },
  {
    lessonType: 'Learning',
    activityType: 'Debate',
  },
  {
    lessonType: 'Learning',
    activityType: 'Brainstorming',
  },
  {
    lessonType: 'Learning',
    activityType: 'Group Discussion',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Simulation',
  },
  {
    lessonType: 'Learning',
    activityType: 'Inquiry-based Learning',
  },
  {
    lessonType: 'Other',
    activityType: 'Non-written Material Analysis',
  },
  {
    lessonType: 'Other',
    activityType: 'Non-written Material Production',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Case Study Analysis',
  },
  {
    lessonType: 'Learning',
    activityType: 'Project-based Learning',
  },
  {
    lessonType: 'Assessment',
    activityType: 'Problem-solving Activity',
  },
  {
    lessonType: 'Learning',
    activityType: 'Frontal Lecture',
  },
];

const lessonTypes = [
  {
    name: 'Learning',
    colorBackground: 'blue.200',
  },
  {
    name: 'Assessment',
    colorBackground: 'blue.100',
  },
  {
    name: 'Other',
    colorBackground: 'gray.200',
  },
];

export type Lesson = {
  title: string;
  activities: Activity[];
};

export type TabTableProps = {
  lesson: Lesson;
  handleApprovedLesson: (data: rowData[]) => void;
  loading: boolean;
};

const TableLearningPath = forwardRef<HTMLDivElement, TabTableProps>(
  (props, ref) => {
    const { lesson, handleApprovedLesson, loading } = props;
    const hydrated = useHasHydrated();
    const [data, setData] = useState<rowData[]>([]);

    useEffect(() => {
      const newData = lesson.activities.map((activity) => ({
        lessonType: activity.Type ? 'Assessment' : 'Learning',
        timeDuration: activity.Duration,
        activityType: activity.Type
          ? activityTypes[parseInt(activity.Details)].activityType
          : 'Knowledge Exposition',
        activityDescription: activity.Type ? activity.Topic : activity.Details,
      }));
      setData(newData);
    }, [lesson]);

    const handleLessonTypeChange = (
      index: number,
      selectedTypeIndex: number
    ) => {
      setData(
        produce((draft) => {
          draft[index].lessonType = lessonTypes[selectedTypeIndex].name;
        })
      );
    };

    const handleActivityTypeChange = (
      index: number,
      selectedTypeIndex: number
    ) => {
      const lessonTypeIndex = lessonTypes.findIndex(
        (lessonType) => lessonType.name === data[index].lessonType
      );
      const filteredActivity = activityTypes.filter(
        (activity) => activity.lessonType === lessonTypes[lessonTypeIndex].name
      );
      setData(
        produce((draft) => {
          draft[index].activityType =
            filteredActivity[selectedTypeIndex].activityType;
        })
      );
    };

    const handleTineDurationChange = (index: number, value: string) => {
      setData(
        produce((draft) => {
          draft[index].timeDuration = parseInt(value);
        })
      );
    };

    const handleEditDescription = (index: number, description: string) => {
      console.log('description', description);
      setData(
        produce((draft) => {
          draft[index].activityDescription = description;
        })
      );
    };

    const handleDeleteRow = (index: number) => {
      setData(data.filter((_, i) => i !== index));
    };

    useEffect(() => {
      console.log('data in Index', data);
    }, [data]);

    return (
      <Flex direction="column" overflow={'auto'}>
        {hydrated && (
          <CustomLearningPathTable
            ref={ref}
            titles={titleColumns}
            data={data}
            activityTypes={activityTypes}
            lessonTypes={lessonTypes}
            handleLessonTypeChange={handleLessonTypeChange}
            handleActivityTypeChange={handleActivityTypeChange}
            handleTimeDurationChange={handleTineDurationChange}
            handleEditDescription={handleEditDescription}
            handleDeleteRow={handleDeleteRow}
            setTableData={setData}
          />
        )}
        <Button
          onClick={() => handleApprovedLesson(data)}
          isLoading={loading}
          loadingText="Creating"
          colorScheme="blue"
          alignSelf="flex-end"
          mt={4}
        >
          Next
        </Button>
      </Flex>
    );
  }
);

TableLearningPath.displayName = 'TableLearningPath';
export default TableLearningPath;
