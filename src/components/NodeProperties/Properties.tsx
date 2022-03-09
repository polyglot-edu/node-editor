import "./Properties.css";
import { useFormInput } from "../../utils/utils";
import { PolyglotNode } from "../../types/polyglotElements";

export type PropertyProps = PolyglotNode

const Property = ({ }: PropertyProps) => {
    const title = useFormInput("Title");
    const description = useFormInput("Description");

    return (
        <div>
            <span>Title: </span>
            <input {...title} />
            <br />
            <span>Description: </span>
            <input {...description} />
        </div>
    )
};

export default Property;