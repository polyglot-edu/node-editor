import { LessonTextNodeProperties } from "../../../components/NodeProperties";
import { ReactFlowLessonNode } from "../../../components/ReactFlowNode";
import { polyglotNodeComponentMapping } from "../elementMapping";
import { ChallengeContent, ChallengeSetup, defaultPolyglotNodeData, NodeData, PolyglotNode } from "./Node";

export type LessonTextNodeData = NodeData & {
    text: string;
}

export type LessonTextNode = PolyglotNode & {
    type: "lessonTextNode";
    data: LessonTextNodeData;
}

polyglotNodeComponentMapping.registerMapping<LessonTextNode>({
    elementType: "lessonTextNode",
    name: "Lesson (Text)",
    propertiesComponent: LessonTextNodeProperties,
    elementComponent: ReactFlowLessonNode,
    defaultData: {
        text: "",
        ...defaultPolyglotNodeData,
    },
    transformData: (node) => {
        let lessonTextNode = node as LessonTextNode;

        let challengeSetup: ChallengeSetup[] = [];
        let challengeContent: ChallengeContent[] = [{
            type: "markdown",
            content: lessonTextNode.data.text
        }];

        return {
            ...node,
            runtimeData: {
                challengeSetup,
                challengeContent
            }
        }
    }
});