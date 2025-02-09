import React from "react";
import { Button, Icon, useToast } from "@chakra-ui/react";
import { FaFacebook } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const LoginButton: React.FC = () => {
  const { signInWithFacebook } = useAuth();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      await signInWithFacebook();
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
    }
  };

  return (
    <Button
      onClick={handleLogin}
      leftIcon={<Icon as={FaFacebook} />}
      colorScheme="facebook"
      size="md"
    >
      Login with Facebook
    </Button>
  );
};

export default LoginButton;
