import {
  Box,
  Button,
  Center,
  Input,
  Spacer,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { API } from '../../../data/api';
import useStore from '../../../store';

const FileUploadDownload = ({ nodeId }: { nodeId: string }) => {
  const [file, setFile] = useState(null);
  const toast = useToast();
  const { getNodes } = useStore((store) => ({
    getNodes: store.reactFlowNodes,
  }));
  const nodeId2 = getNodes();
  console.log(nodeId2);
  // Gestione del file selezionato
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  // Funzione per l'upload
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Seleziona un file e inserisci un ID nodo.',
        status: 'warning',
      });
      return;
    }
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Il file selezionato non è un PDF.',
        status: 'warning',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      API.uploadFile({
        nodeId,
        file: formData,
      }).then((resp) =>
        toast({
          title: 'File caricato con successo.\n' + resp.data,
          status: 'success',
        })
      );
    } catch (error) {
      toast({
        title: 'Errore durante il caricamento del file.',
        status: 'error',
      });
    }
  };

  // Funzione per il download
  const handleDownload = async () => {
    try {
      const response = await API.downloadFile({ nodeId });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', 'uploadedFile.pdf');

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: 'Errore durante il download del file.', status: 'error' });
    }
  };

  return (
    <VStack spacing={4} p={6} maxW="500px" mx="auto">
      <Box>
        <Input type="file" onChange={handleFileChange} mb={4} />
      </Box>
      <Center width={'80%'}>
        <Button colorScheme="teal" onClick={handleUpload} width="40%">
          Carica File
        </Button>
        <Spacer />
        <Button colorScheme="blue" onClick={handleDownload} width="40%">
          Scarica File
        </Button>
      </Center>
      <Text hidden={file == null}>File selezionato: {file && file.name}</Text>
    </VStack>
  );
};

export default FileUploadDownload;
