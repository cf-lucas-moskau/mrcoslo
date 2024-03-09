import { Box, Heading, Text } from "@chakra-ui/react";

const HeroSection: React.FC = () => {
  return (
    <Box
      id="us"
      p={8}
      textAlign="center"
      alignContent={"center"}
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Heading mb={4} size="2xl" fontWeight="bold" maxW={"1000px"}>
        Join the Fast Track to Fitness and Fun with [Your Club Name]
      </Heading>
      <Text fontSize="lg" maxW={"800px"} textAlign={"center"}>
        At [Your Club Name], we're more than just a running club; we're a
        community of enthusiasts and professionals dedicated to promoting
        health, endurance, and the joy of running. Whether you're a seasoned
        marathoner or a casual jogger, our club offers training sessions,
        community runs, and events designed to support your fitness journey and
        connect you with fellow runners in [Your Location]. With expert
        coaching, tailored training programs, and a supportive environment,
        [Your Club Name] is the perfect place to hit your stride and achieve
        your running goals.
      </Text>
    </Box>
  );
};

export default HeroSection;
