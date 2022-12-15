import { Stack } from '@fluentui/react';
import { Children } from 'react';
import EdgeProperties from '../EdgeProperties/EdgeProperties';
import FlowProperties from '../FlowProperties/FlowProperties';
import NodeProperties from '../NodeProperties/NodeProperties';

type PropertiesStackProps = {};

const PropertiesStack = ({
  children,
}: React.PropsWithChildren<PropertiesStackProps>) => {
  return (
    <Stack
      tokens={{ childrenGap: 15 }}
      className="my-4 pr-3 h-full overflow-y-scroll"
    >
      <FlowProperties />
      <NodeProperties />
      <EdgeProperties />
      {Children.map(children, (c) => (
        <>{c}</>
      ))}
    </Stack>
  );
};

export default PropertiesStack;
