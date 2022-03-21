import { Stack, StackItem, Label, TextField } from "@fluentui/react"
import { Children } from "react"
import Card from "../Card/Card"
import "./PropertiesStack.css"

type PropertiesStackProps = {}

const PropertiesStack = ({ children }: React.PropsWithChildren<PropertiesStackProps>) => {
    return (
        <Stack tokens={{ childrenGap: 15 }} style={{ marginTop: 15 }}>
            {Children.map(children, c => <StackItem>{c}</StackItem>)}
        </Stack>
    )
}

export default PropertiesStack;