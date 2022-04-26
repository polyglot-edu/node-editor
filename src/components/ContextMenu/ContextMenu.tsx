import { ContextualMenu, IContextualMenuItem } from "@fluentui/react";
import { useRef } from "react";
import useStore from "../../store";
import { createNewDefaultPolyglotNode } from "../../utils/utils";

type ContextMenuProps = {
    pos: {
        x: number;
        y: number;
    };
    showing: boolean;
    onDismiss: () => void;
}

const ContextMenu = ({ pos, showing, onDismiss }: ContextMenuProps) => {
    const linkRef = useRef(null);

    const menuItems: IContextualMenuItem[] = [
        {
            key: "new",
            text: "New Node",
            iconProps: { iconName: "Add" },
            onClick: () => {
                const nodeToAdd = createNewDefaultPolyglotNode(pos);
                useStore.getState().addNode(nodeToAdd);
            },
        }
    ]

    return (
        <>
            <span
                className="absolute z-50"
                ref={linkRef}
                style={{ top: pos.y, left: pos.x }}
            />

            <ContextualMenu
                className="pt-2"
                hidden={!showing}
                items={menuItems}
                styles={{ root: { top: pos.y, left: pos.x } }}
                target={linkRef}
                onDismiss={onDismiss}
            />
        </>
    )

};

export default ContextMenu;