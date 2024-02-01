/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-undef */
import { ArrowUpIcon } from '@chakra-ui/icons';
import { Button, Tooltip } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { Form, useFormContext } from 'react-hook-form';
import useStore from '../../store';
import { useHasHydrated } from '../../utils/utils';

const [publishLoading, setPublishLoading] = useState(false);
const publishButton = ({}: {}) => {
  const hydrated = useHasHydrated();
  const [
    updateFlowInfo,
    checkSave,
    checkForwardAction,
    checkBackAction,
    flow,
    backAction,
    forwardAction,
  ] = useStore((state) => [
    state.updateFlowInfo,
    state.checkSave(),
    state.checkForwardAction(),
    state.checkBackAction(),
    state.getFlow(),
    state.backAction,
    state.forwardAction,
  ]);
  const { register, setValue, getValues } = useFormContext();

  function publishFunc() {
    const data = getValues('data');
    console.log(data);
    return;
  }
  return (
    <Form>
      <ActionButton
        label="Publish"
        disabled={hydrated ? !checkSave : true}
        onClick={async () => {
          //idea: popup to show "are u sure u want..."
          //run save-> then run check if correct info

          setPublishLoading(true);
          await publishFunc();
          setPublishLoading(false);
          return;
        }}
        icon={<ArrowUpIcon w={6} h={6} color="blue.500" />}
        isLoading={publishLoading}
      />
    </Form>
  );
};

const ActionButton = ({
  label,
  disabled,
  onClick,
  icon,
  isLoading,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  icon: ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <Tooltip label={label}>
      <Button
        isLoading={isLoading}
        disabled={disabled}
        padding={0}
        background="transparent"
        onClick={onClick}
      >
        {icon}
      </Button>
    </Tooltip>
  );
};

export default publishButton;
