import {
  Avatar,
  Badge,
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
} from '@chakra-ui/react';
import cardImage from '../../public/test_card.png';
import { PolyglotFlow } from '../../types/polyglotElements';

type FlowCardProps = {
  py?: SpaceProps['py'];
  px?: SpaceProps['px'];
  flow: PolyglotFlow;
};

const FlowCard = ({ flow, px, py }: FlowCardProps) => {
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
            <Heading size="md">{flow.title}</Heading>
            <Badge colorScheme="green">New</Badge>
            <Badge ml={1} colorScheme="red">
              FBK
            </Badge>
            <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
              {flow.description}
            </Text>
          </CardBody>

          <CardFooter>
            <Spacer />
            <HStack pl={5} spacing="2" align="center" h="full">
              <Text fontSize={'xs'}>{flow.author?.username}</Text>
              <Avatar name={flow.author?.username} size="sm" />
            </HStack>
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
