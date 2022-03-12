import { CodingNode } from "../../../types/polyglotElements";
import { PropertiesProps } from "../Properties";

export type CodingPropertiesProps = PropertiesProps & CodingNode

const CodingProperties = ({ id, data: { other } }: CodingPropertiesProps) => {
    return (
        <div>
            {id}
        </div>
    );
}

export default CodingProperties;