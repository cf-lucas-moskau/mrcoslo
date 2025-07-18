import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  useToast,
  Spinner,
  Avatar,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Alert,
  AlertIcon,
  Divider,
  Flex,
  IconButton,
  Tooltip,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  TagLabel,
  TagCloseButton,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaCheck,
  FaClock,
  FaTrash,
  FaUser,
  FaPlus,
  FaEdit,
  FaCheckCircle,
  FaTasks,
  FaUsersCog,
  FaMoneyBill,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { ref, get, set, update, remove, push } from "firebase/database";
import { db } from "../firebase";
import LoginButton from "./LoginButton";

// Interface for relay stage signup
interface StageSignup {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  isGuest: boolean;
  guestName?: string;
  guestEmail?: string;
  isVerified: boolean;
  timestamp: number;
}

// Interface for stage data
interface Stage {
  number: number;
  distance: string;
  description: string;
  profile: string;
  signups: StageSignup[];
  lockedInRunnerId?: string; // ID of the confirmed runner for this stage
  paymentReceived?: boolean; // Whether payment has been received
}

// Interface for todo items
interface Todo {
  id: string;
  text: string;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  isCompleted: boolean;
  timestamp: number;
}

const HolmenkollenPage: React.FC = () => {
  const { currentUser, userData, signInWithFacebook } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [isGuestSignup, setIsGuestSignup] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const toast = useToast();

  // Stage data - update with more accurate information from the official website
  const stageDetails = [
    {
      number: 1,
      distance: "1100 m",
      description: "Knud Knudsens plass - Louises gate",
      profile: "Kupert",
    },
    {
      number: 2,
      distance: "1070 m",
      description: "Louises gate - Wolffs gate",
      profile: "Lett stigning",
    },
    {
      number: 3,
      distance: "600 m",
      description: "Wolffs gate - Wilhelm Færdens vei",
      profile: "Flat",
    },
    {
      number: 4,
      distance: "1910 m",
      description: "Wilhelm Færdens vei - Forskningsveien",
      profile: "Kupert",
    },
    {
      number: 5,
      distance: "1260 m",
      description: "Forskningsveien - Holmenveien",
      profile: "Flat",
    },
    {
      number: 6,
      distance: "1240 m",
      description: "Holmenveien - Slemdal skole",
      profile: "Bratt stigning",
    },
    {
      number: 7,
      distance: "1790 m",
      description: "Slemdal skole - Besserud",
      profile: "Bratt stigning",
    },
    {
      number: 8,
      distance: "1810 m",
      description: "Besserud - Gressbanen",
      profile: "Nedover",
    },
    {
      number: 9,
      distance: "630 m",
      description: "Gressbanen - Holmendammen",
      profile: "Nedover",
    },
    {
      number: 10,
      distance: "2840 m",
      description: "Holmendammen - Frognerparken",
      profile: "Kupert",
    },
    {
      number: 11,
      distance: "1530 m",
      description: "Frognerparken - Nordraaks gate",
      profile: "Kupert",
    },
    {
      number: 12,
      distance: "370 m",
      description: "Nordraaks gate - Arno Bergs plass",
      profile: "Flat",
    },
    {
      number: 13,
      distance: "1080 m",
      description: "Arno Bergs plass - Camilla Collets vei",
      profile: "Lett stigning",
    },
    {
      number: 14,
      distance: "720 m",
      description: "Camilla Collets vei - Bislettgata",
      profile: "Flat",
    },
    {
      number: 15,
      distance: "500 m",
      description: "Bislettgata - Mål (Bislett Stadion)",
      profile: "Flat",
    },
  ];

  // Check if current user is an admin
  useEffect(() => {
    if (currentUser) {
      console.log("Checking admin status for user:", currentUser.uid);
      const adminRef = ref(db, `admins/${currentUser.uid}`);
      get(adminRef)
        .then((snapshot) => {
          setIsAdmin(snapshot.exists() && snapshot.val() === true);
        })
        .catch((error) => {
          console.error("Error checking admin status:", error);
        });
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  // Fetch stage signups and todos from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch stages
        const stagesRef = ref(db, "holmenkollen/stages");
        const stagesSnapshot = await get(stagesRef);

        if (stagesSnapshot.exists()) {
          const stagesData = stagesSnapshot.val();

          // Transform the data into our Stage interface
          const formattedStages: Stage[] = stageDetails.map((stage) => {
            const stageData = stagesData[stage.number] || {};
            const signupsData = stageData.signups || {};

            // Convert signups object to array
            const signups = Object.entries(signupsData).map(
              ([id, data]: [string, any]) => ({
                id,
                ...data,
              })
            );

            return {
              ...stage,
              signups,
              lockedInRunnerId: stageData.lockedInRunnerId || undefined,
              paymentReceived: stageData.paymentReceived || false,
            };
          });

          setStages(formattedStages);
        } else {
          // Initialize with empty signups
          const formattedStages: Stage[] = stageDetails.map((stage) => ({
            ...stage,
            signups: [],
          }));
          setStages(formattedStages);
        }

        // Fetch todos
        const todosRef = ref(db, "holmenkollen/todos");
        const todosSnapshot = await get(todosRef);

        if (todosSnapshot.exists()) {
          const todosData = todosSnapshot.val();
          const formattedTodos: Todo[] = Object.entries(todosData).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
            })
          );

          // Sort todos by completion status and then by timestamp (newest first)
          formattedTodos.sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1; // Incomplete todos first
            }
            return b.timestamp - a.timestamp; // Newer todos first
          });

          setTodos(formattedTodos);
        } else {
          setTodos([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle stage signup
  const handleStageSignup = (stageNumber: number) => {
    // Always open the modal, regardless of login status
    setSelectedStage(stageNumber);
    setIsSignupModalOpen(true);

    // Reset guest signup state when opening the modal
    if (!currentUser) {
      setIsGuestSignup(false);
    }
  };

  // Check if user is already signed up for a specific stage
  const isUserSignedUpForStage = (stageNumber: number): boolean => {
    if (!currentUser) return false;

    const stage = stages.find((s) => s.number === stageNumber);
    if (!stage) return false;

    return stage.signups.some((signup) => signup.userId === currentUser.uid);
  };

  // Submit signup
  const submitSignup = async () => {
    if (selectedStage === null) return;

    try {
      setIsSubmitting(true);

      // Check if user is already signed up for this specific stage
      if (currentUser && isUserSignedUpForStage(selectedStage)) {
        toast({
          title: "Already Signed Up",
          description: `You've already signed up for stage ${selectedStage}`,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
        setIsSignupModalOpen(false);
        return;
      }

      // Create new signup
      const signupData: Omit<StageSignup, "id"> = isGuestSignup
        ? {
            userId: "guest-" + Date.now(),
            userName: guestName,
            isGuest: true,
            guestName,
            guestEmail,
            isVerified: false, // Guest signups need verification
            timestamp: Date.now(),
          }
        : {
            userId: currentUser!.uid,
            userName: userData?.name || currentUser!.displayName || "Anonymous",
            userPhotoURL:
              userData?.photoURL || currentUser!.photoURL || undefined,
            isGuest: false,
            isVerified: true, // Facebook users are auto-verified
            timestamp: Date.now(),
          };

      await set(
        ref(db, `holmenkollen/stages/${selectedStage}/signups/${Date.now()}`),
        signupData
      );

      toast({
        title: "Signup Successful",
        description: isGuestSignup
          ? "Your guest signup is pending verification"
          : `You've successfully signed up for stage ${selectedStage}`,
        status: isGuestSignup ? "info" : "success",
        duration: 5000,
        isClosable: true,
      });

      // Refresh data
      const stagesRef = ref(db, "holmenkollen/stages");
      const snapshot = await get(stagesRef);

      if (snapshot.exists()) {
        const stagesData = snapshot.val();

        const formattedStages: Stage[] = stageDetails.map((stage) => {
          const stageData = stagesData[stage.number] || {};
          const signupsData = stageData.signups || {};

          const signups = Object.entries(signupsData).map(
            ([id, data]: [string, any]) => ({
              id,
              ...data,
            })
          );

          return {
            ...stage,
            signups,
            lockedInRunnerId: stageData.lockedInRunnerId || undefined,
            paymentReceived: stageData.paymentReceived || false,
          };
        });

        setStages(formattedStages);
      }

      // Close modal and reset
      setIsSignupModalOpen(false);
      setIsGuestSignup(false);
      setGuestName("");
      setGuestEmail("");
      setSelectedStage(null);
    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Signup Failed",
        description: "There was an error signing up. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lock in a runner for a stage
  const lockInRunner = async (stageNumber: number, signupId: string) => {
    try {
      // Get the signup details
      const stage = stages.find((s) => s.number === stageNumber);
      if (!stage) return;

      const signup = stage.signups.find((s) => s.id === signupId);
      if (!signup) return;

      // Check if this runner is verified
      if (!signup.isVerified) {
        toast({
          title: "Verification Required",
          description:
            "This runner needs to be verified before they can be locked in.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Update the locked in runner for this stage
      await update(ref(db, `holmenkollen/stages/${stageNumber}`), {
        lockedInRunnerId: signupId,
      });

      toast({
        title: "Runner Locked In",
        description: `${signup.userName} has been confirmed as the runner for stage ${stageNumber}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Update local state
      setStages((prevStages) =>
        prevStages.map((stage) => {
          if (stage.number === stageNumber) {
            return {
              ...stage,
              lockedInRunnerId: signupId,
            };
          }
          return stage;
        })
      );
    } catch (error) {
      console.error("Error locking in runner:", error);
      toast({
        title: "Update Failed",
        description: "There was an error confirming the runner.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Remove locked in status
  const removeLockedInStatus = async (stageNumber: number) => {
    try {
      await update(ref(db, `holmenkollen/stages/${stageNumber}`), {
        lockedInRunnerId: null,
      });

      toast({
        title: "Status Removed",
        description: `The confirmed runner for stage ${stageNumber} has been removed`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Update local state
      setStages((prevStages) =>
        prevStages.map((stage) => {
          if (stage.number === stageNumber) {
            return {
              ...stage,
              lockedInRunnerId: undefined,
            };
          }
          return stage;
        })
      );
    } catch (error) {
      console.error("Error removing locked in status:", error);
      toast({
        title: "Update Failed",
        description: "There was an error removing the confirmed runner.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Verify a guest signup
  const verifyGuestSignup = async (stageNumber: number, signupId: string) => {
    try {
      await update(
        ref(db, `holmenkollen/stages/${stageNumber}/signups/${signupId}`),
        { isVerified: true }
      );

      toast({
        title: "Guest Verified",
        description: "The guest signup has been verified",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Update local state
      setStages((prevStages) =>
        prevStages.map((stage) => {
          if (stage.number === stageNumber) {
            return {
              ...stage,
              signups: stage.signups.map((signup) => {
                if (signup.id === signupId) {
                  return { ...signup, isVerified: true };
                }
                return signup;
              }),
            };
          }
          return stage;
        })
      );
    } catch (error) {
      console.error("Error verifying guest:", error);
      toast({
        title: "Verification Failed",
        description: "There was an error verifying the guest",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Remove a signup
  const removeSignup = async (
    stageNumber: number,
    signupId: string,
    isCurrentUser: boolean
  ) => {
    if (!isAdmin && !isCurrentUser) return;

    if (!window.confirm("Are you sure you want to remove this signup?")) {
      return;
    }

    try {
      await remove(
        ref(db, `holmenkollen/stages/${stageNumber}/signups/${signupId}`)
      );

      toast({
        title: "Signup Removed",
        description: "The signup has been removed",
        status: "info",
        duration: 3000,
        isClosable: true,
      });

      // Update local state
      setStages((prevStages) =>
        prevStages.map((stage) => {
          if (stage.number === stageNumber) {
            return {
              ...stage,
              signups: stage.signups.filter((signup) => signup.id !== signupId),
            };
          }
          return stage;
        })
      );
    } catch (error) {
      console.error("Error removing signup:", error);
      toast({
        title: "Removal Failed",
        description: "There was an error removing the signup",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to add todos",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!newTodoText.trim()) {
      toast({
        title: "Empty Todo",
        description: "Todo text cannot be empty",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const todoData = {
        text: newTodoText.trim(),
        createdBy: currentUser.uid,
        createdByName: userData?.name || currentUser.displayName || "Anonymous",
        isCompleted: false,
        timestamp: Date.now(),
      };

      const newTodoRef = push(ref(db, "holmenkollen/todos"));
      await set(newTodoRef, todoData);

      // Add the new todo to the state
      const newTodo: Todo = {
        id: newTodoRef.key as string,
        ...todoData,
      };

      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setNewTodoText("");

      toast({
        title: "Todo Added",
        description: "Your todo has been added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Toggle todo completion status
  const toggleTodoCompletion = async (todoId: string) => {
    try {
      const todoIndex = todos.findIndex((t) => t.id === todoId);
      if (todoIndex === -1) return;

      const todo = todos[todoIndex];
      const newCompletionStatus = !todo.isCompleted;

      await update(ref(db, `holmenkollen/todos/${todoId}`), {
        isCompleted: newCompletionStatus,
      });

      // Update the local state
      const updatedTodos = [...todos];
      updatedTodos[todoIndex] = {
        ...todo,
        isCompleted: newCompletionStatus,
      };

      // Re-sort the todos
      updatedTodos.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1; // Incomplete todos first
        }
        return b.timestamp - a.timestamp; // Newer todos first
      });

      setTodos(updatedTodos);

      toast({
        title: newCompletionStatus ? "Todo Completed" : "Todo Reopened",
        description: newCompletionStatus
          ? "The todo has been marked as completed"
          : "The todo has been reopened",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Assign a todo to a user
  const assignTodo = async (
    todoId: string,
    userId: string,
    userName: string
  ) => {
    try {
      const todoIndex = todos.findIndex((t) => t.id === todoId);
      if (todoIndex === -1) return;

      await update(ref(db, `holmenkollen/todos/${todoId}`), {
        assignedTo: userId,
        assignedToName: userName,
      });

      // Update the local state
      const updatedTodos = [...todos];
      updatedTodos[todoIndex] = {
        ...updatedTodos[todoIndex],
        assignedTo: userId,
        assignedToName: userName,
      };

      setTodos(updatedTodos);

      toast({
        title: "Todo Assigned",
        description: `The todo has been assigned to ${userName}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error assigning todo:", error);
      toast({
        title: "Error",
        description: "Failed to assign todo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Delete a todo
  const deleteTodo = async (todoId: string) => {
    try {
      const todoIndex = todos.findIndex((t) => t.id === todoId);
      if (todoIndex === -1) return;

      const todo = todos[todoIndex];

      // Check if the current user can delete this todo
      const canDelete =
        isAdmin || (currentUser && todo.createdBy === currentUser.uid);

      if (!canDelete) {
        toast({
          title: "Permission Denied",
          description: "You can only delete your own todos",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await remove(ref(db, `holmenkollen/todos/${todoId}`));

      // Update the local state
      setTodos(todos.filter((t) => t.id !== todoId));

      toast({
        title: "Todo Deleted",
        description: "The todo has been deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Get potential assignees from stage signups
  const getPotentialAssignees = () => {
    const assignees = new Map<
      string,
      { id: string; name: string; photoURL?: string }
    >();

    // Add all verified users who signed up for stages
    stages.forEach((stage) => {
      stage.signups.forEach((signup) => {
        if (signup.isVerified) {
          assignees.set(signup.userId, {
            id: signup.userId,
            name: signup.userName,
            photoURL: signup.userPhotoURL,
          });
        }
      });
    });

    // Ensure current user is included if logged in
    if (currentUser) {
      assignees.set(currentUser.uid, {
        id: currentUser.uid,
        name: userData?.name || currentUser.displayName || "You",
        photoURL: userData?.photoURL || currentUser.photoURL || undefined,
      });
    }

    return Array.from(assignees.values());
  };

  // Toggle payment status for a stage
  const togglePaymentStatus = async (stageNumber: number) => {
    try {
      if (!isAdmin) {
        toast({
          title: "Permission Denied",
          description: "Only admins can update payment status",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const stageIndex = stages.findIndex((s) => s.number === stageNumber);
      if (stageIndex === -1) return;

      const stage = stages[stageIndex];

      // If no runner is locked in, show warning
      if (!stage.lockedInRunnerId) {
        toast({
          title: "No Runner Confirmed",
          description: "Please confirm a runner for this stage first",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newPaymentStatus = !stage.paymentReceived;

      await update(ref(db, `holmenkollen/stages/${stageNumber}`), {
        paymentReceived: newPaymentStatus,
      });

      // Update the local state
      setStages((prevStages) =>
        prevStages.map((s) => {
          if (s.number === stageNumber) {
            return {
              ...s,
              paymentReceived: newPaymentStatus,
            };
          }
          return s;
        })
      );

      toast({
        title: newPaymentStatus ? "Payment Recorded" : "Payment Status Updated",
        description: newPaymentStatus
          ? "Payment has been marked as received"
          : "Payment has been marked as not received",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update payment status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={4} color="blue.700">
            Holmenkollstafetten 2025
          </Heading>

          <Box
            p={6}
            bg="blue.50"
            borderRadius="lg"
            mb={6}
            borderLeft="5px solid"
            borderColor="blue.500"
          >
            <Heading as="h2" size="lg" mb={4} color="blue.700">
              Join Our Team! 🏃‍♀️🏃‍♂️
            </Heading>
            <Text fontSize="xl" mb={4}>
              We're putting together a fun team for the Holmenkollstafetten 2025
              relay race, and <strong>everyone is welcome to join!</strong>
            </Text>
            <Text fontSize="lg" mb={4}>
              This is all about having fun, enjoying the event together, and
              being part of Oslo's biggest spring tradition - no pressure, just
              good times! Whether you're a seasoned runner or just looking to
              try something new, there's a stage that's perfect for you.
            </Text>
            <Text mb={4}>
              The Holmenkollstafetten is a 15-stage relay race through Oslo with
              varying distances and terrains for each stage. Simply browse the
              stages below and sign up for any that interest you!
            </Text>
          </Box>

          {!currentUser && (
            <Box mb={4}>
              <LoginButton />
            </Box>
          )}

          <Alert status="info" mb={6} borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">View the official course map</Text>
              <Link
                href="https://holmenkollstafetten.no/l%C3%B8ypekart"
                isExternal
                color="blue.600"
              >
                holmenkollstafetten.no/løypekart
              </Link>
            </Box>
          </Alert>

          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
            mb={6}
          >
            <Heading size="md" mb={4}>
              Race Overview
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              <Box bg="blue.50" p={3} borderRadius="md">
                <Text fontWeight="bold">Date</Text>
                <Text>May 10, 2025</Text>
              </Box>
              <Box bg="blue.50" p={3} borderRadius="md">
                <Text fontWeight="bold">Total Distance</Text>
                <Text>~18.4 km</Text>
              </Box>
              <Box bg="blue.50" p={3} borderRadius="md">
                <Text fontWeight="bold">Stages</Text>
                <Text>15 stages</Text>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab fontWeight="semibold">
              <Box mr={2}>
                <FaUsersCog />
              </Box>{" "}
              Stage Signups
            </Tab>
            <Tab fontWeight="semibold">
              <Box mr={2}>
                <FaTasks />
              </Box>{" "}
              Team Tasks
            </Tab>
            <Tab fontWeight="semibold">
              <Box mr={2}>
                <Icon as={FaMoneyBill} />
              </Box>{" "}
              Payments
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              {/* Stages Information and Signups Tabs */}
              <Box>
                <Heading size="lg" mb={4}>
                  Stages Information
                </Heading>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3 }}
                  spacing={4}
                  mb={6}
                >
                  {stageDetails.map((stage) => (
                    <Box
                      key={`stageinfo-${stage.number}`}
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="blue.500"
                    >
                      <Text fontWeight="bold" mb={1}>
                        Stage {stage.number}
                      </Text>
                      <Text fontSize="sm" mb={1}>
                        <b>Distance:</b> {stage.distance}
                      </Text>
                      <Text fontSize="sm" mb={1}>
                        <b>Route:</b> {stage.description}
                      </Text>
                      <Text fontSize="sm">
                        <b>Profile:</b> {stage.profile}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider my={6} />

              <Box>
                <Heading size="lg" mb={4}>
                  Sign up for a Stage
                </Heading>
                <Text mb={6}>
                  Please sign up for the stages you're interested in. An admin
                  will confirm one runner per stage.
                </Text>

                {isLoading ? (
                  <Box textAlign="center" py={10}>
                    <Spinner size="xl" />
                    <Text mt={4}>Loading stages...</Text>
                  </Box>
                ) : error ? (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} spacing={6}>
                    {stages.map((stage) => {
                      const lockedInSignup = stage.lockedInRunnerId
                        ? stage.signups.find(
                            (s) => s.id === stage.lockedInRunnerId
                          )
                        : undefined;

                      return (
                        <Box
                          key={stage.number}
                          p={5}
                          shadow="md"
                          borderWidth="1px"
                          borderRadius="lg"
                          bg="white"
                          borderLeftWidth="6px"
                          borderLeftColor={
                            lockedInSignup ? "green.400" : "gray.200"
                          }
                        >
                          <Flex justify="space-between" align="center" mb={3}>
                            <HStack>
                              <Heading size="md" fontWeight="bold">
                                Stage {stage.number}: {stage.distance}
                              </Heading>
                              {lockedInSignup && (
                                <Badge colorScheme="green" fontSize="sm">
                                  Confirmed Runner
                                </Badge>
                              )}
                            </HStack>
                            <Button
                              colorScheme="blue"
                              size="sm"
                              onClick={() => handleStageSignup(stage.number)}
                            >
                              Sign Up
                            </Button>
                          </Flex>

                          <Text mb={2}>
                            <b>Route:</b> {stage.description}
                          </Text>
                          <Text mb={4}>
                            <b>Profile:</b> {stage.profile}
                          </Text>

                          {lockedInSignup && (
                            <Box
                              p={3}
                              bg="green.50"
                              borderRadius="md"
                              mb={4}
                              borderLeft="4px solid"
                              borderColor="green.400"
                            >
                              <Text fontWeight="bold" mb={2}>
                                Confirmed Runner:
                              </Text>
                              <Flex align="center" justify="space-between">
                                <HStack>
                                  {lockedInSignup.userPhotoURL ? (
                                    <Avatar
                                      size="sm"
                                      src={lockedInSignup.userPhotoURL}
                                    />
                                  ) : (
                                    <Avatar size="sm" icon={<FaUser />} />
                                  )}
                                  <Text>{lockedInSignup.userName}</Text>
                                  {lockedInSignup.isGuest && (
                                    <Badge colorScheme="green">Guest</Badge>
                                  )}
                                </HStack>

                                {isAdmin && (
                                  <Tooltip label="Remove Confirmed Status">
                                    <IconButton
                                      aria-label="Remove confirmed status"
                                      icon={<FaTrash />}
                                      size="sm"
                                      colorScheme="red"
                                      variant="outline"
                                      onClick={() =>
                                        removeLockedInStatus(stage.number)
                                      }
                                    />
                                  </Tooltip>
                                )}
                              </Flex>
                            </Box>
                          )}

                          <Divider my={3} />

                          <Text fontWeight="bold" mb={2}>
                            {lockedInSignup
                              ? "All Signups:"
                              : `Interested Runners (${
                                  stage.signups.filter((s) => s.isVerified)
                                    .length
                                }):`}
                          </Text>

                          {stage.signups.length > 0 ? (
                            <VStack align="stretch" spacing={2}>
                              {stage.signups.map((signup) => {
                                const isCurrentUser = currentUser
                                  ? signup.userId === currentUser.uid
                                  : false;
                                const isLockedIn =
                                  stage.lockedInRunnerId === signup.id;

                                return (
                                  <Flex
                                    key={signup.id}
                                    p={2}
                                    bg={
                                      isLockedIn
                                        ? "green.50"
                                        : isCurrentUser
                                        ? "blue.50"
                                        : "gray.50"
                                    }
                                    borderRadius="md"
                                    justify="space-between"
                                    align="center"
                                    borderLeft={
                                      isLockedIn ? "3px solid" : "none"
                                    }
                                    borderColor="green.400"
                                  >
                                    <HStack>
                                      {signup.userPhotoURL ? (
                                        <Avatar
                                          size="sm"
                                          src={signup.userPhotoURL}
                                        />
                                      ) : (
                                        <Avatar size="sm" icon={<FaUser />} />
                                      )}
                                      <Box>
                                        <Text
                                          fontWeight={
                                            isCurrentUser || isLockedIn
                                              ? "bold"
                                              : "normal"
                                          }
                                        >
                                          {signup.userName}
                                          {isCurrentUser && " (You)"}
                                        </Text>
                                        <HStack spacing={2}>
                                          {isLockedIn && (
                                            <Badge colorScheme="green">
                                              Confirmed
                                            </Badge>
                                          )}
                                          {signup.isGuest && (
                                            <Badge
                                              colorScheme={
                                                signup.isVerified
                                                  ? "green"
                                                  : "yellow"
                                              }
                                            >
                                              {signup.isVerified
                                                ? "Guest"
                                                : "Unverified Guest"}
                                            </Badge>
                                          )}
                                        </HStack>
                                      </Box>
                                    </HStack>

                                    <HStack>
                                      {isAdmin &&
                                        !isLockedIn &&
                                        signup.isVerified && (
                                          <Tooltip label="Confirm as Runner">
                                            <IconButton
                                              aria-label="Lock in runner"
                                              icon={<FaCheck />}
                                              size="sm"
                                              colorScheme="green"
                                              onClick={() =>
                                                lockInRunner(
                                                  stage.number,
                                                  signup.id
                                                )
                                              }
                                            />
                                          </Tooltip>
                                        )}

                                      {isAdmin &&
                                        signup.isGuest &&
                                        !signup.isVerified && (
                                          <Tooltip label="Verify Guest">
                                            <IconButton
                                              aria-label="Verify"
                                              icon={<FaCheck />}
                                              size="sm"
                                              colorScheme="blue"
                                              onClick={() =>
                                                verifyGuestSignup(
                                                  stage.number,
                                                  signup.id
                                                )
                                              }
                                            />
                                          </Tooltip>
                                        )}

                                      {(isAdmin || isCurrentUser) &&
                                        !isLockedIn && (
                                          <Tooltip label="Remove Signup">
                                            <IconButton
                                              aria-label="Remove"
                                              icon={<FaTrash />}
                                              size="sm"
                                              colorScheme="red"
                                              onClick={() =>
                                                removeSignup(
                                                  stage.number,
                                                  signup.id,
                                                  isCurrentUser
                                                )
                                              }
                                            />
                                          </Tooltip>
                                        )}
                                    </HStack>
                                  </Flex>
                                );
                              })}
                            </VStack>
                          ) : (
                            <Text color="gray.500">
                              No runners signed up yet
                            </Text>
                          )}

                          {stage.signups.some((s) => !s.isVerified) &&
                            isAdmin && (
                              <Alert status="warning" mt={3} size="sm">
                                <AlertIcon />
                                There are unverified guest signups that need
                                your approval
                              </Alert>
                            )}
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                )}
              </Box>
            </TabPanel>

            <TabPanel p={0} pt={4}>
              {/* Team Todo List Tab */}
              <Box>
                <Heading size="lg" mb={4}>
                  Team Tasks
                </Heading>
                <Text mb={6}>
                  Keep track of team tasks and who's responsible for each one.
                </Text>

                {/* New Todo Input */}
                <Flex mb={6}>
                  <Textarea
                    placeholder="Add a new task... (e.g., 'Pick up race numbers', 'Arrange transportation')"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    size="md"
                    resize="vertical"
                    rows={2}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Add todo"
                    icon={<FaPlus />}
                    colorScheme="blue"
                    onClick={addTodo}
                    isDisabled={!currentUser || !newTodoText.trim()}
                    alignSelf="stretch"
                  />
                </Flex>

                {isLoading ? (
                  <Box textAlign="center" py={10}>
                    <Spinner size="xl" />
                    <Text mt={4}>Loading tasks...</Text>
                  </Box>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {todos.length === 0 ? (
                      <Box
                        textAlign="center"
                        py={8}
                        bg="gray.50"
                        borderRadius="md"
                      >
                        <Text color="gray.500">
                          No tasks yet. Add the first one!
                        </Text>
                      </Box>
                    ) : (
                      todos.map((todo) => {
                        const isCreator =
                          currentUser && todo.createdBy === currentUser.uid;
                        const isAssignee =
                          currentUser && todo.assignedTo === currentUser.uid;

                        return (
                          <Box
                            key={todo.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            borderLeftWidth="4px"
                            borderLeftColor={
                              todo.isCompleted
                                ? "green.400"
                                : isAssignee
                                ? "orange.400"
                                : "gray.300"
                            }
                            bg={todo.isCompleted ? "green.50" : "white"}
                            position="relative"
                            opacity={todo.isCompleted ? 0.8 : 1}
                          >
                            <Flex justify="space-between" align="flex-start">
                              <Box flex="1" pr={4}>
                                <HStack mb={2}>
                                  <IconButton
                                    aria-label={
                                      todo.isCompleted
                                        ? "Mark as incomplete"
                                        : "Mark as complete"
                                    }
                                    icon={
                                      todo.isCompleted ? (
                                        <FaCheckCircle />
                                      ) : (
                                        <FaClock />
                                      )
                                    }
                                    size="sm"
                                    colorScheme={
                                      todo.isCompleted ? "green" : "gray"
                                    }
                                    variant={
                                      todo.isCompleted ? "solid" : "outline"
                                    }
                                    onClick={() =>
                                      toggleTodoCompletion(todo.id)
                                    }
                                  />
                                  <Text
                                    fontWeight="bold"
                                    textDecoration={
                                      todo.isCompleted ? "line-through" : "none"
                                    }
                                    color={
                                      todo.isCompleted ? "gray.500" : "inherit"
                                    }
                                  >
                                    {todo.text}
                                  </Text>
                                </HStack>

                                <HStack
                                  spacing={4}
                                  fontSize="sm"
                                  color="gray.600"
                                >
                                  <Text>Created by: {todo.createdByName}</Text>
                                  {todo.assignedToName && (
                                    <Text>
                                      Assigned to: <b>{todo.assignedToName}</b>
                                    </Text>
                                  )}
                                  <Text>
                                    {new Date(
                                      todo.timestamp
                                    ).toLocaleDateString()}
                                  </Text>
                                </HStack>
                              </Box>

                              <HStack>
                                {/* Assign button */}
                                {isAdmin && (
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      size="sm"
                                      leftIcon={<FaUser />}
                                      colorScheme="blue"
                                      variant="outline"
                                    >
                                      {todo.assignedToName
                                        ? "Reassign"
                                        : "Assign"}
                                    </MenuButton>
                                    <MenuList>
                                      <MenuItem
                                        onClick={() =>
                                          assignTodo(todo.id, "", "")
                                        }
                                        isDisabled={!todo.assignedTo}
                                      >
                                        <Text color="gray.500">Unassign</Text>
                                      </MenuItem>
                                      <MenuDivider />
                                      {getPotentialAssignees().map((user) => (
                                        <MenuItem
                                          key={user.id}
                                          onClick={() =>
                                            assignTodo(
                                              todo.id,
                                              user.id,
                                              user.name
                                            )
                                          }
                                        >
                                          <HStack>
                                            {user.photoURL ? (
                                              <Avatar
                                                size="xs"
                                                src={user.photoURL}
                                              />
                                            ) : (
                                              <Avatar
                                                size="xs"
                                                icon={<FaUser />}
                                              />
                                            )}
                                            <Text>{user.name}</Text>
                                          </HStack>
                                        </MenuItem>
                                      ))}
                                    </MenuList>
                                  </Menu>
                                )}

                                {/* Delete button (only for creator or admin) */}
                                {(isCreator || isAdmin) && (
                                  <Tooltip label="Delete Task">
                                    <IconButton
                                      aria-label="Delete task"
                                      icon={<FaTrash />}
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => deleteTodo(todo.id)}
                                    />
                                  </Tooltip>
                                )}
                              </HStack>
                            </Flex>
                          </Box>
                        );
                      })
                    )}
                  </VStack>
                )}
              </Box>
            </TabPanel>

            <TabPanel p={0} pt={4}>
              {/* Payment Tracking Panel */}
              <Box>
                <Heading size="lg" mb={4}>
                  Payment Tracking
                </Heading>
                <Text mb={6}>
                  Track which runners have paid the participation fee.
                </Text>

                {isLoading ? (
                  <Box textAlign="center" py={10}>
                    <Spinner size="xl" />
                    <Text mt={4}>Loading payment status...</Text>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Stage</Th>
                          <Th>Runner</Th>
                          <Th>Payment Status</Th>
                          {isAdmin && <Th>Actions</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {stages.map((stage) => {
                          const lockedInRunner = stage.lockedInRunnerId
                            ? stage.signups.find(
                                (signup) => signup.id === stage.lockedInRunnerId
                              )
                            : undefined;

                          if (!lockedInRunner) {
                            return (
                              <Tr key={`payment-${stage.number}`} bg="gray.50">
                                <Td>Stage {stage.number}</Td>
                                <Td colSpan={isAdmin ? 3 : 2} color="gray.500">
                                  No confirmed runner
                                </Td>
                              </Tr>
                            );
                          }

                          return (
                            <Tr key={`payment-${stage.number}`}>
                              <Td>Stage {stage.number}</Td>
                              <Td>
                                <HStack>
                                  {lockedInRunner.userPhotoURL ? (
                                    <Avatar
                                      size="xs"
                                      src={lockedInRunner.userPhotoURL}
                                    />
                                  ) : (
                                    <Avatar size="xs" icon={<FaUser />} />
                                  )}
                                  <Text>{lockedInRunner.userName}</Text>
                                </HStack>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    stage.paymentReceived ? "green" : "red"
                                  }
                                  p={2}
                                  borderRadius="md"
                                >
                                  {stage.paymentReceived ? "Paid" : "Unpaid"}
                                </Badge>
                              </Td>
                              {isAdmin && (
                                <Td>
                                  <Button
                                    size="sm"
                                    colorScheme={
                                      stage.paymentReceived ? "red" : "green"
                                    }
                                    leftIcon={
                                      stage.paymentReceived ? (
                                        <FaTimes />
                                      ) : (
                                        <FaCheck />
                                      )
                                    }
                                    onClick={() =>
                                      togglePaymentStatus(stage.number)
                                    }
                                  >
                                    {stage.paymentReceived
                                      ? "Mark as Unpaid"
                                      : "Mark as Paid"}
                                  </Button>
                                </Td>
                              )}
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}

                {/* Payment Summary */}
                <Box
                  mt={8}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Heading size="md" mb={4}>
                    Payment Summary
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Stat>
                      <StatLabel>Total Confirmed Runners</StatLabel>
                      <StatNumber>
                        {
                          stages.filter((stage) => stage.lockedInRunnerId)
                            .length
                        }
                      </StatNumber>
                      <StatHelpText>Out of 15 stages</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Payments Received</StatLabel>
                      <StatNumber>
                        {stages.filter((stage) => stage.paymentReceived).length}
                      </StatNumber>
                      <StatHelpText>
                        {Math.round(
                          (stages.filter((stage) => stage.paymentReceived)
                            .length /
                            Math.max(
                              1,
                              stages.filter((stage) => stage.lockedInRunnerId)
                                .length
                            )) *
                            100
                        )}
                        % of confirmed runners
                      </StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Payments Pending</StatLabel>
                      <StatNumber>
                        {
                          stages.filter(
                            (stage) =>
                              stage.lockedInRunnerId && !stage.paymentReceived
                          ).length
                        }
                      </StatNumber>
                      <StatHelpText>
                        {Math.round(
                          (stages.filter(
                            (stage) =>
                              stage.lockedInRunnerId && !stage.paymentReceived
                          ).length /
                            Math.max(
                              1,
                              stages.filter((stage) => stage.lockedInRunnerId)
                                .length
                            )) *
                            100
                        )}
                        % of confirmed runners
                      </StatHelpText>
                    </Stat>
                  </SimpleGrid>
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Signup Modal */}
      <Modal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up for Stage {selectedStage}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {!currentUser && (
              <VStack mb={4} align="stretch">
                <Box mb={2} width="100%">
                  <LoginButton />
                </Box>

                <Text textAlign="center" fontSize="sm">
                  - or -
                </Text>

                <Checkbox
                  isChecked={isGuestSignup}
                  onChange={() => setIsGuestSignup(!isGuestSignup)}
                  colorScheme="blue"
                >
                  Sign up as guest (requires verification)
                </Checkbox>
              </VStack>
            )}

            {isGuestSignup && (
              <VStack spacing={4} mt={4}>
                <FormControl isRequired>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>

                <Alert status="info" size="sm">
                  <AlertIcon />
                  Guest signups require verification by an admin before being
                  confirmed
                </Alert>
              </VStack>
            )}

            {currentUser && (
              <VStack spacing={4} align="stretch">
                <Text>You'll be signed up using your Facebook profile:</Text>

                <HStack>
                  <Avatar src={currentUser.photoURL || undefined} />
                  <Text fontWeight="bold">
                    {userData?.name || currentUser.displayName}
                  </Text>
                </HStack>

                <Text fontSize="sm" color="gray.600">
                  You can sign up for multiple stages. An admin will confirm the
                  final lineup.
                </Text>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setIsSignupModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={submitSignup}
              isLoading={isSubmitting}
              isDisabled={
                isSubmitting ||
                (!currentUser && !isGuestSignup) ||
                (isGuestSignup && (!guestName || !guestEmail))
              }
            >
              Sign Up
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default HolmenkollenPage;
