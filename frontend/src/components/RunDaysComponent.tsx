import React, { useState } from "react";
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Heading,
  Image,
  Link,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";

const RunDaysComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const locations = {
    henryAndSallys: {
      name: "Henry & Sally's",
      address: "Møllergata 23, 0179 Oslo, Norway",
      googleMapsUrl:
        "https://maps.google.com/maps?q=Henry+%26+Sally%27s,+Møllergata+23,+0179+Oslo,+Norway",
      coordinates: { lat: 59.9183, lng: 10.7506 },
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1000.15!2d10.7506!3d59.9183!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTnCsDU1JzA2LjEiTiAxMMKwNDUnMDIuMiJF!5e0!3m2!1sen!2sno!4v1642680000000!5m2!1sen!2sno",
      description: "Cozy pub with the best beer in town.",
    },
    bislettStadion: {
      name: "Bislett Stadion",
      address: "Bislett, 0176 Oslo, Norway",
      googleMapsUrl:
        "https://maps.google.com/maps?q=Bislett+Stadion,+Bislett,+0176+Oslo,+Norway",
      coordinates: { lat: 59.9267, lng: 10.7345 },
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1000.08!2d10.7345!3d59.9267!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTnCsDU1JzM2LjEiTiAxMMKwNDQnMDQuMiJF!5e0!3m2!1sen!2sno!4v1642680000001!5m2!1sen!2sno",
      description:
        "Historic athletics stadium, home to world-class track and field events.",
    },
  };

  const runDays = [
    {
      day: "Mondays",
      title: "Beginner's Joy Run",
      description:
        "Join us by running a gentle 3km, 5km or 7km to ease into the week. We will run in several pace groups, so everyone can join. Join a group with a distance and pace that you can keep up with so you can socialise, or pick a group that will challenge you - and upon return at the bar, you have the chance to buy a beer (or several) and mingle with all other runners. Join us!",
      place: "Where?",
      location: locations.henryAndSallys,
      time: "When? 18:00",
      detailUrl: "/runs/monday",
      imageUrl: "images/MondayRun.jpg",
    },
    {
      day: "Thursdays",
      title: "Track Intervalls",
      place: "Where?",
      location: locations.bislettStadion,
      time: "When? 19:30",
      detailUrl: "/runs/thursday",
      description:
        "Short runs to become a better & faster runner, but still a social training: This is MRC's Thursday Track Attack; intervals & Core! No matter how fast/slow/(un)trained you are, you can always run short distances on a 'heavy breathing' level to improve your fitness! We will create two sessions; one for short intervals (up to 400m.) and one for long intervals (from 400m).",
      imageUrl: "images/thursdayRun.jpg",
    },
    {
      day: "Sundays",
      title: "Long Run Sunday",
      place: "Where?",
      location: locations.henryAndSallys,
      time: "When? 11:00",
      detailUrl: "/runs/sunday",
      description:
        "Sundays are for long runs! And what better way to do it than with your friends from MRC Oslo!  If you want to join for a part of the run, that is possible too, just let us know where you will join in or drop out, and we will look out for you! We will try to accommodate everyone, and therefor have two different pace groups! One around 5:30 per km, and a group around 6:30 per km!",
      imageUrl: "images/sundayRun.jpg",
    },
  ];

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    onOpen();
  };

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
          (
            {
              day,
              title,
              description,
              imageUrl,
              place,
              location,
              time,
              detailUrl,
            },
            index
          ) => (
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
                width="100%"
                height="150px"
                objectFit="cover"
              />
              <Heading size="lg">{day}</Heading>
              <Text fontSize="xl" fontWeight="bold" mt={2}>
                {title}
              </Text>
              <Text mt={2}>{description}</Text>

              {/* Location Section */}
              <VStack spacing={2} mt={4}>
                <Text>
                  <strong>{place}</strong>
                </Text>
                <HStack spacing={2} align="center">
                  <Icon as={FaMapMarkerAlt} color="#204081" />
                  <VStack spacing={1} align="center">
                    <Text
                      fontWeight="bold"
                      color="#204081"
                      cursor="pointer"
                      textDecoration="underline"
                      onClick={() => handleLocationClick(location)}
                      _hover={{ color: "#2a4f9f" }}
                    >
                      {location.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {location.address}
                    </Text>
                  </VStack>
                </HStack>

                {/* Quick Actions */}
                <HStack spacing={2} mt={2}>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    variant="outline"
                    leftIcon={<FaMapMarkerAlt />}
                    onClick={() => handleLocationClick(location)}
                  >
                    View Map
                  </Button>
                  <Button
                    as={Link}
                    href={location.googleMapsUrl}
                    target="_blank"
                    size="xs"
                    colorScheme="green"
                    variant="outline"
                    leftIcon={<FaExternalLinkAlt />}
                  >
                    Directions
                  </Button>
                </HStack>
              </VStack>

              <Text mt={4}>
                <strong>{time}</strong>
              </Text>
              <Button
                as={RouterLink}
                to={detailUrl}
                mt={4}
                marginTop={"30px"}
                position="unset"
                backgroundColor="#204081"
                color="#D5B2D3"
                size="lg"
                marginBottom={"30px"}
              >
                Learn More
              </Button>
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

      {/* Map Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FaMapMarkerAlt} color="#204081" />
              <Text>{selectedLocation?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {selectedLocation?.address}
                </Text>
                <Text fontSize="sm">{selectedLocation?.description}</Text>
              </Box>

              <Divider />

              {/* Embedded Map */}
              <Box>
                <iframe
                  src={selectedLocation?.embedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: "8px" }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>

              <HStack spacing={2} justify="center">
                <Button
                  as={Link}
                  href={selectedLocation?.googleMapsUrl}
                  target="_blank"
                  leftIcon={<FaExternalLinkAlt />}
                  colorScheme="blue"
                  size="sm"
                >
                  Open in Google Maps
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RunDaysComponent;
