import {
  Avatar,
  Badge,
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react';
import cardImage from '../../public/test_card.png';
import { PolyglotFlow } from '../../types/polyglotElements';

type FlowCardProps = {
  flow: PolyglotFlow;
};

export default function FlowCard({ flow }: FlowCardProps) {
  return (
    <LinkBox width={['100%', '80%', '70%', '60%', '50%']}>
      <Grid
        templateRows="repeat(5, 1fr)"
        templateColumns="repeat(5, 1fr)"
        rounded="lg"
        borderWidth={1}
        shadow="lg"
      >
        <GridItem rowSpan={5} colSpan={2}>
          <Box
            h="full"
            backgroundImage={"url('" + cardImage.src + "')"}
            backgroundPosition="center"
            backgroundSize={'cover'}
            roundedLeft="lg"
          />
        </GridItem>

        <GridItem colSpan={3}>
          <Box pl={5} as="b" lineHeight="10" h="full" fontSize={'lg'}>
            {flow.title}
          </Box>
        </GridItem>

        <GridItem colSpan={3} pl={5}>
          <Badge colorScheme="green">New</Badge>
          <Badge ml={1} colorScheme="red">
            FBK
          </Badge>
        </GridItem>

        <GridItem rowSpan={2} colSpan={3}>
          <Text color={'gray.500'} pl={5} noOfLines={[1, 2, 3]}>
            {flow.description}
          </Text>
        </GridItem>

        <GridItem colSpan={3}>
          <Flex pr="3">
            <Spacer />
            <HStack pl={5} spacing="2" align="center" h="full">
              <Text fontSize={'xs'}>Davide Frageri</Text>
              <Avatar name="Davide Frageri" size="sm" />
            </HStack>
          </Flex>
        </GridItem>
      </Grid>
      <LinkOverlay href={`/flows/${flow._id}`} />
    </LinkBox>
  );
}

export function ScheletonFlowCards() {
  return (
    <div className="animate-pulse bg-gray-300 w-2/3 h-12 p-3 rounded"></div>
  );
}
