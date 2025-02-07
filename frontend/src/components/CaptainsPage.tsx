import React, { useEffect } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  Heading,
  Image,
  VStack,
  HStack,
  Icon,
  Link,
} from "@chakra-ui/react";
import { FaInstagram, FaStrava, FaFacebook } from "react-icons/fa";

const CaptainsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const captains = [
    {
      name: "Danny",
      role: "Founder & DJ Captain",
      image: "/images/captain1.jpg",
      bio: "As the founder of MRC Oslo, Danny brings not just leadership but also the perfect beats to every run and social event. His passion for running is matched only by his ability to create the perfect playlist. From organizing events to DJing our post-run celebrations, Danny ensures MRC Oslo is more than just a running club - it's a community.",
      instagram: "https://instagram.com/danny",
      strava: "https://strava.com/athletes/danny",
      facebook: "https://facebook.com/danny",
      favoriteDiscipline: "Social Runs & Creating the Perfect Running Playlist",
      joinedYear: "Founder since Day 1",
    },
    {
      name: "Amy",
      role: "Ultra & Core Captain",
      image: "/images/captain2.jpg",
      bio: "Amy is our ultra-running powerhouse and core strength guru. Known for leading our most challenging ab workouts and casually running the most unexpected ultra marathons. Whether she's planning a new core routine or mapping out her next adventure run, Amy brings intensity and fun to every session.",
      instagram: "https://instagram.com/amy",
      strava: "https://strava.com/athletes/amy",
      facebook: "https://facebook.com/amy",
      favoriteDiscipline: "Ultra Running & Core Training",
      joinedYear: "2019",
    },
    {
      name: "Stian",
      role: "Long Run Captain",
      image: "/images/captain3.jpg",
      bio: "Stian is our long-distance expert, with an uncanny ability to find the most scenic routes in and around Oslo. As our Long Run Captain, he specializes in helping runners build their endurance and achieve their distance goals. His Sunday long runs are legendary for combining perfect pacing with beautiful Norwegian landscapes.",
      instagram: "https://instagram.com/stian",
      strava: "https://strava.com/athletes/stian",
      facebook: "https://facebook.com/stian",
      favoriteDiscipline: "Long Distance Running",
      joinedYear: "2021",
    },
  ];

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={16}>
        <Heading size="2xl" textAlign="center">
          Meet Our Captains
        </Heading>

        {captains.map((captain, index) => (
          <Box
            key={index}
            w="100%"
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            cursor="pointer"
            transition="transform 0.2s"
            _hover={{
              transform: "translateY(-5px)",
            }}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Box>
                <Image
                  src={captain.image}
                  alt={captain.name}
                  borderRadius="lg"
                  objectFit="cover"
                  w="100%"
                  h="400px"
                />
              </Box>

              <VStack align="start" spacing={6}>
                <Box>
                  <Heading size="xl">{captain.name}</Heading>
                  <Text color="purple.600" fontSize="xl" mt={2}>
                    {captain.role}
                  </Text>
                </Box>

                <Text fontSize="lg">{captain.bio}</Text>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Favorite Running Discipline:
                  </Text>
                  <Text>{captain.favoriteDiscipline}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Joined MRC Oslo:
                  </Text>
                  <Text>{captain.joinedYear}</Text>
                </Box>

                <HStack spacing={4}>
                  <Link href={captain.instagram} isExternal cursor="pointer">
                    <Icon as={FaInstagram} w={6} h={6} color="#204081" />
                  </Link>
                  <Link href={captain.strava} isExternal cursor="pointer">
                    <Icon as={FaStrava} w={6} h={6} color="#204081" />
                  </Link>
                  <Link href={captain.facebook} isExternal cursor="pointer">
                    <Icon as={FaFacebook} w={6} h={6} color="#204081" />
                  </Link>
                </HStack>
              </VStack>
            </SimpleGrid>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default CaptainsPage;
