import React from "react";
import {
  Box,
  Button,
  Text,
  Heading,
  VStack,
  HStack,
  Icon,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRunning, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RacesPromoSection: React.FC = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("blue.200", "blue.600");

  return (
    <Box bg={bgColor} borderY="1px" borderColor={borderColor} py={12} px={4}>
      <Container maxW="1200px">
        <VStack spacing={8} textAlign="center">
          {/* Header */}
          <VStack spacing={4}>
            <HStack spacing={3} justify="center">
              <Icon as={FaRunning} w={8} h={8} color="#204081" />
              <Heading as="h2" size="xl" color="#204081">
                Join Us for Races!
              </Heading>
              <Icon as={FaRunning} w={8} h={8} color="#204081" />
            </HStack>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Discover all the exciting races MRC Oslo participates in
              throughout the year. From local 5Ks to international marathons,
              find your next running adventure!
            </Text>
          </VStack>

          {/* Features */}
          <HStack spacing={8} wrap="wrap" justify="center">
            <VStack spacing={2}>
              <Icon as={FaCalendarAlt} w={6} h={6} color="#204081" />
              <Text fontWeight="bold" color="#204081">
                2025 Calendar
              </Text>
              <Text fontSize="sm" color="gray.600">
                Full year of races
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Icon as={FaRunning} w={6} h={6} color="#204081" />
              <Text fontWeight="bold" color="#204081">
                All Distances
              </Text>
              <Text fontSize="sm" color="gray.600">
                5K to 100 Milers
              </Text>
            </VStack>
          </HStack>

          {/* Call to Action */}
          <VStack spacing={4}>
            <Button
              onClick={() => navigate("/races")}
              size="lg"
              backgroundColor="#204081"
              color="#D5B2D3"
              _hover={{
                backgroundColor: "#2a4f9f",
                transform: "translateY(-2px)",
              }}
              boxShadow="md"
              rightIcon={<FaArrowRight />}
            >
              View All Races
            </Button>
            <Text fontSize="sm" color="gray.500">
              Find races by location, distance, and date
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default RacesPromoSection;
