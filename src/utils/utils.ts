import { useState } from "react";
import { MultipleChoiceQuestionNode, PassFailEdge, PolyglotEdge, PolyglotFlow, PolyglotNode } from "../types/polyglotElements";
import { v4 as UUIDv4 } from "uuid";
import { MarkerType } from "react-flow-renderer";

export const useToggleCSSVariable = (variable: string, values: string[]) => {
    if (values.length <= 0) {
        throw new Error("useToggleCSSVariable: values must be an array with at least one element");
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
}

export const createNewDefaultPolyglotFlow = (): PolyglotFlow => {
    return {
        id: UUIDv4(),
        title: "New Flow",
        description: "",
        nodes: [],
        edges: [],
    }
}

export const createNewDefaultPolyglotNode = (pos: { x: number, y: number }): PolyglotNode => {
    const newNode: MultipleChoiceQuestionNode = {
        type: "multipleChoiceQuestionNode",
        title: 'New Node',
        description: '',
        difficulty: 1,
        data: { question: "", correctAnswers: [], choices: [] },
        reactFlow: {
            id: UUIDv4(),
            type: "multipleChoiceQuestionNode",
            position: pos,
            data: { label: 'New Node' },
        },
    };

    return newNode;
}

export const createNewDefaultPolyglotEdge = (sourceId: string, targetId: string): PolyglotEdge => {
    const newEdge: PassFailEdge = {
        reactFlow: {
            id: UUIDv4(),
            source: sourceId,
            target: targetId,
            type: "passFailEdge",
            markerEnd: {
                type: MarkerType.Arrow,
                width: 25,
                height: 25,
            }
        },
        type: "passFailEdge",
        title: "",
        data: {
            conditionKind: "pass",
        },
    }

    return newEdge;
}