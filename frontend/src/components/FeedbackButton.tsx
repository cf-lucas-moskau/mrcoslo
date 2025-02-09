import React, { useState } from "react";
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
  VStack,
  Textarea,
  Select,
  useToast,
  Box,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaQuestionCircle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { ref, push } from "firebase/database";

const FeedbackButton: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, userData } = useAuth();
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [anonymousName, setAnonymousName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!feedbackType || !feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!currentUser && !anonymousName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackRef = ref(db, "feedback");
      await push(feedbackRef, {
        type: feedbackType,
        feedback: feedbackText,
        timestamp: Date.now(),
        page: window.location.pathname,
        userId: currentUser?.uid || "anonymous",
        userName: currentUser ? userData?.name : anonymousName.trim(),
        userEmail: currentUser?.email || null,
        isAuthenticated: !!currentUser,
      });

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFeedbackType("");
      setFeedbackText("");
      setAnonymousName("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFeedbackType("");
    setFeedbackText("");
    setAnonymousName("");
    onClose();
  };

  return (
    <>
      <Box position="fixed" bottom="4" right="4" zIndex={1000}>
        <IconButton
          aria-label="Give Feedback"
          icon={<FaQuestionCircle />}
          colorScheme="blue"
          size="lg"
          isRound
          onClick={onOpen}
          boxShadow="lg"
          _hover={{
            transform: "scale(1.1)",
          }}
          transition="all 0.2s"
        />
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Give Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Help us improve! Share your thoughts, suggestions, or report any
                issues.
              </Text>

              {currentUser ? (
                <Text>
                  Submitting as: <strong>{userData?.name}</strong>
                </Text>
              ) : (
                <FormControl isRequired isInvalid={!anonymousName.trim()}>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    placeholder="Enter your name"
                    value={anonymousName}
                    onChange={(e) => setAnonymousName(e.target.value)}
                  />
                  <FormErrorMessage>Name is required</FormErrorMessage>
                </FormControl>
              )}

              <FormControl isRequired isInvalid={!feedbackType}>
                <FormLabel>Feedback Type</FormLabel>
                <Select
                  placeholder="Select feedback type"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </Select>
                <FormErrorMessage>
                  Please select a feedback type
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!feedbackText.trim()}>
                <FormLabel>Your Feedback</FormLabel>
                <Textarea
                  placeholder="Your feedback here..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  minH="150px"
                />
                <FormErrorMessage>Feedback text is required</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Submit Feedback
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FeedbackButton;
