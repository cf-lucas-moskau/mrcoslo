import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Button,
  Icon,
  useBreakpointValue,
  keyframes,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaRunning, FaBeer } from "react-icons/fa";
import { useState, useEffect } from "react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const waveGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const runningAnimation = keyframes`
  0% { transform: translateX(-10px) rotate(0deg); }
  25% { transform: translateX(0px) rotate(5deg); }
  75% { transform: translateX(0px) rotate(-5deg); }
  100% { transform: translateX(10px) rotate(0deg); }
`;

const beerAnimation = keyframes`
  0% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
  100% { transform: rotate(-10deg); }
`;

const MotionBox = motion(Box);

const HeroSection: React.FC = () => {
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" });
  const textSize = useBreakpointValue({ base: "md", md: "lg" });
  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsIdle(false);
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    // Check for inactivity every second
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > 10000) {
        // 10 seconds
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      // Cleanup
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearInterval(interval);
    };
  }, [lastActivity]);

  return (
    <Box
      id="us"
      position="relative"
      overflow="hidden"
      bg="linear-gradient(135deg, #204081 0%, #2a4f9f 100%)"
      color="white"
      py={{ base: 12, md: 20 }}
      px={4}
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        backgroundImage="url('/images/pattern.png')"
        backgroundRepeat="repeat"
      />

      <Container maxW="1200px" position="relative">
        <VStack spacing={{ base: 6, md: 8 }} align="center">
          {/* Icons */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={8}
            animation={`${fadeIn} 1s ease-out`}
          >
            <Box
              position="relative"
              animation={
                isIdle
                  ? `${runningAnimation} 2s ease-in-out infinite alternate`
                  : "none"
              }
              _hover={{
                animation: `${runningAnimation} 2s ease-in-out infinite alternate`,
                transform: "scale(1.1)",
              }}
              transition="transform 0.2s"
            >
              <Icon as={FaRunning} w={10} h={10} color="#B9DDB9" />
            </Box>
            <Box
              position="relative"
              animation={
                isIdle ? `${beerAnimation} 3s ease-in-out infinite` : "none"
              }
              transformOrigin="bottom center"
              _hover={{
                animation: `${beerAnimation} 3s ease-in-out infinite`,
                transform: "scale(1.1)",
              }}
              transition="transform 0.2s"
            >
              <Icon as={FaBeer} w={10} h={10} color="#D5B2D3" />
            </Box>
          </Box>

          {/* Heading */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Heading
              size={headingSize}
              fontWeight="bold"
              textAlign="center"
              bgGradient="linear(45deg, #B9DDB9, #D5B2D3, #204081, #B9DDB9)"
              bgClip="text"
              bgSize="300% 100%"
              animation={`${waveGradient} 8s ease infinite`}
              letterSpacing="tight"
              mb={4}
            >
              Mikkeller Running Club Oslo
            </Heading>
          </MotionBox>

          {/* Description */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            maxW="800px"
          >
            <VStack spacing={4} textAlign="center">
              <Text fontSize={textSize} lineHeight="tall">
                The idea of Mikkeller Running Club is to stay fit through
                running. That makes us capable of enjoying even more of the good
                life – which includes state of the art food and drinks.
              </Text>

              <Text fontSize={textSize} lineHeight="tall">
                Obviously our main passion is beer – especially drinking beers –
                and sometimes (preferably) in large scales.
              </Text>

              <Text fontSize={textSize} lineHeight="tall">
                The club is founded by Mikkel Borg Bjergsø, who is also the
                creator and owner of Mikkeller.
              </Text>

              <Text fontSize={textSize} lineHeight="tall">
                Speed is not the main target in Mikkeller Running Club. Having
                fun and great social relations is our top priority and we're
                just proud to see MRC members take part in races and events
                around the world.
              </Text>

              <Text fontSize={textSize} lineHeight="tall">
                You do not have to be an experienced runner or athlete to join
                MRC…all we ask is for you to come join us and have fun staying
                healthy – and sometimes a bit tipsy!!!
              </Text>
            </VStack>
          </MotionBox>

          {/* Call to Action */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            mt={6}
          >
            <Button
              as="a"
              href="#regular-runs"
              size="lg"
              colorScheme="whiteAlpha"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
            >
              Join Our Runs
            </Button>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default HeroSection;
