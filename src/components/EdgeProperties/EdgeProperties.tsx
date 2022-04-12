import useStore from "../../store";
import { PolyglotEdge } from "../../types/polyglotElements";
import "./EdgeProperties.css";

export type EdgePropertiesProps = {};

const Properties = (props: EdgePropertiesProps) => {
    const selectedEdge = useStore(state => state.getSelectedEdge()) as PolyglotEdge;
    const updateEdge = useStore(state => state.updateEdge);

    if (!selectedEdge) {
        return <></>;
    }

    return (
        <></>
    )
};

export default Properties;