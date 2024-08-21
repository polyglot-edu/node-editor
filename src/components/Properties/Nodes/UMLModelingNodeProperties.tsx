import { Box, Button, FormLabel, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';
type getAssignmentProjectsList = [
  {
    id: string;
    projectId: string;
    assignmentText: string;
  }
];
const UMLModelingNodeProperties = () => {
  const [projectsList, setProjectsList] = useState<getAssignmentProjectsList>();
  const { getValues, setValue } = useFormContext();
  const [mode, setMode] = useState<string>(getValues('data.mode'));
  const [assignemntText, setAssignemntText] = useState<string>(
    getValues('data.assignment')
  );

  useEffect(() => {
    API.getAssignmentProjects()
      .then(async (response) => {
        console.log(response.data);
        setProjectsList(response.data);
        console.log(projectsList);
      })
      .catch(async (error: any) => {
        console.log(error);
        throw new Error(`HTTP error! Status: ${error.response.status}`);
      });
  }, [API]);

  return (
    <>
      <NodeProperties
        platform={['PapyrusWeb']}
        activityDescription="In this activity learners will have solve an assignment of UML class activity."
      />

      <Button
        hidden={mode == 'Default'}
        onClick={() => {
          setMode('Default');
          setValue('data.mode', 'Default');
        }}
      >
        Default
      </Button>
      <Button
        hidden={mode == 'Custom'}
        onClick={() => {
          setMode('Custom');
          setValue('data.mode', 'Custom');
        }}
      >
        Custom
      </Button>

      <Box hidden={mode != 'Default'} marginTop={'10px'}>
        <Select
          onChange={(event) => {
            console.log(event.target.value);
            const project = projectsList?.find(
              (value) => value.id == event.target.value
            );
            if (!project) return;
            console.log(project);
            setAssignemntText(project.assignmentText);
            setValue('data.assignment', project.assignmentText);
            setValue('data.idUML', project.id);
            setValue('data.projectUML', project.projectId);
          }}
        >
          <>
            {projectsList?.map((item, index) => {
              return (
                <>
                  <option key={index} value={item.id}>
                    Type {index + 1}
                  </option>
                </>
              );
            })}
          </>
        </Select>
        <FormLabel
          style={{
            font: '15px',
            top: '-13px',
            left: '15px',
            zIndex: '2px',
            position: 'absolute',
            backgroundColor: 'white',
          }}
        >
          Type
        </FormLabel>
        <Box marginTop={'10px'}>Assignment text: <br/>{assignemntText}</Box>
      </Box>

      <Box hidden={mode != 'Custom'} marginTop={'10px'}>
        <Button
          disabled={
            getValues('data.idUML') != '' &&
            !projectsList?.find((value) => value.id == getValues('data.idUML'))
          }
          onClick={() => {
            console.log('generate project');
            const id = (Math.random() + 1).toString(36).substring(7);
            API.generateNewProject({
              ctxId: '',
              assignment_id: id,
              nomeUtente: '',
            })
              .then(async (response) => {
                console.log(response.data);
                setValue('data.idUML', response.data.project_id);
                setValue('data.projectUML', response.data.representation_id);
              })
              .catch(async (error: any) => {
                console.log(error);
              });
          }}
        >
          Generate project
        </Button>
        <Box marginTop={'10px'}>
          Click to open our UML modeling platform to define your custom exercise
        </Box>
        <Button
          disabled={
            getValues('data.idUML') != '' &&
            projectsList?.find(
              (value) => value.id == getValues('data.idUML')
            ) != undefined
          }
          onClick={() => {
            window.open(
              'https://papygame.tech/projects/' +
                getValues('data.idUML') +
                '/edit/' +
                getValues('data.projectUML'),
              '_blank'
            );
          }}
        >
          PapyrusWeb
        </Button>
        <Box marginTop={'10px'}
          hidden={
            getValues('data.idUML') != '' &&
            projectsList?.find(
              (value) => value.id == getValues('data.idUML')
            ) != undefined
          }
        >
          <MarkDownField label="Assignment" name="data.assignment" />
        </Box>
        <Button marginTop={'10px'}
          hidden={
            getValues('data.idUML') != '' &&
            projectsList?.find(
              (value) => value.id == getValues('data.idUML')
            ) != undefined
          }
          onClick={() => {
            console.log('Assignment generated');
          }}
        >
          Generate assignment
        </Button>
      </Box>
    </>
  );
};

export default UMLModelingNodeProperties;
