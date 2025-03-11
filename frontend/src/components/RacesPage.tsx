import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Wrap,
  WrapItem,
  IconButton,
  Button,
  Avatar,
  Textarea,
  useToast,
  Divider,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRunning,
  FaUsers,
  FaExternalLinkAlt,
  FaSearch,
  FaRegStar,
  FaStar,
  FaComment,
} from "react-icons/fa";
import { fetchRaces } from "../utils/googleSheets";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { ref, update, push, set } from "firebase/database";
import { db } from "../firebase";

interface RaceComment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  timestamp: number;
}

interface BaseRaceData {
  month: string;
  country: string;
  name: string;
  info: string;
  date: string;
  distances: string;
  type: string;
  runners: string[];
}

interface FirebaseRaceData extends BaseRaceData {
  comments?: { [key: string]: Omit<RaceComment, "id"> };
  excited?: { [key: string]: { value: boolean } };
}

interface Race extends BaseRaceData {
  id: string;
  comments: RaceComment[];
  excited: { [key: string]: { value: boolean } };
}

interface Filters {
  search: string;
  month: string;
  country: string;
  type: string;
}

interface CommentInputProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
}

const CommentInput = ({ onSubmit, isDisabled }: CommentInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <HStack>
      <Input
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isDisabled={isDisabled || !text.trim()}
      >
        Post
      </Button>
    </HStack>
  );
};

const RacesPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [races, setRaces] = useState<Race[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiDisabled, setApiDisabled] = useState(false);
  const [apiKeyBlocked, setApiKeyBlocked] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    month: "",
    country: "",
    type: "",
  });
  const [commentText, setCommentText] = useState("");
  const [commentingRaceId, setCommentingRaceId] = useState<string | null>(null);
  const toast = useToast();

  // Create refs for month headings
  const monthRefs = useRef<{ [month: string]: HTMLDivElement | null }>({});

  // Get current month name
  const getCurrentMonth = (): string => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[new Date().getMonth()];
  };

  const monthOrder: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const normalizeMonth = (month: string): string => {
    // First trim and convert to title case
    const normalized = month
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    // Ensure it's a valid month name
    return monthOrder[normalized] ? normalized : month;
  };

  const fetchData = async () => {
    try {
      // Check if we have data and if it's recent enough (24 hours)
      const DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (races.length > 0 && lastUpdated && !apiDisabled && !apiKeyBlocked) {
        const now = Date.now();
        if (now - lastUpdated < DAY_IN_MS) {
          // Less than 24 hours - use cached data
          console.log(
            "Using cached data from memory - last updated:",
            new Date(lastUpdated).toLocaleString()
          );
          setIsLoading(false);
          return;
        }
      }

      console.log("Fetching fresh data from Google Sheets");
      setIsLoading(true);
      setApiDisabled(false);
      setApiKeyBlocked(false);
      setError(null);

      const response = await fetchRaces();

      // Ensure we have an array of races
      const racesData: FirebaseRaceData[] = Array.isArray(response)
        ? response
        : Array.isArray(response.races)
        ? response.races
        : [];

      // Transform FirebaseRaceData to Race
      const racesWithIds: Race[] = racesData.map(
        (race: FirebaseRaceData, index: number) => ({
          ...race,
          id: index.toString(),
          // Convert comments from object to array if they exist
          comments: race.comments
            ? Object.entries(race.comments).map(([commentId, comment]) => ({
                ...comment,
                id: commentId,
              }))
            : [],
          // Ensure excited is initialized
          excited: race.excited || {},
        })
      );

      setRaces(racesWithIds);
      setLastUpdated(response.lastUpdated || Date.now());
    } catch (error) {
      console.error("Error fetching races:", error);

      // Check for specific API errors
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("Google Sheets API is disabled")) {
        setError(
          "The Google Sheets API is currently disabled. This typically happens after periods of inactivity. " +
            "Please contact the administrator to enable it again."
        );
        setApiDisabled(true);

        // Show a toast notification
        toast({
          title: "API Error",
          description:
            "The Google Sheets API is currently disabled. Using cached data if available.",
          status: "warning",
          duration: 10000,
          isClosable: true,
          position: "top",
        });
      } else if (errorMessage.includes("API key doesn't have permission")) {
        setError(
          "Your API key doesn't have permission to use the Google Sheets API. " +
            "This is likely due to API key restrictions in the Google Cloud Console."
        );
        setApiKeyBlocked(true);

        toast({
          title: "API Key Error",
          description:
            "Your API key has restrictions preventing access to the Google Sheets API.",
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top",
        });
      } else {
        setError("Failed to fetch races data. " + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Remove dependency array to only run on mount

  // Scroll to current month when data is loaded
  useEffect(() => {
    if (!isLoading && races.length > 0) {
      const currentMonth = getCurrentMonth();
      const monthRef = monthRefs.current[currentMonth];

      if (monthRef) {
        // Scroll with a small delay to ensure rendering is complete
        setTimeout(() => {
          monthRef.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [isLoading, races.length]);

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

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const months = new Set<string>();
    const countries = new Set<string>();
    const types = new Set<string>();

    races.forEach((race) => {
      if (race.month) months.add(normalizeMonth(race.month));
      if (race.country) countries.add(race.country);
      if (race.type) types.add(race.type);
    });

    return {
      months: Array.from(months).sort(
        (a, b) => (monthOrder[a] || 0) - (monthOrder[b] || 0)
      ),
      countries: Array.from(countries).sort(),
      types: Array.from(types).sort(),
    };
  }, [races]);

  // Filter races based on current filters
  const filteredRaces = useMemo(() => {
    return races.filter((race) => {
      const matchesSearch =
        !filters.search ||
        race.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        race.distances.toLowerCase().includes(filters.search.toLowerCase());
      const matchesMonth =
        !filters.month || normalizeMonth(race.month) === filters.month;
      const matchesCountry =
        !filters.country || race.country === filters.country;
      const matchesType = !filters.type || race.type === filters.type;

      return matchesSearch && matchesMonth && matchesCountry && matchesType;
    });
  }, [races, filters]);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleExcited = async (raceId: string, race: Race) => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to mark races as exciting",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const excitedRef = ref(
        db,
        `raceCache/races/${raceId}/excited/${currentUser.uid}`
      );
      const isCurrentlyExcited = race.excited?.[currentUser.uid]?.value;

      if (isCurrentlyExcited) {
        // Remove excitement by removing the entire node
        await set(excitedRef, null);

        // Update local state
        setRaces((prevRaces) =>
          prevRaces.map((r) => {
            if (r.id === raceId) {
              const newExcited = { ...r.excited };
              delete newExcited[currentUser.uid];
              return {
                ...r,
                excited: newExcited,
              };
            }
            return r;
          })
        );
      } else {
        // Add excitement with a value property
        await set(excitedRef, { value: true });

        // Update local state
        setRaces((prevRaces) =>
          prevRaces.map((r) => {
            if (r.id === raceId) {
              return {
                ...r,
                excited: {
                  ...r.excited,
                  [currentUser.uid]: { value: true },
                },
              };
            }
            return r;
          })
        );
      }

      toast({
        title: "Success",
        description: isCurrentlyExcited
          ? "Race unmarked as exciting"
          : "Race marked as exciting",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating excitement:", error);
      toast({
        title: "Error",
        description: "Failed to update excitement status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleComment = async (raceId: string, commentText: string) => {
    if (!currentUser || !userData || !commentText.trim()) return;

    try {
      const commentRef = ref(db, `raceCache/races/${raceId}/comments`);
      const newComment: Omit<RaceComment, "id"> = {
        text: commentText.trim(),
        userId: currentUser.uid,
        userName: userData.name,
        userPhotoURL: userData.photoURL || undefined,
        timestamp: Date.now(),
      };

      const newCommentRef = await push(commentRef, newComment);

      // Update local state
      setRaces((prevRaces) =>
        prevRaces.map((race) => {
          if (race.id === raceId) {
            return {
              ...race,
              comments: [
                ...race.comments,
                { ...newComment, id: newCommentRef.key! },
              ],
            };
          }
          return race;
        })
      );

      toast({
        title: "Success",
        description: "Comment added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderFilters = () => (
    <VStack spacing={4} w="100%" mb={8}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search races..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </InputGroup>

      <Wrap spacing={4}>
        <WrapItem>
          <Select
            placeholder="All Months"
            value={filters.month}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            minW="150px"
          >
            {filterOptions.months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
        </WrapItem>

        <WrapItem>
          <Select
            placeholder="All Countries"
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            minW="150px"
          >
            {filterOptions.countries.map((country) => (
              <option key={country} value={country}>
                {country} {getCountryFlag(country)}
              </option>
            ))}
          </Select>
        </WrapItem>

        <WrapItem>
          <Select
            placeholder="All Types"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            minW="150px"
          >
            {filterOptions.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </WrapItem>
      </Wrap>

      {Object.values(filters).some(Boolean) && (
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.600">
            Showing {filteredRaces.length} of {races.length} races
          </Text>
          <Text
            fontSize="sm"
            color="blue.500"
            cursor="pointer"
            onClick={() =>
              setFilters({ search: "", month: "", country: "", type: "" })
            }
          >
            Clear filters
          </Text>
        </HStack>
      )}
    </VStack>
  );

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
          <Box
            key={`month-${race.month}-${index}`}
            pt={index !== 0 ? 8 : 0}
            ref={(el) => {
              if (race.month) {
                monthRefs.current[race.month] = el;
              }
            }}
          >
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

                <HStack spacing={4}>
                  <HStack>
                    <IconButton
                      aria-label="Mark as exciting"
                      icon={
                        race.excited?.[currentUser?.uid || ""] ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )
                      }
                      colorScheme={
                        race.excited?.[currentUser?.uid || ""]
                          ? "yellow"
                          : "gray"
                      }
                      variant="ghost"
                      onClick={() => handleExcited(race.id, race)}
                    />
                    <Text fontSize="sm">
                      {Object.keys(race.excited || {}).length}
                    </Text>
                  </HStack>
                  <HStack>
                    <IconButton
                      aria-label="Show comments"
                      icon={<FaComment />}
                      variant="ghost"
                      onClick={() =>
                        setCommentingRaceId(
                          commentingRaceId === race.id ? null : race.id
                        )
                      }
                    />
                    <Text fontSize="sm">{race.comments?.length || 0}</Text>
                  </HStack>
                </HStack>
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

          {/* Comments Section */}
          {commentingRaceId === race.id && (
            <Box mt={4}>
              <Divider mb={4} />
              <VStack align="stretch" spacing={4}>
                {race.comments?.map((comment) => (
                  <HStack key={comment.id} spacing={3} alignItems="flex-start">
                    <Avatar
                      size="xs"
                      src={comment.userPhotoURL}
                      name={comment.userName}
                    />
                    <Box flex={1}>
                      <HStack spacing={2} mb={1}>
                        <Text fontSize="sm" fontWeight="bold">
                          {comment.userName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatDistanceToNow(comment.timestamp, {
                            addSuffix: true,
                          })}
                        </Text>
                      </HStack>
                      <Text fontSize="sm">{comment.text}</Text>
                    </Box>
                  </HStack>
                ))}

                {currentUser && (
                  <CommentInput
                    onSubmit={(text) => handleComment(race.id, text)}
                    isDisabled={!currentUser}
                  />
                )}
              </VStack>
            </Box>
          )}
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
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={4} width="100%">
            <Text>{error}</Text>

            {apiDisabled && (
              <HStack>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    window.open(
                      "https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=816386613163",
                      "_blank"
                    );
                  }}
                >
                  Enable API
                </Button>
                <Button
                  colorScheme="green"
                  size="sm"
                  isLoading={isLoading}
                  onClick={fetchData}
                >
                  Retry Fetch
                </Button>
              </HStack>
            )}

            {apiKeyBlocked && (
              <VStack align="start" spacing={2} width="100%">
                <Text fontSize="sm">To fix API key restrictions:</Text>
                <OrderedList pl={4} fontSize="sm" spacing={1}>
                  <ListItem>Go to the Google Cloud Console</ListItem>
                  <ListItem>
                    Navigate to APIs &amp; Services {"->"} Credentials
                  </ListItem>
                  <ListItem>Find and edit your API key</ListItem>
                  <ListItem>
                    Under "API restrictions", select "Google Sheets API" in the
                    allowed APIs
                  </ListItem>
                  <ListItem>
                    If you have domain restrictions, verify your domain is
                    allowed
                  </ListItem>
                </OrderedList>
                <Button
                  colorScheme="blue"
                  size="sm"
                  mt={2}
                  onClick={() => {
                    window.open(
                      "https://console.cloud.google.com/apis/credentials",
                      "_blank"
                    );
                  }}
                >
                  Go to API Credentials
                </Button>
                <Button
                  colorScheme="green"
                  size="sm"
                  isLoading={isLoading}
                  onClick={fetchData}
                >
                  Retry Fetch
                </Button>
              </VStack>
            )}
          </VStack>
        </Alert>

        {races.length > 0 && (
          <>
            <Text mb={6} fontStyle="italic">
              Showing cached data from{" "}
              {lastUpdated
                ? new Date(lastUpdated).toLocaleString()
                : "an earlier fetch"}
            </Text>
            {renderFilters()}
            {renderRaces(filteredRaces)}
          </>
        )}
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

        {renderFilters()}

        {Array.isArray(filteredRaces) && filteredRaces.length > 0 ? (
          renderRaces(filteredRaces)
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.600">
              {races.length > 0
                ? "No races match your filters. Try adjusting them."
                : "No races found. Check back later!"}
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default RacesPage;
