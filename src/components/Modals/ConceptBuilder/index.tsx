import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
} from '@chakra-ui/react';
import { useState } from 'react';
import ConceptGraph from './ConceptGraph';
import TopicForm from './TopicForm';

type ConceptBuilderModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/* 
Aggiungere tipologia di attività in esecuzione

Lavorare su grafo concetti (modifica + first template), capire keyword da utilizzare/natura

selezione nodi da eseguire
setup vincoli di esecuzione come numero di esercizi per concetto e tipologia, etc.

creazione dataset in 3 step concept graph builder, resource builder e esecuzione setup
*/
const ConceptBuilderModal = ({ isOpen, onClose }: ConceptBuilderModalProps) => {
  const [phase, setPhase] = useState(1);
  const [concept, setConcept] = useState('');
  const [graphDepth, setGraphDepth] = useState(1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'6xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={27}>
          {phase === 1
            ? 'Concept Map generation setup (1 of 2)'
            : phase === 2
            ? 'View the concept graph (2 of 2)'
            : 'Invalid phase'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Progress hasStripe value={(phase * 100) / 2} mb={4} size="sm" />
          {phase == 1 ? (
            <TopicForm
              concept={concept}
              graphDepth={graphDepth}
              setConcept={setConcept}
              setGraphDepth={setGraphDepth}
            />
          ) : phase == 2 ? (
            <ConceptGraph concept={concept} graphDepth={graphDepth} />
          ) : null}
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            loadingText="Creating"
            colorScheme="blue"
            onClick={() => {
              setPhase(phase - 1);
            }}
            mr={2}
            disabled={phase <= 1}
          >
            Back
          </Button>
          {phase == 2 ? (
            <Button
              type="submit"
              loadingText="Creating"
              colorScheme="green"
              onClick={() => {
                setPhase(1);
                onClose();
              }}
            >
              Done
            </Button>
          ) : (
            <Button
              type="submit"
              loadingText="Creating"
              colorScheme="blue"
              variant="outline"
              onClick={() => {
                setPhase(phase + 1);
              }}
            >
              Next
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConceptBuilderModal;
