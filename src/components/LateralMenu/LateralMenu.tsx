import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import Image from 'next/image';
import { DragEvent } from 'react';
import assessment_icon from '../../public/assessment_icon.png';
import learning_icon from '../../public/learning_icon.png';
import { polyglotNodeComponentMapping } from '../../types/polyglotElements';

interface NodeItem {
  key: string;
  text: string;
  icon: string;
  index: string;
  group: string;
}
const configLearning = [
  {
    label: 'REMEMBER',
    bgColor: '#D2EAFD',
    group: 'remember_learning',
  },
  {
    label: 'UNDERSTAND',
    bgColor: '#A6D5FB',
    group: 'understand_learning',
  },
  {
    label: 'APPLY',
    bgColor: '#79C1FA',
    group: 'apply_learning',
  },
  {
    label: 'CREATE',
    bgColor: '#4DACF8',
    group: 'create_learning',
  },
];
const configAssessment = [
  {
    label: 'REMEMBER',
    bgColor: '#FFCEC7',
    group: 'remember_assessment',
  },
  {
    label: 'UNDERSTAND',
    bgColor: '#FFADA1',
    group: 'understand_assessment',
  },
  {
    label: 'APPLY',
    bgColor: '#FF8C7B',
    group: 'apply_assessment',
  },
  {
    label: 'CREATE',
    bgColor: '#FF7B69',
    group: 'create_assessment',
  },
];

const LateralMenu = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    if (event.dataTransfer == null) {
      return;
    }
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const nodes: NodeItem[] = Object.keys(
    polyglotNodeComponentMapping.nameMapping
  ).map((index, id) => {
    return {
      key: id.toString(),
      text: 'New ' + polyglotNodeComponentMapping.nameMapping[index],
      icon: polyglotNodeComponentMapping.iconMapping[index] ?? '',
      index: index,
      group: polyglotNodeComponentMapping.groupMapping[index] ?? '',
    };
  });

  return (
    <>
      <Box
        width={'280px'}
        height={'420px'}
        border={'1px'}
        borderColor={'gray'}
        title="drag the new node"
      >
        <div className="label">ADD NEW ACTIVITY</div>
        <p style={{ overflow: 'auto', height: '400px' }}>
          <span className="label">
            <Image
              alt={'Activity Icon'}
              src={learning_icon.src}
              style={{ float: 'left' }}
              width="20"
            />
            LEARNING ACTIVITY
          </span>
          <Accordion defaultIndex={0}>
            {configLearning.map((type, id) => (
              <AccordionItem key={id}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      className="nodeButton"
                      backgroundColor={type.bgColor}
                    >
                      {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}{' '}
                      <span className="text-[12px]">{type.label}</span>
                    </AccordionButton>
                    <AccordionPanel>
                      {nodes
                        .filter((node) => node.group === type.group)
                        .map((nodes) => (
                          <div
                            key={nodes.key}
                            className="nodeItem"
                            onDragStart={(event) =>
                              onDragStart(event, nodes.index)
                            }
                            draggable
                          >
                            <Image
                              alt={'Node icon'}
                              src={nodes.icon}
                              style={{ float: 'left' }}
                              width="20"
                            />
                            {nodes.text}
                          </div>
                        ))}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
          <hr />
          <span className="label">
            <Image
              alt={'Activity icon'}
              src={assessment_icon.src}
              style={{ float: 'left' }}
              width="20"
            />
            ASSESSMENT ACTIVITY{' '}
          </span>
          <Accordion>
            {configAssessment.map((type, id) => (
              <AccordionItem key={id}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      className="nodeButton"
                      backgroundColor={type.bgColor}
                    >
                      {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}{' '}
                      <span className="text-[12px]">{type.label}</span>
                    </AccordionButton>
                    <AccordionPanel>
                      {nodes
                        .filter((node) => node.group === type.group)
                        .map((nodes) => (
                          <div
                            key={nodes.key}
                            className="nodeItem"
                            onDragStart={(event) =>
                              onDragStart(event, nodes.index)
                            }
                            draggable
                          >
                            <Image
                              alt={'Node icon'}
                              src={nodes.icon}
                              style={{ float: 'left' }}
                              width="20"
                            />
                            {nodes.text}
                          </div>
                        ))}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </p>
      </Box>
    </>
  );
};

export default LateralMenu;

