import React from "react";
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Heading,
  Image,
} from "@chakra-ui/react";

const RunDaysComponent = () => {
  const runDays = [
    {
      day: "Mondays",
      title: "Beginner’s Joy Run",
      description:
        "Join us by running a gentle 3km, 5km or 7km to ease into the week. We will run in several pace groups, so everyone can join. Join a group with a distance and pace that you can keep up with so you can socialise.",
      place: "Where? Henry & Sally's",
      time: "When? 6:30 PM",
      imageUrl: "images/MondayRun.jpg", // Replace with your image URL
    },
    {
      day: "Thursdays",
      title: "Track Intervalls",
      place: "Where? Bislett Stadion",
      time: "When? 6:30 PM",
      description:
        "Short runs to become a better & faster runner, but still a social training: This is MRC's Thursday Track Attack; intervals & Core! No matter how fast/slow/(un)trained you are, you can always run short distances on a 'heavy breathing' level to improve your fitness! We will create two sessions; one for short intervals (up to 400m.) and one for long intervals (from 400m).",
      imageUrl: "images/thursdayRun.jpg", // Replace with your image URL
    },
    {
      day: "Sundays",
      title: "Long Run Sunday",
      place: "Where? Henry & Sally's",
      time: "When? 6:30 PM",
      description:
        "Sundays are for long runs! And what better way to do it than with your friends from MRC Oslo!  If you want to join for a part of the run, that is possible too, just let us know where you will join in or drop out, and we will look out for you! We will try to accommodate everyone, and therefor have two different pace groups! One around 5:30 per km, and a group around 6:30 per km!",
      imageUrl: "images/sundayRun.jpg", // Replace with your image URL
    },
  ];

  return (
    <Box
      p={8}
      textAlign="center"
      alignContent={"center"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
      id="regular-runs"
    >
      <Heading marginBottom={"30px"} as={"h2"}>
        Our reoccuring runs each week
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} maxW={"1000px"}>
        {runDays.map(
          ({ day, title, description, imageUrl, place, time }, index) => (
            <Box
              key={index}
              p={5}
              shadow="lg"
              borderWidth="1px"
              borderRadius="lg"
            >
              <Image
                src={imageUrl}
                alt={day}
                borderRadius="md"
                mb={4}
                width="100%" // Makes the image width responsive to the container width
                height="150px" // Sets a fixed height for all images
                objectFit="cover" // Ensures the image covers the area without distorting aspect ratio
              />
              <Heading size="lg">{day}</Heading>
              <Text fontSize="xl" fontWeight="bold" mt={2}>
                {title}
              </Text>
              <Text mt={2}>{description}</Text>
              <Text mt={2}>
                <strong>{place}</strong>
              </Text>
              <Text mt={2}>
                <strong>{time}</strong>
              </Text>
            </Box>
          )
        )}
      </SimpleGrid>
      <Button
        marginTop={"30px"}
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
        Click "going"
      </Button>
      <Text>
        Please click "going" on Facebook, as it helps us to prepare accordingly!
      </Text>
    </Box>
  );
};

export default RunDaysComponent;
