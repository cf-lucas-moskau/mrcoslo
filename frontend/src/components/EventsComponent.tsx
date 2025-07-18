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
  // Commented out for future use when backend is working
  /*
  const [events, setEvents] = useState<
    {
      title: string;
      time: string;
      date: string;
      location: string;
      description: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Option 1: Static events data (replace with your actual events)
    const staticEvents = [
      {
        title: "Monday Social Run",
        time: "18:00",
        date: "Every Monday",
        location: "Henry & Sally's",
        description: "Join us for a social run with multiple pace groups. Perfect for all levels!"
      },
      {
        title: "Thursday Track Attack",
        time: "19:30", 
        date: "Every Thursday",
        location: "Bislett Stadion",
        description: "Interval training sessions to improve your speed and fitness."
      },
      {
        title: "Sunday Long Run",
        time: "11:00",
        date: "Every Sunday", 
        location: "Henry & Sally's",
        description: "Long distance social runs with multiple pace groups."
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setEvents(staticEvents);
      setIsLoading(false);
    }, 500);

    // Option 2: Keep trying your backend (uncomment if you want to keep it)
    // fetch("https://backend.aumueller-druck.de/employees/mrcoslo")
    //   .then((response) => {
    //     console.log(response);
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (data && data.length > 0) {
    //       setEvents(data);
    //     } else {
    //       // Fallback to static events if backend returns empty
    //       setEvents(staticEvents);
    //     }
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching events:", error);
    //     // Fallback to static events on error
    //     setEvents(staticEvents);
    //     setIsLoading(false);
    //   });
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
  */

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
        Upcoming Events
      </Heading>
      <Text fontSize="lg" color="gray.600" mb={6} maxW="600px">
        Stay up to date with all our latest events and activities! Check out our
        Facebook page for the most current event listings, times, and details.
      </Text>
      <Button
        as="a"
        position="unset"
        href="https://www.facebook.com/mrcosl/events"
        target="_blank"
        rel="noreferrer"
        backgroundColor="#204081"
        color="#D5B2D3"
        size="lg"
        marginBottom={"30px"}
      >
        View All Events on Facebook
      </Button>

      {/* Commented out events display for future use */}
      {/*
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
      */}
    </Box>
  );
};

export default EventsComponent;
