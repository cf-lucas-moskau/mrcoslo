import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  Spinner,
  Center,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
const EventsComponent = () => {
  const [events, setEvents] = useState<
    {
      title: string;
      time: string;
      date: string;
      location: string;
      description: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    fetch("https://backend.aumueller-druck.de/employees/mrcoslo")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setIsLoading(false); // Set loading to false once data is received
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setIsLoading(false); // Also set loading to false in case of error
      });
  }, []);

  if (isLoading) {
    return (
      <Center padding="40px">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box
      id="facebook-events"
      p={8}
      textAlign="center"
      alignContent={"center"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Heading marginBottom={"30px"} as={"h2"}>
        Upcoming Facebook Events
      </Heading>
      <Button
        as="a"
        position="unset"
        href="https://www.facebook.com/pg/mrcosl/events/"
        target="_blank"
        rel="noreferrer"
        backgroundColor="#204081"
        color="#D5B2D3"
        size="lg"
        marginBottom={"30px"}
      >
        View All Events
      </Button>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="40px" maxW={"1200px"}>
        {events.map((event, index) => (
          <Box
            key={index}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <Heading fontSize="xl">{event.title}</Heading>
            <Text mt={4}>Date: {event.date}</Text>
            {event.time && <Text>Time: {event.time}</Text>}
            <Text>Location: {event.location}</Text>
            {event.description && (
              <Text mt={2} fontStyle="italic">
                Description: {event.description}
              </Text>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default EventsComponent;
