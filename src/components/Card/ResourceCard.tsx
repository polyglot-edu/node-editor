import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Tag,
  Text,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { BsBookmark } from 'react-icons/bs';
//import icon_calendarCheck from '../../public/icons/icon_CalendarCheck.svg';

export default function ResourceCard() {
  const [showTagDigital, setShowTagDigital] = useState(true);
  const [showTagEntrepreneurial, setShowTagEntrepreneurial] = useState(false);
  const [showTagGreen, setShowTagGreen] = useState(false);

  const digital = 'Digital';
  const entr = 'Entrepreneurship';
  const green = 'Green';
  const skills: string[] = [];
  const authors: string[] = [];
  let string_authors = '';

  useEffect(() => {
    skills.push(digital, entr, green);
    authors.push('Gianni', 'Luca');
    console.log(authors);
    string_authors = authors.join(', ');
    for (let i = 0; i < skills.length; i++) {
      if (skills[i] === digital) {
        setShowTagDigital(true);
      } else if (skills[i] === entr) {
        setShowTagEntrepreneurial(true);
      } else if (skills[i] === green) {
        setShowTagGreen(true);
      }
    }
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  return (
    <>
      <Card w="500px" px="20px" border="0.5px">
        <HStack w="100%">
          <div>{showTagDigital && <Tag bg="lightblue">Digital</Tag>}</div>
          <div>
            {showTagEntrepreneurial && (
              <Tag bg="lightyellow">Entrepreneurial</Tag>
            )}
          </div>
          <div>{showTagGreen && <Tag bg="lightgreen">Green</Tag>}</div>
          <Spacer />
          <Button
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <BsBookmark size={25} />
          </Button>
        </HStack>

        <CardHeader>
          <Heading size="md">Adopting Sustainable Food Practices</Heading>
          <Text>{string_authors}</Text>
        </CardHeader>
        <CardBody>
          <Text>cdcbjscsncjsvncds</Text>
        </CardBody>
        <Divider color="gray.500" />
        <CardFooter>
          <Box display="flex" justifyContent="right">
            <Grid templateColumns="repeat(4, 1fr)" gap={2} w="40%">
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
