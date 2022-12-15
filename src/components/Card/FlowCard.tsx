import { DeleteIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  SpaceProps,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import cardImage from '../../public/test_card.png';
import { PolyglotFlow } from '../../types/polyglotElements';

type FlowCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  canDelete?: boolean;
  setSelected?: (flowId: string) => void;
  flow: PolyglotFlow;
};

const FlowCard = ({ flow, px, py, canDelete, setSelected }: FlowCardProps) => {
  return (
    <LinkBox px={px} py={py}>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: '100%', sm: '200px' }}
          src={cardImage.src}
          alt="Flow card"
        />

        <Stack w="full">
          <CardBody>
            {canDelete && (
              <Button
                zIndex={11}
                position="absolute"
                top={4}
                right={5}
                variant="unstyled"
              >
                <Tooltip label="Delete" placement="right">
                  <DeleteIcon
                    onClick={() => setSelected?.(flow._id!)}
                    w={5}
                    h={5}
                    color="red"
                  />
                </Tooltip>
              </Button>
            )}
            <Heading size="md">{flow.title}</Heading>
            {flow.tags &&
              flow.tags.map((tag, id) => (
                <Badge key={id} mr={1} colorScheme={tag.color}>
                  {tag.name}
                </Badge>
              ))}
            <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
              {flow.description}
            </Text>
          </CardBody>

          <CardFooter>
            {!canDelete && (
              <>
                <Spacer />
                <HStack pl={5} spacing="2" align="center" h="full">
                  <Text fontSize={'xs'}>{flow.author?.username}</Text>
                  <Avatar name={flow.author?.username} size="sm" />
                </HStack>
              </>
            )}
          </CardFooter>
        </Stack>
      </Card>
      <LinkOverlay href={`/flows/${flow._id}`} />
    </LinkBox>
  );
};

export default FlowCard;

export function ScheletonFlowCards() {
  return (
    <div className="animate-pulse bg-gray-300 w-2/3 h-12 p-3 rounded"></div>
  );
}
