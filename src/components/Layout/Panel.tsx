import { Box } from '@chakra-ui/react';

export type PanelProps = {
  width?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  hidden?: boolean;
  children?: React.ReactNode;
};

const Panel = ({ children, hidden, isOpen, width }: PanelProps) => {
  return (
    <Box
      hidden={hidden || !isOpen}
      width={width || '40%'}
      maxHeight={'100vh'}
      p="5"
      overflowY="auto"
      overflowX="hidden"
      shadow={'md'}
    >
      {children}
    </Box>
  );
};

export default Panel;
