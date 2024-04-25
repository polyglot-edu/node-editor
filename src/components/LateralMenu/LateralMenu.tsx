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
          {nodes.map((nodes) => (
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
                  document
                    .getElementById(nodes.key)
                    ?.setAttribute('style', 'background-color:#D3CDDB')
                }
                onMouseOut={() =>
                  document.getElementById(nodes.key)?.removeAttribute('style')
                }
                onDragStart={(event) => onDragStart(event, nodes.index)}
                draggable={true}
                title={'Drag the new Node type'}
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
