import { Button, useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { MdBuild } from 'react-icons/md';
import ConceptBuilderModal from '../../Modals/ConceptBuilder';
import NodeProperties from './NodeProperties';

const AbstractNodeProperties = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register } = useFormContext();

  useEffect(() => {
    register('data.conceptmap');
  }, [register]);

  return (
    <>
      <NodeProperties />
      <ConceptBuilderModal isOpen={isOpen} onClose={onClose} />
      <Button mt={4} leftIcon={<MdBuild />} onClick={onOpen}>
        Concept builder
      </Button>
    </>
  );
};

export default AbstractNodeProperties;
