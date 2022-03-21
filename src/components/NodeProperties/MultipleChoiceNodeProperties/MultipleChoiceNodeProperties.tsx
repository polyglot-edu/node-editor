import { MultipleChoiceNode } from "../../../types/polyglotElements";
import { NodePropertiesProps } from "../NodeProperties";

export type MultipleChoiceNodePropertiesProps = MultipleChoiceNode & NodePropertiesProps;


const MultipleChoiceNodeProperties = (props: MultipleChoiceNodePropertiesProps) => {
    return (
        <div>
            <div>
                test
            </div>
        </div>
    );
}
export default MultipleChoiceNodeProperties;