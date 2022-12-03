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
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import cardImage from '../../public/test_card.png';
import { PolyglotFlow } from '../../types/polyglotElements';

type FlowCardProps = {
  flow: PolyglotFlow;
};

const FlowCard = ({ flow }: FlowCardProps) => {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '200px' }}
        src={cardImage.src}
        alt="Caffe Latte"
      />

      <Stack>
        <CardBody>
          <LinkBox>
            <LinkOverlay href={`/flows/${flow._id}`} />
            <Heading size="md">{flow.title}</Heading>
            <Badge colorScheme="green">New</Badge>
            <Badge ml={1} colorScheme="red">
              FBK
            </Badge>
            <Text pt={2} whiteSpace={'pre-wrap'} noOfLines={3}>
              {flow.description +
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum porta sagittis. Nullam eu dapibus sapien, at pharetra odio. Phasellus quis lorem sit amet arcu mattis volutpat sit amet finibus est. Morbi efficitur volutpat neque sit amet auctor. Vestibulum nec iaculis mi, sed vestibulum sapien. Vestibulum facilisis pulvinar tempus. Mauris non magna enim. Phasellus vulputate nisl ut mollis egestas. Morbi semper vehicula orci, sit amet tincidunt sapien consequat in. Pellentesque sodales gravida lorem ac rutrum. Curabitur convallis vel lacus a semper. Morbi lobortis fermentum lorem, et lacinia arcu venenatis in. Fusce pulvinar neque diam, in vulputate sem porta vitae. Donec euismod ex at ante commodo, non euismod nisl ultricies.'}
            </Text>
          </LinkBox>
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
  );
};

export default FlowCard;

export function ScheletonFlowCards() {
  return (
    <div className="animate-pulse bg-gray-300 w-2/3 h-12 p-3 rounded"></div>
  );
}
