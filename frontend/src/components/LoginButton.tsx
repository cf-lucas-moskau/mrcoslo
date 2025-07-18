import React, { useState } from "react";
import {
  Button,
  Icon,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { FaFacebook, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const LoginButton: React.FC = () => {
  const { signInWithFacebook } = useAuth();
  const toast = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (forceRedirect = false) => {
    try {
      setIsLoggingIn(true);
      await signInWithFacebook(forceRedirect);
      // For redirect flow, this toast won't show since page will reload
      // It will only show for popup flow
      toast({
        title: "Welcome!",
        description: "You have successfully logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={<Icon as={FaFacebook} />}
        rightIcon={<Icon as={FaChevronDown} />}
        colorScheme="facebook"
        size="md"
        isLoading={isLoggingIn}
        loadingText="Logging in..."
      >
        Login with Facebook
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleLogin(false)}>
          <Box>
            <Text fontWeight="bold">Normal Login (Popup)</Text>
            <Text fontSize="sm" color="gray.600">
              Standard desktop experience
            </Text>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleLogin(true)}>
          <Box>
            <Text fontWeight="bold">Test Redirect Login</Text>
            <Text fontSize="sm" color="gray.600">
              Simulates mobile experience
            </Text>
          </Box>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LoginButton;
