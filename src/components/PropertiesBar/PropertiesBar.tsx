import { DefaultButton, Text, useTheme } from '@fluentui/react';
import Editor from '@monaco-editor/react';
import useStore from '../../store';
import {
  polyglotEdgeComponentMapping,
  polyglotNodeComponentMapping,
} from '../../types/polyglotElements';
import { useToggleCSSVariable } from '../../utils/utils';
import PropertiesStack from '../PropertiesStack/PropertiesStack';

type PropertiesBarProps = {};

const PropertiesBar = ({
  children,
}: React.PropsWithChildren<PropertiesBarProps>) => {
  const [selectedNode, selectedEdge] = useStore((state) => [
    state.getSelectedNode(),
    state.getSelectedEdge(),
  ]);
  // const { index, toggle: toggleSidebarWidth } = useToggleCSSVariable("--properties-bar-width", ["550px", "600px"]);
  const icons = ['Code', 'SidePanelMirrored'];
  const theme = useTheme();

  function isCodeMode() {
    return false;
  }

  const propertiesKindText = selectedNode
    ? 'Node'
    : selectedEdge
    ? 'Edge'
    : 'Flow';

  function getEditor(): JSX.Element {
    let value = {};

    // apply transformation before displaying json
    if (selectedNode) {
      value = polyglotNodeComponentMapping.applyTransformFunction(selectedNode);
    } else if (selectedEdge) {
      value = polyglotEdgeComponentMapping.applyTransformFunction(selectedEdge);
    } else {
      const flow = useStore.getState().getFlow()!;
      flow.nodes = flow.nodes.map((e) =>
        polyglotNodeComponentMapping.applyTransformFunction(e)
      );
      flow.edges = flow.edges.map((e) =>
        polyglotEdgeComponentMapping.applyTransformFunction(e)
      );
      value = flow;
    }

    return (
      <Editor
        className="pb-3"
        options={{
          readOnly: true,
        }}
        height={`calc(100% - ${
          document.getElementById('PropertiesBarHeader')?.clientHeight
        }px)`}
        language="json"
        value={JSON.stringify(value, null, 4) ?? ''}
      />
    );
  }

  return (
    <div
      id="PropertiesBar"
      className={`flex flex-col w-1/4 p-2 h-screen ease-in-out duration-300`}
      style={{ backgroundColor: theme.palette.neutralLighterAlt }}
    >
      <div id="PropertiesBarHeader" className="p-5">
        <Text variant="xxLarge">{propertiesKindText} Properties</Text>
        <DefaultButton
          toggle
          checked={false}
          iconProps={{ iconName: icons[0] }}
          onClick={() => {}}
          style={{ float: 'right' }}
        />
      </div>
      {isCodeMode() ? (
        getEditor()
      ) : (
        <PropertiesStack>{children}</PropertiesStack>
      )}
    </div>
  );
};

export default PropertiesBar;
