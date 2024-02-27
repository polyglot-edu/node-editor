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
    register('data.execution.concepts');
    register('data.execution.numOfRes');
    register('data.execution.bloom_lv');
    register('data.execution.resType');
  }, [register]);

  return (
    <>
      <NodeProperties platform={['VSCode', 'WebApp']} />
      <ConceptBuilderModal isOpen={isOpen} onClose={onClose} />
      <Button mt={4} leftIcon={<MdBuild />} onClick={onOpen}>
        Concept builder
      </Button>
    </>
  );
};

export default AbstractNodeProperties;
