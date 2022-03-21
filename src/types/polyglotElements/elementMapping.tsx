import { EdgePropertiesProps } from "../../components/EdgeProperties/EdgeProperties";
import { NodePropertiesProps } from "../../components/NodeProperties/NodeProperties";
import { ReactFlowEdgeProps } from "../../components/ReactFlowEdge/ReactFlowEdge";
import { ReactFlowNodeProps } from "../../components/ReactFlowNode/ReactFlowNode";

// https://github.com/Microsoft/TypeScript/pull/18654
// https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
type PropertiesComponent<T> = { bivarianceHack(props: T): JSX.Element }["bivarianceHack"];
type ReactFlowComponent<T> = { bivarianceHack(props: T): JSX.Element }["bivarianceHack"];

type ElementToPropertyComponentMapping<T> = { [nodeType: string]: PropertiesComponent<T> };
type ElementToReactFlowComponentMapping<T> = { [nodeType: string]: ReactFlowComponent<T> };
class PolyglotComponentMapping<T, U> {
    private propertiesMapping: ElementToPropertyComponentMapping<T> = {};
    private elementMapping: ElementToReactFlowComponentMapping<U> = {};
    public registerNodeType(elementType: string, propertiesComponent: PropertiesComponent<T>, elementComponent: ReactFlowComponent<U>) {
        if (elementType in this.propertiesMapping) {
            throw new Error(`Element type ${elementType} is already registered`);
        }
        this.propertiesMapping[elementType] = propertiesComponent;
        this.elementMapping[elementType] = elementComponent;
    }

    getElementComponentMapping(): Readonly<ReactFlowComponent<U>> {
        return this.elementMapping;
    }

    getElementPropertiesComponent(elementType: string | undefined): PropertiesComponent<T> {
        return elementType !== undefined ? this.propertiesMapping[elementType] : (props: NodePropertiesProps) => <></>;
    }
}

const polyglotNodeComponentMapping = new PolyglotComponentMapping<NodePropertiesProps, ReactFlowNodeProps>();
export { polyglotNodeComponentMapping };

const polyglotEdgeComponentMapping = new PolyglotComponentMapping<EdgePropertiesProps, ReactFlowEdgeProps>();
export { polyglotEdgeComponentMapping };