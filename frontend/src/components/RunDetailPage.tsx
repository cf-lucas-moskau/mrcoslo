import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Divider,
  SimpleGrid,
  Image,
  Icon,
  HStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaClock, FaRunning, FaUsers } from "react-icons/fa";

const RunDetailPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { day } = useParams<{ day: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = React.useState("");

  // This is a placeholder for the actual data fetching logic
  const getRunDetails = (day: string) => {
    const runDetails = {
      monday: {
        title: "Beginner's Joy Run",
        time: "18:00",
        distance: "3km, 5km or 7km",
        meetingPoint: "Henry & Sally's",
        description:
          "Join us by running a gentle 3km, 5km or 7km to ease into the week. We will run in several pace groups, so everyone can join. Join a group with a distance and pace that you can keep up with so you can socialise, or pick a group that will challenge you - and upon return at the bar, you have the chance to buy a beer (or several) and mingle with all other runners.",
        paceGroups: ["Beginner friendly", "Multiple pace groups available"],
        whatToBring: [
          "Running shoes",
          "Weather-appropriate clothing",
          "Water bottle",
          "Money for post-run drinks (optional)",
          "Good mood",
        ],
        routeDescription:
          "We offer multiple route options to accommodate different distances (3km, 5km, and 7km). All routes are carefully chosen to be beginner-friendly while still offering a good workout. Routes start and end at Henry & Sally's.",
        photos: [
          "/images/monday-run-1.jpg",
          "/images/monday-run-2.jpg",
          "/images/monday-run-3.jpg",
          "/images/monday-run-4.jpg",
          "/images/monday-run-5.jpg",
          "/images/monday-run-6.jpg",
        ],
      },
      thursday: {
        title: "Track Intervalls",
        time: "19:30",
        distance: "Varies",
        meetingPoint: "Bislett Stadion",
        description:
          "Short runs to become a better & faster runner, but still a social training: This is MRC's Thursday Track Attack; intervals & Core! No matter how fast/slow/(un)trained you are, you can always run short distances on a 'heavy breathing' level to improve your fitness! We will create two sessions; one for short intervals (up to 400m.) and one for long intervals (from 400m).",
        paceGroups: [
          "Short intervals group (up to 400m)",
          "Long intervals group (400m+)",
        ],
        whatToBring: [
          "Running shoes",
          "Weather-appropriate clothing",
          "Water bottle",
          "Timer/Watch",
          "Energy for intervals!",
        ],
        routeDescription:
          "Training takes place at the historic Bislett Stadium. The session is split into two groups - one focusing on short, explosive intervals up to 400m, and another group working on longer intervals. Both sessions include proper warm-up and cool-down.",
        photos: [
          "/images/thursday-run-1.jpg",
          "/images/thursday-run-2.jpg",
          "/images/thursday-run-3.jpg",
          "/images/thursday-run-4.jpg",
          "/images/thursday-run-5.jpg",
          "/images/thursday-run-6.jpg",
        ],
      },
      sunday: {
        title: "Long Run Sunday",
        time: "11:00",
        distance: "Varies based on group",
        meetingPoint: "Henry & Sally's",
        description:
          "Sundays are for long runs! And what better way to do it than with your friends from MRC Oslo! If you want to join for a part of the run, that is possible too, just let us know where you will join in or drop out, and we will look out for you! We will try to accommodate everyone, and therefore have two different pace groups!",
        paceGroups: ["5:30 per km", "6:30 per km"],
        whatToBring: [
          "Running shoes",
          "Weather-appropriate clothing",
          "Water bottle",
          "Energy snacks for long run",
          "Good spirits",
        ],
        routeDescription:
          "Our Sunday routes are designed for longer distances, perfect for marathon training or building endurance. We have two pace groups to ensure everyone can find their comfortable pace. Routes vary weekly but always start and end at Henry & Sally's.",
        photos: [
          "/images/sunday-run-1.jpg",
          "/images/sunday-run-2.jpg",
          "/images/sunday-run-3.jpg",
          "/images/sunday-run-4.jpg",
          "/images/sunday-run-5.jpg",
          "/images/sunday-run-6.jpg",
        ],
      },
    };

    return runDetails[day as keyof typeof runDetails] || null;
  };

  const runInfo = getRunDetails(day?.toLowerCase() || "");

  if (!runInfo) {
    return (
      <Container maxW="container.xl" py={10}>
        <Heading>Run Not Found</Heading>
        <Text>Sorry, we couldn't find information for this run day.</Text>
      </Container>
    );
  }

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={10} align="stretch">
        {/* Header Section */}
        <Box textAlign="center" pb={6}>
          <Heading size="2xl" mb={4}>
            {runInfo.title}
          </Heading>
          <Text fontSize="xl" color="gray.600">
            {runInfo.description}
          </Text>
        </Box>

        <Divider />

        {/* Key Information Section */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
            <HStack spacing={4}>
              <Icon as={FaClock} w={6} h={6} color="#204081" />
              <Box>
                <Heading size="sm">Time</Heading>
                <Text mt={2}>{runInfo.time}</Text>
              </Box>
            </HStack>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
            <HStack spacing={4}>
              <Icon as={FaRunning} w={6} h={6} color="#204081" />
              <Box>
                <Heading size="sm">Distance</Heading>
                <Text mt={2}>{runInfo.distance}</Text>
              </Box>
            </HStack>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
            <HStack spacing={4}>
              <Icon as={FaMapMarkerAlt} w={6} h={6} color="#204081" />
              <Box>
                <Heading size="sm">Meeting Point</Heading>
                <Text mt={2}>{runInfo.meetingPoint}</Text>
              </Box>
            </HStack>
          </Box>

          <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
            <HStack spacing={4}>
              <Icon as={FaUsers} w={6} h={6} color="#204081" />
              <Box>
                <Heading size="sm">Pace Groups</Heading>
                <Text mt={2}>{runInfo.paceGroups.join(", ")}</Text>
              </Box>
            </HStack>
          </Box>
        </SimpleGrid>

        {/* Detailed Information */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} pt={6}>
          <Box>
            <Heading size="md" mb={4}>
              What to Bring
            </Heading>
            <VStack align="start" spacing={2}>
              {runInfo.whatToBring.map((item, index) => (
                <Text key={index}>• {item}</Text>
              ))}
            </VStack>
          </Box>

          <Box>
            <Heading size="md" mb={4}>
              Route Information
            </Heading>
            <Text>{runInfo.routeDescription}</Text>
          </Box>
        </SimpleGrid>

        {/* Photo Gallery */}
        <Box pt={10}>
          <Heading size="lg" mb={6} textAlign="center">
            Photo Gallery
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {runInfo.photos.map((photo, index) => (
              <Box
                key={index}
                cursor="pointer"
                onClick={() => handleImageClick(photo)}
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.02)" }}
              >
                <Image
                  src={photo}
                  alt={`${runInfo.title} photo ${index + 1}`}
                  borderRadius="lg"
                  objectFit="cover"
                  w="100%"
                  h="250px"
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Image Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent bg="transparent" boxShadow="none">
            <ModalCloseButton color="white" />
            <ModalBody p={0}>
              <Image
                src={selectedImage}
                alt="Selected run photo"
                w="100%"
                h="auto"
                maxH="90vh"
                objectFit="contain"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default RunDetailPage;
