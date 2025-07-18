import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  Heading,
  Image,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const CaptainsComponent = () => {
  const captains = [
    {
      name: "Danny",
      role: "Founder & DJ Captain",
      image: "/images/captain1.jpg",
      shortBio:
        "Founder of MRC Oslo and our resident DJ, bringing the beats to our runs and social events.",
    },
    {
      name: "Amy",
      role: "Ultra & Core Captain",
      image: "/images/captain2.jpg",
      shortBio:
        "Ultra runner extraordinaire and master of iron-hard ab training sessions.",
    },
    {
      name: "Dory",
      role: "Long Run & Backstube Captain",
      image: "/images/captain3.jpg",
      shortBio:
        "You can find her snacking on vegan Backstube or smashing 160k training weeks.",
    },
  ];

  return (
    <Box
      p={8}
      textAlign="center"
      alignContent="center"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      id="captains"
      bg="#f5f5f5"
    >
      <VStack spacing={6} maxW="1200px" w="100%">
        <Heading as="h2" size="xl" mb={4}>
          Our Captains
        </Heading>

        <Button
          as={RouterLink}
          to="/captains"
          size="lg"
          backgroundColor="#204081"
          color="#D5B2D3"
          mb={8}
          _hover={{
            backgroundColor: "#2a4f9f",
          }}
        >
          Meet Our Captains
        </Button>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="100%">
          {captains.map((captain, index) => (
            <RouterLink to="/captains" key={index}>
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                transition="transform 0.2s"
                cursor="pointer"
                _hover={{
                  transform: "translateY(-5px)",
                }}
              >
                <Image
                  src={captain.image}
                  alt={captain.name}
                  borderRadius="full"
                  boxSize="200px"
                  objectFit="cover"
                  mx="auto"
                  mb={4}
                />
                <Heading size="md" mb={2}>
                  {captain.name}
                </Heading>
                <Text color="purple.600" mb={3}>
                  {captain.role}
                </Text>
                <Text color="gray.600">{captain.shortBio}</Text>
              </Box>
            </RouterLink>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default CaptainsComponent;
