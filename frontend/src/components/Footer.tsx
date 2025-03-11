import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  Divider,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="gray.800" color="white" py={10} mt={10}>
      <Container maxW="container.xl">
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 8, md: 4 }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb={8}
        >
          <Text fontSize="xl" fontWeight="bold">
            MRCO Oslo
          </Text>

          <Stack direction="row" spacing={6}>
            <Link
              href="https://www.facebook.com/groups/oslorunning"
              isExternal
              _hover={{ color: "blue.400" }}
            >
              <Icon as={FaFacebook} boxSize={6} />
            </Link>
            <Link
              href="https://www.instagram.com/mrcoslo"
              isExternal
              _hover={{ color: "blue.400" }}
            >
              <Icon as={FaInstagram} boxSize={6} />
            </Link>
            <Link href="mailto:info@mrcoslo.com" _hover={{ color: "blue.400" }}>
              <Icon as={FaEnvelope} boxSize={6} />
            </Link>
          </Stack>
        </Stack>

        <Divider borderColor="gray.600" />

        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          pt={6}
        >
          <Text fontSize="sm" color="gray.400">
            © {new Date().getFullYear()} MRCO Oslo. All rights reserved.
          </Text>

          <HStack spacing={4} fontSize="sm">
            <Link
              as={RouterLink}
              to="/privacy-policy"
              color="gray.400"
              _hover={{ color: "white" }}
            >
              Datenschutzrichtlinie
            </Link>
            <Link
              as={RouterLink}
              to="/terms-of-use"
              color="gray.400"
              _hover={{ color: "white" }}
            >
              Nutzungsbedingungen
            </Link>
            <Link
              as={RouterLink}
              to="/cookie-policy"
              color="gray.400"
              _hover={{ color: "white" }}
            >
              Cookie-Richtlinie
            </Link>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
