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
    bgColor: '#FFF0C8',
    group: 'remember_learning',
  },
  {
    label: 'UNDERSTAND',
    bgColor: '#FFEBB6',
    group: 'understand_learning',
  },
  {
    label: 'APPLY',
    bgColor: '#FFE092',
    group: 'apply_learning',
  },
  {
    label: 'CREATE',
    bgColor: '#FFCC49',
    group: 'create_learning',
  },
];
const configAssessment = [
  {
    label: 'REMEMBER',
    bgColor: '#D3CDDB',
    group: 'remember_assessment',
  },
  {
    label: 'UNDERSTAND',
    bgColor: '#BEB4C9',
    group: 'understand_assessment',
  },
  {
    label: 'APPLY',
    bgColor: '#9282A5',
    group: 'apply_assessment',
  },
  {
    label: 'CREATE',
    bgColor: '#7C6892',
    group: 'create_assessment',
  },
];

const listImplementedNodes = [
  'lessonTextNode',
  'multipleChoiceQuestionNode',
  'closeEndedQuestionNode',
  'TrueFalseNode',
  'ReadMaterialNode',
  'abstractNode',
];
export type LateralMenuProps = {
  isOpen: boolean;
};
const LateralMenu = ({ isOpen }: LateralMenuProps) => {
  if (!isOpen) return <></>;
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
      text: polyglotNodeComponentMapping.nameMapping[index],
      icon: polyglotNodeComponentMapping.iconMapping[index] ?? '',
      index: index,
      group: polyglotNodeComponentMapping.groupMapping[index] ?? '',
    };
  });

  return (
    <>
      <Box
        w={'300px'}
        title="drag the new node"
        marginBottom={'0px'}
        backgroundColor={'rgba(217, 217, 217, 0.6)'}
      >
        <div className="label">NEW ACTIVITY</div>

        <Box height={{ base: '200px', xl: '600px' }} overflowY="scroll">
          <div
            className="nodeSubmenu"
            style={{
              backgroundColor: 'rgba(255, 204, 73, 1)',
            }}
          >
            LEARNING ACTIVITY
          </div>
          <Accordion defaultIndex={0} variant={{}}>
            {configLearning.map((type, id) => (
              <AccordionItem key={id}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      backgroundColor={type.bgColor}
                      padding={{ base: '5px', xl: '10px' }}
                      fontFamily={'Inter'}
                      fontSize={{ base: '10px', xl: '14px' }}
                      height={{ base: '15px', xl: '30px' }}
                    >
                      {isExpanded ? (
                        <ChevronDownIcon fontSize={'20px'} />
                      ) : (
                        <ChevronRightIcon fontSize={'20px'} />
                      )}{' '}
                      <div>{type.label}</div>
                    </AccordionButton>
                    <AccordionPanel>
                      {nodes
                        .filter((node) => node.group === type.group)
                        .map((nodes) => (
                          <>
                            <div
                              id={nodes.key}
                              key={nodes.key}
                              className="nodeItem"
                              onMouseOver={() =>
                                listImplementedNodes.includes(nodes.index)
                                  ? document
                                      .getElementById(nodes.key)
                                      ?.setAttribute(
                                        'style',
                                        'background-color:' + type.bgColor
                                      )
                                  : document
                                      .getElementById(nodes.key)
                                      ?.setAttribute(
                                        'style',
                                        'background-color: grey'
                                      )
                              }
                              onMouseOut={() =>
                                document
                                  .getElementById(nodes.key)
                                  ?.removeAttribute('style')
                              }
                              onDragStart={(event) =>
                                listImplementedNodes.includes(nodes.index)
                                  ? onDragStart(event, nodes.index)
                                  : null
                              }
                              draggable={
                                listImplementedNodes.includes(nodes.index)
                                  ? true
                                  : false
                              }
                              title={
                                listImplementedNodes.includes(nodes.index)
                                  ? 'Drag the new Node type'
                                  : 'Node type not implemented yet'
                              }
                            >
                              <Image
                                alt={'Node icon'}
                                src={nodes.icon}
                                style={{ float: 'left' }}
                                height="20"
                                width="20"
                              />
                              {nodes.text}
                            </div>
                          </>
                        ))}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
          <div
            className="nodeSubmenu"
            style={{
              marginTop: '30px',
              backgroundColor: 'rgba(124, 104, 146, 0.5)',
            }}
          >
            {' '}
            ASSESSMENT ACTIVITY{' '}
          </div>
          <Accordion>
            {configAssessment.map((type, id) => (
              <AccordionItem key={id} sx={{ borderWidth: '0px' }}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      padding={{ base: '5px', xl: '10px' }}
                      fontFamily={'Inter'}
                      fontSize={{ base: '10px', xl: '14px' }}
                      height={{ base: '15px', xl: '30px' }}
                      backgroundColor={type.bgColor}
                    >
                      {isExpanded ? (
                        <ChevronDownIcon fontSize={'20px'} />
                      ) : (
                        <ChevronRightIcon fontSize={'20px'} />
                      )}{' '}
                      <div>{type.label}</div>
                    </AccordionButton>
                    <AccordionPanel>
                      {nodes
                        .filter((node) => node.group === type.group)
                        .map((nodes) => (
                          <div
                            id={nodes.key}
                            key={nodes.key}
                            className="nodeItem"
                            onMouseOver={() =>
                              listImplementedNodes.includes(nodes.index)
                                ? document
                                    .getElementById(nodes.key)
                                    ?.setAttribute(
                                      'style',
                                      'background-color:' + type.bgColor
                                    )
                                : document
                                    .getElementById(nodes.key)
                                    ?.setAttribute(
                                      'style',
                                      'background-color: grey'
                                    )
                            }
                            onMouseOut={() =>
                              document
                                .getElementById(nodes.key)
                                ?.removeAttribute('style')
                            }
                            onDragStart={(event) =>
                              listImplementedNodes.includes(nodes.index)
                                ? onDragStart(event, nodes.index)
                                : null
                            }
                            draggable={
                              listImplementedNodes.includes(nodes.index)
                                ? true
                                : false
                            }
                            title={
                              listImplementedNodes.includes(nodes.index)
                                ? 'Drag the new Node type'
                                : 'Node type not implemented yet'
                            }
                          >
                            <Image
                              alt={'Node icon'}
                              src={nodes.icon}
                              style={{ float: 'left' }}
                              height="20"
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
        </Box>
      </Box>
    </>
  );
};

export default LateralMenu;
