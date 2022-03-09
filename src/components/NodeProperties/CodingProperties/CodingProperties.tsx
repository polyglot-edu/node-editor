import { CodingNode } from "../../../types/polyglotElements/nodes/CodingNode";

export type CodingPropertiesProps = CodingNode

const CodingProperties = ({ id, data: { other } }: CodingPropertiesProps) => {
    return (
        <div>
            {id}
        </div>
    );
}

export default CodingProperties;