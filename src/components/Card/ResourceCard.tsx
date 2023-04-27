import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react';

export default function ResourceCard() {
  return (
    <>
      <Card w="30%">
        <CardHeader>
          <Heading size="md">Adopting Sustainable Food Practices</Heading>
        </CardHeader>
        <CardBody>
          <Text>cdcbjscsncjsvncds</Text>
        </CardBody>
        <Divider color="gray.500" />
        <CardFooter>
          <Box>
            <Grid templateColumns="repeat(4, 1fr)" gap={2}>
              <GridItem w="100%">
                <Text fontSize="smaller" align="center" py="1">
                  Last Update
                </Text>
              </GridItem>
              <GridItem w="100%">
                <Text fontSize="smaller" align="center" py="1">
                  Used
                </Text>
              </GridItem>
              <GridItem w="100%">
                <Text fontSize="smaller" align="center" py="1">
                  Liked
                </Text>
              </GridItem>
              <GridItem w="100%">
                <Text fontSize="smaller" align="center" py="1">
                  Quality
                </Text>
              </GridItem>
            </Grid>
          </Box>
        </CardFooter>
      </Card>
    </>
  );
}
