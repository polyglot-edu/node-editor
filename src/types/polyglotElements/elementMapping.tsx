import { EdgePropertiesProps } from "../../components/EdgeProperties/EdgeProperties";
import { NodePropertiesProps } from "../../components/NodeProperties/NodeProperties";
import { ReactFlowEdgeProps } from "../../components/ReactFlowEdge/ReactFlowEdge";
import { ReactFlowNodeProps } from "../../components/ReactFlowNode/ReactFlowNode";

// https://github.com/Microsoft/TypeScript/pull/18654
// https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
type PropertiesComponent<T> = { bivarianceHack(props: T): JSX.Element }["bivarianceHack"];
type ReactFlowComponent<T> = { bivarianceHack(props: T): JSX.Element }["bivarianceHack"];

type ElementToPropertyComponentMapping<T> = { [elementKind: string]: PropertiesComponent<T> };
type ElementToReactFlowComponentMapping<T> = { [elementKind: string]: ReactFlowComponent<T> | undefined };
type ElementToNameMapping = { [elementKind: string]: string };
class PolyglotComponentMapping<T, U> {
    private _propertiesMapping: ElementToPropertyComponentMapping<T> = {};
    private _elementMapping: ElementToReactFlowComponentMapping<U> = {};
    private _nameMapping: ElementToNameMapping = {};

    // TODO: stricter type checking on the elementComponent
    // undefined should be allowed if and only if the registered element uses an already built-in ReactFlow type
    public registerMapping(elementKind: string, name: string, propertiesComponent: PropertiesComponent<T>, elementComponent?: ReactFlowComponent<U> | undefined) {
        if (elementKind in this._propertiesMapping) {
            throw new Error(`Element kind ${elementKind} is already registered`);
        }

        console.log("elementKind: " + elementKind + " registered");
        this._propertiesMapping[elementKind] = propertiesComponent;
        this._elementMapping[elementKind] = elementComponent;
        this._nameMapping[elementKind] = name;
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

    getElementPropertiesComponent(elementKind: string | undefined): PropertiesComponent<T> {
        return elementKind !== undefined ? this._propertiesMapping[elementKind] : (props: any) => <></>;
    }
}

const polyglotNodeComponentMapping = new PolyglotComponentMapping<NodePropertiesProps, ReactFlowNodeProps>();
export { polyglotNodeComponentMapping };

const polyglotEdgeComponentMapping = new PolyglotComponentMapping<EdgePropertiesProps, ReactFlowEdgeProps>();
export { polyglotEdgeComponentMapping };