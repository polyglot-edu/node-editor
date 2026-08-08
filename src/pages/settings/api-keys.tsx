import { AddIcon, CheckIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Code,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/NavBars/NavBar';
import { ApiKey, APIV2 } from '../../data/api';
import { authOptions } from '../../utils/authOptions';

type ApiKeysPageProps = {
  accessToken: string | undefined;
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString() : '—';

const ApiKeysPage = ({ accessToken }: ApiKeysPageProps) => {
  const { data: session } = useSession();
  const API = useMemo(() => new APIV2(accessToken), [accessToken]);
  const toast = useToast();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [creating, setCreating] = useState(false);

  // Held only in memory, and only until the reveal modal is dismissed.
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [pendingRevoke, setPendingRevoke] = useState<ApiKey | null>(null);
  const [revoking, setRevoking] = useState(false);

  const reveal = useDisclosure();
  const confirm = useDisclosure();

  const load = useCallback(async () => {
    try {
      const resp = await API.listApiKeys();
      setKeys(resp.data);
    } catch (err) {
      toast({
        title: 'Could not load API keys',
        description: 'Try reloading the page.',
        status: 'error',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [API, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const days = expiresInDays ? Number(expiresInDays) : undefined;
      const resp = await API.createApiKey(name.trim(), days);
      setNewToken(resp.data.token);
      setCopied(false);
      setName('');
      setExpiresInDays('');
      reveal.onOpen();
      await load();
    } catch (err: any) {
      toast({
        title: 'Could not create the key',
        description:
          err?.response?.data?.error ?? 'Unexpected error, please try again.',
        status: 'error',
        duration: 6000,
        position: 'bottom-left',
        isClosable: true,
      });
    } finally {
      setCreating(false);
    }
  };

  const onRevoke = async () => {
    if (!pendingRevoke) return;
    setRevoking(true);
    try {
      await API.revokeApiKey(pendingRevoke._id);
      toast({
        title: 'Key revoked',
        description: `"${pendingRevoke.name}" can no longer be used.`,
        status: 'success',
        duration: 4000,
        position: 'bottom-left',
        isClosable: true,
      });
      confirm.onClose();
      setPendingRevoke(null);
      await load();
    } catch (err) {
      toast({
        title: 'Could not revoke the key',
        status: 'error',
        duration: 5000,
        position: 'bottom-left',
        isClosable: true,
      });
    } finally {
      setRevoking(false);
    }
  };

  const copyToken = async () => {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
  };

  const statusOf = (k: ApiKey) => {
    if (k.revokedAt) return { label: 'Revoked', scheme: 'red' };
    if (k.expiresAt && new Date(k.expiresAt).getTime() <= Date.now())
      return { label: 'Expired', scheme: 'orange' };
    return { label: 'Active', scheme: 'green' };
  };

  return (
    <>
      <Navbar user={session?.user} />

      <Box px={['5%', '10%']} py="5">
        <Heading size="lg" mb="1">
          API keys
        </Heading>
        <Text color="gray.600" mb="6">
          Use a key to call the Polyglot API from scripts and integrations —
          send it as the <Code>x-api-key</Code> header. A key carries your own
          permissions, so treat it like a password.
        </Text>

        <Box borderWidth="1px" borderRadius="md" p="4" mb="8">
          <Heading size="sm" mb="3">
            Create a key
          </Heading>
          <HStack align="flex-end" spacing="4" flexWrap="wrap">
            <FormControl maxW="320px">
              <FormLabel fontSize="sm">Name</FormLabel>
              <Input
                size="sm"
                placeholder="e.g. ci-pipeline"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onCreate()}
              />
              <FormHelperText>How you will recognise it later.</FormHelperText>
            </FormControl>

            <FormControl maxW="200px">
              <FormLabel fontSize="sm">Expires in (days)</FormLabel>
              <Input
                size="sm"
                type="number"
                min={1}
                placeholder="never"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
              />
              <FormHelperText>Leave blank for no expiry.</FormHelperText>
            </FormControl>

            <Button
              size="sm"
              colorScheme="blue"
              leftIcon={<AddIcon />}
              isLoading={creating}
              isDisabled={!name.trim()}
              onClick={onCreate}
              mb="6"
            >
              Create
            </Button>
          </HStack>
        </Box>

        {loading ? (
          <HStack>
            <Spinner size="sm" />
            <Text>Loading keys…</Text>
          </HStack>
        ) : keys.length === 0 ? (
          <Text color="gray.600">
            No keys yet. Create one above to start calling the API.
          </Text>
        ) : (
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Key</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Last used</Th>
                <Th>Expires</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {keys.map((k) => {
                const status = statusOf(k);
                return (
                  <Tr key={k._id}>
                    <Td>{k.name}</Td>
                    <Td>
                      <Code>{k.display}</Code>
                    </Td>
                    <Td>
                      <Badge colorScheme={status.scheme}>{status.label}</Badge>
                    </Td>
                    <Td>{fmt(k.createdAt)}</Td>
                    <Td>{fmt(k.lastUsedAt)}</Td>
                    <Td>{k.expiresAt ? fmt(k.expiresAt) : 'Never'}</Td>
                    <Td textAlign="right">
                      {!k.revokedAt && (
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => {
                            setPendingRevoke(k);
                            confirm.onOpen();
                          }}
                        >
                          Revoke
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* One-time reveal. closeOnOverlayClick is off deliberately: dismissing
          this by accident loses the only copy of the token. */}
      <Modal
        isOpen={reveal.isOpen}
        onClose={() => {
          reveal.onClose();
          setNewToken(null);
        }}
        isCentered
        size="lg"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your new API key</ModalHeader>
          <ModalBody>
            <Alert status="warning" mb="4" borderRadius="md">
              <AlertIcon />
              This is the only time the key is shown. Copy it now — it cannot be
              retrieved later, only revoked and replaced.
            </Alert>
            <HStack>
              <Code
                p="3"
                borderRadius="md"
                w="full"
                wordBreak="break-all"
                fontSize="sm"
              >
                {newToken}
              </Code>
              <IconButton
                aria-label="Copy key"
                icon={copied ? <CheckIcon /> : <CopyIcon />}
                colorScheme={copied ? 'green' : 'gray'}
                onClick={copyToken}
              />
            </HStack>
            {copied && (
              <Text fontSize="sm" color="green.600" mt="2">
                Copied to clipboard.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                reveal.onClose();
                setNewToken(null);
              }}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={confirm.isOpen}
        onClose={() => {
          confirm.onClose();
          setPendingRevoke(null);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Revoke this key?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              <strong>{pendingRevoke?.name}</strong> (
              <Code>{pendingRevoke?.display}</Code>) will stop working
              immediately. Anything using it will start receiving 401 responses.
              This cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter gap="2">
            <Button
              variant="ghost"
              onClick={() => {
                confirm.onClose();
                setPendingRevoke(null);
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="red" isLoading={revoking} onClick={onRevoke}>
              Revoke
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ApiKeysPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  // Managing keys requires a Google session — the backend rejects API keys on
  // these endpoints — so send anonymous visitors to sign in rather than
  // rendering a page that can only fail.
  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(
          '/settings/api-keys'
        )}`,
        permanent: false,
      },
    };
  }

  return { props: { accessToken: session.idToken ?? null } };
};
