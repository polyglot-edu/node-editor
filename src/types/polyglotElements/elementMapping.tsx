import { PropertiesProps } from "../../components/NodeProperties/Properties";
import { ReactFlowNodeProps } from "../../components/ReactFlowNodes/ReactFlowNode";

// https://github.com/Microsoft/TypeScript/pull/18654
// https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
type ReactFlowElementComponent = { bivarianceHack(props: ReactFlowNodeProps): JSX.Element }["bivarianceHack"];

// https://github.com/Microsoft/TypeScript/pull/18654
// https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
type PropertiesComponent = { bivarianceHack(props: PropertiesProps): JSX.Element }["bivarianceHack"];


type NodeToPropertyComponentMapping = { [nodeType: string]: PropertiesComponent };
type NodeToReactFlowElementComponentMapping = { [nodeType: string]: ReactFlowElementComponent };
class PolyglotNodeComponentMapping {
    private propertiesMapping: NodeToPropertyComponentMapping = {};
    private elementsMapping: NodeToReactFlowElementComponentMapping = {};
    public registerNodeType(nodeType: string, propertiesComponent: PropertiesComponent, elementComponent: ReactFlowElementComponent) {
        if (nodeType in this.propertiesMapping) {
            throw new Error(`Node type ${nodeType} is already registered`);
        }
        this.propertiesMapping[nodeType] = propertiesComponent;
        this.elementsMapping[nodeType] = elementComponent;
    }

    getElementComponentMapping(): Readonly<ReactFlowElementComponent> {
        return this.elementsMapping;
    }

    getPropertiesComponent(nodeType: string | undefined): PropertiesComponent {
        return nodeType !== undefined ? this.propertiesMapping[nodeType] : (props: PropertiesProps) => <></>;
    }
}

const polyglotNodeComponentMapping = new PolyglotNodeComponentMapping();
export { polyglotNodeComponentMapping };