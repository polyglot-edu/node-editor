import { Box, Grid, GridItem, Text } from '@chakra-ui/react';

import { useEffect } from 'react';
import DropDownMenu from '../DropDownMenu/DropDownMenu';

type AdvancedSearchProps = {
  //buttonWidth: string; // mi serve per impostare la 'width' fissa dei menuButton in base alla pagina in cui sono
  domain?: string[];
  subject?: string[];
  typeResources?: string[];
  audience?: string[];
};

const ALL = 'All';

export default function AdvancedSearch({
  domain,
  subject,
}: AdvancedSearchProps) {
  //const domain: string[] = ['All', 'Green', 'Digital', 'Entrepreneurship'];
  /*const subject: string[] = [
    'All',
    'Chemistry',
    'History',
    'Mathematics',
    'Psychology',
  ];*/
  const typeResources: string[] = ['All', 'Articles', 'Books', 'Lab', 'Videos'];
  const audience: string[] = [
    'All',
    "1st year Bachelor's",
    "2nd year Bachelor's",
    'Adult education',
    'Professional',
  ];

  useEffect(() => {
    domain?.unshift(ALL);
    subject?.unshift(ALL);
  });

  return (
    <>
      <Box display="flex">
        <Grid
          w="100%"
          templateColumns="repeat(4, 1fr)"
          gap={4}
          flexWrap="nowrap"
        >
          <GridItem w="220px" h="10">
            <Text variant="label" my="6px">
              Domain
            </Text>
            <DropDownMenu options={domain} />
          </GridItem>
          <GridItem w="220px" h="10">
            <Text variant="label" my="6px">
              Subject
            </Text>
            <DropDownMenu options={subject} />
          </GridItem>
          <GridItem w="220px" h="10">
            <Text variant="label" my="6px">
              Type of resources
            </Text>
            <DropDownMenu options={typeResources} />
          </GridItem>
          <GridItem w="220px" h="10">
            <Text variant="label" my="6px">
              Audience
            </Text>
            <DropDownMenu options={audience} />
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
