import { ContextualMenu, IContextualMenuItem } from '@fluentui/react';
import { useRef } from 'react';
import { Node } from 'react-flow-renderer';
import useStore from '../../store';
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

  const menuItems: IContextualMenuItem[] = [
    {
      key: '0',
      text: 'New Multiple Choice Node',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        const nodeToAdd = createNewDefaultPolyglotNode(pos);
        useStore.getState().addNode(nodeToAdd);
      },
    },
    {
      key: '1',
      text: 'New Abstract Node',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        const nodeToAdd = createNewDefaultPolyglotNode(pos);
        nodeToAdd.reactFlow.type = 'abstractNode';
        nodeToAdd.type = 'abstractNode';
        useStore.getState().addNode(nodeToAdd);
      },
    },
    {
      key: '2',
      text: 'New Close Ended Question Node',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        const nodeToAdd = createNewDefaultPolyglotNode(pos);
        nodeToAdd.reactFlow.type = 'closeEndedQuestionNode';
        nodeToAdd.type = 'closeEndedQuestionNode';
        useStore.getState().addNode(nodeToAdd);
      },
    },
    {
      key: '3',
      text: 'New Lesson Text Node',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        const nodeToAdd = createNewDefaultPolyglotNode(pos);
        nodeToAdd.reactFlow.type = 'lessonNode';
        nodeToAdd.type = 'lessonNode';
        useStore.getState().addNode(nodeToAdd);
      },
    },
    {
      key: '4',
      text: 'New Coding Question Node',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        const nodeToAdd = createNewDefaultPolyglotNode(pos);
        nodeToAdd.reactFlow.type = 'codingQuestionNode';
        nodeToAdd.type = 'codingQuestionNode';
        useStore.getState().addNode(nodeToAdd);
      },
    },
  ];

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
