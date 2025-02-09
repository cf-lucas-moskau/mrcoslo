import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  VStack,
  HStack,
  Link,
  Icon,
  Flex,
  useBreakpointValue,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRunning,
  FaUsers,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { fetchRaces } from "../utils/googleSheets";
import { format, formatDistanceToNow } from "date-fns";

interface Race {
  month: string;
  country: string;
  name: string;
  info: string;
  date: string;
  distances: string;
  type: string;
  runners: string[];
}

const RacesPage: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRaces = async () => {
      try {
        console.log("Starting to load races");
        const data = await fetchRaces();

        if (!data || !Array.isArray(data.races)) {
          console.error("Invalid data format:", data);
          throw new Error("Invalid data format received");
        }

        console.log("Received races:", data.races.length);
        setRaces(data.races);
        setLastUpdated(data.lastUpdated);
        setError(null);
      } catch (err) {
        console.error("Error in loadRaces:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load races. Please try again later.";
        setError(errorMessage);
        setRaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRaces();
  }, []);

  const getCountryFlag = (countryCode: string) => {
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch (err) {
      console.error("Error creating flag:", err);
      return "🏁"; // Fallback flag
    }
  };

  const renderRaces = (races: Race[]) => {
    if (!Array.isArray(races)) {
      console.error("races is not an array:", races);
      return null;
    }

    return races.reduce<JSX.Element[]>((acc, race, index, array) => {
      if (!race) {
        console.error("Invalid race object at index", index);
        return acc;
      }

      // Add month heading if it's the first race of the month
      if (index === 0 || race.month !== array[index - 1]?.month) {
        acc.push(
          <Box key={`month-${race.month}-${index}`} pt={index !== 0 ? 8 : 0}>
            <Heading size="lg" color="#204081" mb={6}>
              {race.month || "Unknown Month"}
            </Heading>
          </Box>
        );
      }

      // Add race card
      acc.push(
        <Box
          key={`race-${race.month}-${race.name}-${index}`}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          transition="transform 0.2s"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Flex align="center" mb={3}>
                <Heading size="md" mr={2}>
                  {race.name || "Unnamed Race"}
                </Heading>
                <Text fontSize="2xl" ml={2}>
                  {race.country ? getCountryFlag(race.country) : "🏁"}
                </Text>
              </Flex>

              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FaCalendarAlt} color="#204081" />
                  <Text>{race.date || "Date TBD"}</Text>
                </HStack>

                <HStack>
                  <Icon as={FaRunning} color="#204081" />
                  <Text>{race.distances || "Distance TBD"}</Text>
                  {race.type && <Badge colorScheme="purple">{race.type}</Badge>}
                </HStack>

                {race.info && (
                  <Link href={race.info} isExternal color="#204081">
                    <HStack>
                      <Icon as={FaExternalLinkAlt} />
                      <Text>Race Information</Text>
                    </HStack>
                  </Link>
                )}
              </VStack>
            </Box>

            <Box>
              <HStack mb={2}>
                <Icon as={FaUsers} color="#204081" />
                <Text fontWeight="bold">Runners</Text>
              </HStack>
              <Flex wrap="wrap" gap={2}>
                {Array.isArray(race.runners) && race.runners.length > 0 ? (
                  race.runners.map((runner, idx) => (
                    <Badge
                      key={`${runner}-${idx}`}
                      colorScheme="blue"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {runner}
                    </Badge>
                  ))
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    No runners signed up yet
                  </Text>
                )}
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>
      );

      return acc;
    }, []);
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={20}>
        <Flex justify="center" align="center" direction="column" gap={4}>
          <Spinner size="xl" color="#204081" thickness="4px" />
          <Text fontSize="lg" color="gray.600">
            Loading races...
          </Text>
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={10}>
        <Alert
          status="error"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          p={6}
        >
          <AlertIcon boxSize="40px" mr={0} mb={4} />
          <Text fontSize="lg" mb={2}>
            {error}
          </Text>
          <Text fontSize="sm" color="gray.600">
            Please check the browser console for more details.
          </Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" mb={8}>
          <Heading size="2xl" mb={4}>
            MRC Oslo Race Calendar 2025
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Join us for these exciting races throughout the year!
          </Text>
          {lastUpdated && (
            <Text fontSize="sm" color="gray.500" mt={2}>
              Last updated: {format(lastUpdated, "PPpp")} (
              {formatDistanceToNow(lastUpdated, { addSuffix: true })})
            </Text>
          )}
        </Box>

        {Array.isArray(races) && races.length > 0 ? (
          renderRaces(races)
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.600">
              No races found. Check back later!
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default RacesPage;
