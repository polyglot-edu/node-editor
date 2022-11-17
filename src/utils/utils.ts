import { useState } from 'react';
import { MarkerType } from 'react-flow-renderer';
import { v4 as UUIDv4 } from 'uuid';
import {
  MultipleChoiceQuestionNode,
  PassFailEdge,
  PolyglotEdge,
  PolyglotFlow,
  PolyglotNode,
} from '../types/polyglotElements';

export const isObject = (variable: any) => {
  return (
    typeof variable === 'object' &&
    !Array.isArray(variable) &&
    variable !== null
  );
};

export const useToggleCSSVariable = (variable: string, values: string[]) => {
  if (values.length <= 0) {
    throw new Error(
      'useToggleCSSVariable: values must be an array with at least one element'
    );
  }

  const [currentIndex, setIndex] = useState<number>(0);
  document.documentElement.style.setProperty(variable, values[currentIndex]);

  function handleChange() {
    setIndex((currentIndex + 1) % values.length);
    document.documentElement.style.setProperty(variable, values[currentIndex]);
  }

  return {
    index: currentIndex,
    value: values[currentIndex],
    toggle: handleChange,
  };
};

export const zip = <T, K>(a: T[], b: K[]) =>
  a.map((k, i) => ({ first: k, second: b[i] }));

export const createNewDefaultPolyglotFlow = (): PolyglotFlow => {
  return {
    _id: UUIDv4(),
    title: 'New Flow',
    description: '',
    nodes: [],
    edges: [],
  };
};

export const createNewDefaultPolyglotNode = (pos: {
  x: number;
  y: number;
}): PolyglotNode => {
  const id = UUIDv4();
  const newNode: MultipleChoiceQuestionNode = {
    _id: id,
    type: 'MultipleChoiceQuestionNode',
    title: 'New Node',
    description: '',
    difficulty: 1,
    data: { question: '', isChoiceCorrect: [], choices: [] },
    reactFlow: {
      id: id,
      type: 'MultipleChoiceQuestionNode',
      position: pos,
      data: { label: 'New Node' },
    },
  };

  return newNode;
};

export const createNewDefaultPolyglotEdge = (
  sourceId: string,
  targetId: string
): PolyglotEdge => {
  const id = UUIDv4();
  const newEdge: PassFailEdge = {
    _id: id,
    reactFlow: {
      id: id,
      source: sourceId,
      target: targetId,
      type: 'PassFailEdge',
      markerEnd: {
        type: MarkerType.Arrow,
        width: 25,
        height: 25,
      },
    },
    type: 'PassFailEdge',
    title: '',
    data: {
      conditionKind: 'pass',
    },
  };

  return newEdge;
};
