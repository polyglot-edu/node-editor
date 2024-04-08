import { Box } from '@chakra-ui/react';
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
const learningList = ['remember_learning', 'understand_learning'];
const assessmentList = ['remember_assessment', 'create_assessment'];
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
  'ReadMaterialNode',
  'multipleChoiceQuestionNode',
  'closeEndedQuestionNode',
  'OpenQuestionNode',
  'TrueFalseNode',
  'WatchVideoNode',
  'SummaryNode',
  'codingQuestionNode',
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
        <Box height="100%" overflowY="scroll" paddingBottom={'15%'}>
          <div
            className="nodeSubmenu"
            style={{
              backgroundColor: 'rgba(255, 204, 73, 1)',
            }}
          >
            NEW ACTIVITY
          </div>

          {nodes
            .filter((nodes) => listImplementedNodes.includes(nodes.index))
            .filter((node) => learningList.includes(node.group))
            .map((nodes) => (
              <>
                <Box
                  id={nodes.key}
                  key={nodes.key}
                  className="nodeItem"
                  fontSize={{
                    base: '10px',
                    md: '12px',
                    xl: '14px',
                  }}
                  onMouseOver={() =>
                    listImplementedNodes.includes(nodes.index)
                      ? document
                          .getElementById(nodes.key)
                          ?.setAttribute('style', 'background-color:#FFF0C8')
                      : document
                          .getElementById(nodes.key)
                          ?.setAttribute('style', 'background-color: grey')
                  }
                  onMouseOut={() =>
                    document.getElementById(nodes.key)?.removeAttribute('style')
                  }
                  onDragStart={(event) =>
                    listImplementedNodes.includes(nodes.index)
                      ? onDragStart(event, nodes.index)
                      : null
                  }
                  draggable={
                    listImplementedNodes.includes(nodes.index) ? true : false
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
                </Box>
              </>
            ))}
          {nodes
            .filter((nodes) => listImplementedNodes.includes(nodes.index))
            .filter((node) => assessmentList.includes(node.group))
            .map((nodes) => (
              <>
                <Box
                  id={nodes.key}
                  key={nodes.key}
                  className="nodeItem"
                  fontSize={{
                    base: '10px',
                    md: '12px',
                    xl: '14px',
                  }}
                  onMouseOver={() =>
                    listImplementedNodes.includes(nodes.index)
                      ? document
                          .getElementById(nodes.key)
                          ?.setAttribute('style', 'background-color:#D3CDDB')
                      : document
                          .getElementById(nodes.key)
                          ?.setAttribute('style', 'background-color: grey')
                  }
                  onMouseOut={() =>
                    document.getElementById(nodes.key)?.removeAttribute('style')
                  }
                  onDragStart={(event) =>
                    listImplementedNodes.includes(nodes.index)
                      ? onDragStart(event, nodes.index)
                      : null
                  }
                  draggable={
                    listImplementedNodes.includes(nodes.index) ? true : false
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
                </Box>
              </>
            ))}
        </Box>
      </Box>
    </>
  );
};

export default LateralMenu;
