import { ContextualMenu, IContextualMenuItem } from '@fluentui/react';
import { useRef } from 'react';
import { Node } from 'react-flow-renderer';
import useStore from '../../store';
import { polyglotNodeComponentMapping } from '../../types/polyglotElements';
import { createNewDefaultPolyglotNode } from '../../utils/utils';

type ContextMenuProps = {
  pos: {
    x: number;
    y: number;
  };
  showing: boolean;
  node?: Node;
  type: string;
  onDismiss: () => void;
};

const ContextMenu = ({
  pos,
  showing,
  type,
  node,
  onDismiss,
}: ContextMenuProps) => {
  const linkRef = useRef(null);

  const menuItems: IContextualMenuItem[] = Object.keys(
    polyglotNodeComponentMapping.nameMapping
  ).map((index, id) => {
    return {
      key: id.toString(),
      text: 'New ' + polyglotNodeComponentMapping.nameMapping[index],
      iconProps: { iconName: 'Add' },
      onClick: () => {
        const nodeToAdd = createNewDefaultPolyglotNode(pos, index);
        useStore.getState().addNode(nodeToAdd);
      },
    };
  });

  const menuNodeActions: IContextualMenuItem[] = [
    {
      key: '0',
      text: 'Remove',
      iconProps: { iconName: 'Delete' },
      onClick: () => {
        if (!node) return;
        useStore.getState().removeNode(node.id);
      },
    },
  ];

  return (
    <>
      <span
        className="absolute z-50"
        ref={linkRef}
        style={{ top: pos.y, left: pos.x }}
      />

      <ContextualMenu
        className="pt-2"
        hidden={!showing}
        items={type === 'node' ? menuNodeActions : menuItems}
        styles={{ root: { top: pos.y, left: pos.x } }}
        target={linkRef}
        onDismiss={onDismiss}
      />
    </>
  );
};

export default ContextMenu;
