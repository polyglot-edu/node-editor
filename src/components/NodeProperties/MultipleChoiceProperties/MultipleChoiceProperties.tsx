import { MultipleChoiceNode } from "../../../types/polyglotElements";

export type MultipleChoicePropertiesProps = MultipleChoiceNode;


const MultipleChoiceProperties = ({ id, data: { options } }: MultipleChoicePropertiesProps) => {
    return (
        <>
            <div>
                {id}
            </div>
            <div>
                {options.map((option, index) => (<div>{option}</div>))}
            </div>
        </>
    );
}
export default MultipleChoiceProperties;