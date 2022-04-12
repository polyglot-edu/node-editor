import { Stack, StackItem } from "@fluentui/react"
import { Children } from "react"
import EdgeProperties from "../EdgeProperties/EdgeProperties"
import NodeProperties from "../NodeProperties/NodeProperties"
import "./PropertiesStack.css"

type PropertiesStackProps = {
    // TODO: any should be specialized here
    // children?: ((...args: any[]) => JSX.Element)[] | undefined
    height?: string | number | undefined
}

const PropertiesStack = ({ children, height }: React.PropsWithChildren<PropertiesStackProps>) => {

    return (
        <Stack tokens={{ childrenGap: 15 }} style={{ height: height, paddingRight: 10 }} className="my-[15px] overflow-y-scroll">
            <NodeProperties />
            <EdgeProperties />
            {/* {children?.map(C => <StackItem><C /></StackItem>)} */}
            {Children.map(children, c => <StackItem>{c}</StackItem>)}
        </Stack>
    )
}

export default PropertiesStack;