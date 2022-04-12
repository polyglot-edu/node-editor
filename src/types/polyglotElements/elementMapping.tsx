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
type ElementToNameMapping = { [nodeType: string]: string };
class PolyglotComponentMapping<T, U> {
    private _propertiesMapping: ElementToPropertyComponentMapping<T> = {};
    private _elementMapping: ElementToReactFlowComponentMapping<U> = {};
    private _nameMapping: ElementToNameMapping = {};
    public registerNodeType(elementType: string, name: string, propertiesComponent: PropertiesComponent<T>, elementComponent: ReactFlowComponent<U>) {
        if (elementType in this._propertiesMapping) {
            throw new Error(`Element type ${elementType} is already registered`);
        }
        this._propertiesMapping[elementType] = propertiesComponent;
        this._elementMapping[elementType] = elementComponent;
        this._nameMapping[elementType] = name;
    }

    get propertiesMapping(): Readonly<ElementToPropertyComponentMapping<T>> {
        return this._propertiesMapping;
    }

    get componentMapping(): Readonly<ElementToReactFlowComponentMapping<U>> {
        return this._elementMapping;
    }

    get nameMapping(): Readonly<ElementToNameMapping> {
        return this._nameMapping;
    }

    getElementPropertiesComponent(elementType: string | undefined): PropertiesComponent<T> {
        return elementType !== undefined ? this._propertiesMapping[elementType] : (props: NodePropertiesProps) => <></>;
    }
}

const polyglotNodeComponentMapping = new PolyglotComponentMapping<NodePropertiesProps, ReactFlowNodeProps>();
export { polyglotNodeComponentMapping };

const polyglotEdgeComponentMapping = new PolyglotComponentMapping<EdgePropertiesProps, ReactFlowEdgeProps>();
export { polyglotEdgeComponentMapping };