import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  Select,
  SimpleGrid,
  useToast,
  Badge,
  HStack,
  IconButton,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Stack,
  Center,
} from "@chakra-ui/react";
import { FaTrash, FaPlus, FaFacebook } from "react-icons/fa";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  ref,
  onValue,
  push,
  remove,
  set,
  get,
  onDisconnect,
} from "firebase/database";

interface Order {
  id: string;
  name: string;
  drink: string;
  notes: string;
  foodOrder?: string;
  foodCategory?: string;
  foodItem?: string;
  specialRequest?: string;
  userId?: string;
  userPhotoURL?: string;
}

const ADMIN_PASSWORD = "mrcoslo";
const USER_TTL_MS = 1000 * 60 * 30; // 30 minutes TTL

const OrderPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [drink, setDrink] = useState("");
  const [notes, setNotes] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const {
    isOpen: isClearModalOpen,
    onOpen: onClearModalOpen,
    onClose: onClearModalClose,
  } = useDisclosure();
  const [clearOrdersPassword, setClearOrdersPassword] = useState("");
  const [exportText, setExportText] = useState("");
  const {
    isOpen: isExportModalOpen,
    onOpen: onExportModalOpen,
    onClose: onExportModalClose,
  } = useDisclosure();
  const toast = useToast();

  // Add cleanup function for expired users
  const cleanupExpiredUsers = async () => {
    const activeUsersRef = ref(db, "activeUsers");
    const snapshot = await get(activeUsersRef);
    const data = snapshot.val();

    if (data) {
      const now = Date.now();
      Object.entries(data).forEach(async ([key, value]: [string, any]) => {
        if (value.timestamp && now - value.timestamp > USER_TTL_MS) {
          await remove(ref(db, `activeUsers/${key}`));
        }
      });
    }
  };

  // Modify the initial login useEffect
  useEffect(() => {
    if (currentUser && userData) {
      // Re-add user to active users and set up disconnect handler
      const activeUsersRef = ref(db, "activeUsers");
      const setupUser = async () => {
        try {
          await cleanupExpiredUsers(); // Clean up expired users first

          // First check if user already exists
          const snapshot = await get(activeUsersRef);
          const data = snapshot.val();
          const existingUserEntry = data
            ? Object.entries(data).find(
                ([_, value]: [string, any]) => value.name === userData.name
              )
            : null;

          if (!existingUserEntry) {
            // User not in active list, add them with timestamp
            const newUserRef = await push(activeUsersRef, {
              name: userData.name,
              timestamp: Date.now(),
              photoURL: userData.photoURL,
              userId: userData.uid,
            });
            onDisconnect(newUserRef).remove();
          } else {
            // Update existing user's timestamp
            const userRef = ref(db, `activeUsers/${existingUserEntry[0]}`);
            await set(userRef, {
              name: userData.name,
              timestamp: Date.now(),
              photoURL: userData.photoURL,
              userId: userData.uid,
            });
            onDisconnect(userRef).remove();
          }
        } catch (error) {
          console.error("Error setting up user presence:", error);
        }
      };

      setupUser();

      // Set up periodic cleanup
      const cleanup = setInterval(cleanupExpiredUsers, USER_TTL_MS / 2);
      return () => clearInterval(cleanup);
    }
  }, [currentUser, userData]);

  // Replace the local orders state with Firebase sync
  useEffect(() => {
    const ordersRef = ref(db, "orders");

    // Subscribe to orders changes
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object to array
        const ordersArray = Object.entries(data).map(([id, order]) => ({
          id,
          ...(order as Omit<Order, "id">),
        }));
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const drinks = [
    "Beer 0.5L",
    "Beer 0.4L",
    "Wine (Red)",
    "Wine (White)",
    "Cider",
    "Soft Drink",
    "Water",
  ];

  const foodMenu = {
    Burgers: [
      "Classic Burger",
      "Cheeseburger",
      "Bacon Burger",
      "Veggie Burger",
      "Double Burger",
    ],
    Sandwiches: [
      "Club Sandwich",
      "BLT",
      "Grilled Cheese",
      "Chicken Sandwich",
      "Veggie Sandwich",
    ],
    Sides: [
      "French Fries",
      "Sweet Potato Fries",
      "Onion Rings",
      "Side Salad",
      "Coleslaw",
    ],
    Salads: ["Caesar Salad", "Greek Salad", "Chicken Salad", "Garden Salad"],
    Snacks: ["Chicken Wings", "Nachos", "Mozzarella Sticks", "Garlic Bread"],
  };

  const handleSubmit = async () => {
    if (!currentUser || !userData) {
      toast({
        title: "Error",
        description: "Please log in with Facebook first",
        status: "error",
        variant: "solid",
      });
      return;
    }

    if (!drink && !foodItem && !notes) {
      toast({
        title: "Error",
        description: "Please add either a drink or food order",
        status: "error",
        variant: "solid",
      });
      return;
    }

    const existingOrder = orders.find(
      (order) => order.userId === currentUser.uid
    );

    if (existingOrder) {
      toast({
        title: "Error",
        description:
          "You already have an active order. Please remove your existing order before placing a new one.",
        status: "error",
        variant: "solid",
      });
      return;
    }

    try {
      // Add order to Firebase
      const ordersRef = ref(db, "orders");

      // Create order object
      const orderData = {
        name: userData.name,
        userId: currentUser.uid,
        userPhotoURL: userData.photoURL,
        drink: drink || null,
        foodCategory: foodItem ? foodCategory : null,
        foodItem: foodItem || null,
        foodOrder: !foodItem && notes ? notes : null,
        specialRequest: specialRequest || null,
        timestamp: Date.now(),
      };

      // Remove null values to keep the database clean
      const newOrder = Object.fromEntries(
        Object.entries(orderData).filter(([_, value]) => value !== null)
      );

      await push(ordersRef, newOrder);

      // Clear form
      setDrink("");
      setNotes("");
      setFoodCategory("");
      setFoodItem("");
      setSpecialRequest("");

      toast({
        title: "Order Added",
        description: "Your order has been added to the list",
        status: "success",
        variant: "solid",
      });
    } catch (error) {
      console.error("Firebase error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add order. Please try again.",
        status: "error",
        variant: "solid",
      });
    }
  };

  const removeOrder = async (id: string, orderId: string) => {
    // Check if the user is trying to remove their own order
    if (!currentUser || orderId !== currentUser.uid) {
      toast({
        title: "Error",
        description: "You can only remove your own orders",
        status: "error",
        variant: "solid",
      });
      return;
    }

    try {
      const orderRef = ref(db, `orders/${id}`);
      await remove(orderRef);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove order. Please try again.",
        status: "error",
        variant: "solid",
      });
    }
  };

  const handleClearAllOrders = async () => {
    if (clearOrdersPassword !== ADMIN_PASSWORD) {
      toast({
        title: "Error",
        description: "Incorrect password",
        status: "error",
        variant: "solid",
      });
      return;
    }

    try {
      const ordersRef = ref(db, "orders");
      await set(ordersRef, null);

      toast({
        title: "Orders Cleared",
        description: "All orders have been cleared",
        status: "info",
        variant: "solid",
      });

      // Reset password and close modal
      setClearOrdersPassword("");
      onClearModalClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear orders. Please try again.",
        status: "error",
        variant: "solid",
      });
    }
  };

  const generateExportText = () => {
    if (orders.length === 0) return "No orders to export.";

    const drinkOrders = orders.filter((order) => order.drink);
    const foodOrders = orders.filter(
      (order) => order.foodItem || order.foodOrder
    );

    let text = `🍻 MRC Oslo Orders Summary (${new Date().toLocaleString()})\n\n`;

    if (drinkOrders.length > 0) {
      text += "🥤 DRINKS:\n";
      const drinkSummary = drinkOrders.reduce((acc, order) => {
        acc[order.drink] = (acc[order.drink] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(drinkSummary)
        .sort(([, a], [, b]) => b - a)
        .forEach(([drink, count]) => {
          text += `${count}x ${drink}\n`;
        });
      text += "\n";
    }

    if (foodOrders.length > 0) {
      text += "🍔 FOOD:\n";
      foodOrders.forEach((order) => {
        text += `- ${order.name}: `;
        if (order.foodItem) {
          text += `${order.foodCategory} - ${order.foodItem}`;
        } else if (order.foodOrder) {
          text += order.foodOrder;
        }
        if (order.specialRequest) {
          text += ` (${order.specialRequest})`;
        }
        text += "\n";
      });
      text += "\n";
    }

    text += "📝 DETAILED ORDERS:\n";
    orders.forEach((order) => {
      text += `\n${order.name}:\n`;
      if (order.drink) text += `- Drink: ${order.drink}\n`;
      if (order.foodItem)
        text += `- Food: ${order.foodCategory} - ${order.foodItem}\n`;
      if (order.foodOrder) text += `- Special Food Order: ${order.foodOrder}\n`;
      if (order.specialRequest)
        text += `- Special Request: ${order.specialRequest}\n`;
    });

    return text;
  };

  const handleExport = () => {
    const text = generateExportText();
    setExportText(text);
    onExportModalOpen();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportText).then(() => {
      toast({
        title: "Copied!",
        description: "Order summary has been copied to clipboard",
        status: "success",
        variant: "solid",
        duration: 2000,
      });
    });
  };

  if (!currentUser || !userData) {
    return (
      <Container maxW="container.xl" py={10}>
        <Center flexDirection="column" gap={4}>
          <Heading size="lg">Please Log In</Heading>
          <Text>You need to be logged in with Facebook to place orders.</Text>
          <Button
            as="a"
            href="/"
            colorScheme="facebook"
            leftIcon={<FaFacebook />}
          >
            Return to Home & Log In
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      {/* Clear Orders Confirmation Modal */}
      <Modal isOpen={isClearModalOpen} onClose={onClearModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Clear All Orders</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Text color="red.500" fontWeight="bold">
                Warning: This action will remove all orders and cannot be
                undone.
              </Text>
              <FormControl>
                <FormLabel>Enter Admin Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter password to confirm"
                  value={clearOrdersPassword}
                  onChange={(e) => setClearOrdersPassword(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClearModalClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleClearAllOrders}>
              Clear All Orders
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportModalOpen} onClose={onExportModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Summary</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box
                fontFamily="monospace"
                whiteSpace="pre-wrap"
                p={4}
                bg="gray.50"
                borderRadius="md"
                fontSize="sm"
              >
                {exportText}
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </Button>
            <Button variant="ghost" onClick={onExportModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack spacing={8} align="stretch">
        <Box textAlign="center" position="relative">
          <Heading size={{ base: "xl", md: "2xl" }} mb={4}>
            Post-Run Drink Orders
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mb={2}>
            Add your drink order for after the run
          </Text>
          <Text fontSize="md" color="green.500">
            👥 {activeUsers.length}{" "}
            {activeUsers.length === 1 ? "person" : "people"} currently online
          </Text>
        </Box>

        <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="lg" boxShadow="md">
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              Ordering as: {userData.name}
            </Text>

            <Divider />

            <Heading size="md" alignSelf="start" w="full">
              Drink Order
            </Heading>
            <Select
              placeholder="Select Drink"
              value={drink}
              onChange={(e) => setDrink(e.target.value)}
            >
              {drinks.map((drink) => (
                <option key={drink} value={drink}>
                  {drink}
                </option>
              ))}
            </Select>

            <Divider />

            <Heading size="md" alignSelf="start" w="full">
              Food Order
            </Heading>

            <Stack
              width="100%"
              spacing={4}
              direction={{ base: "column", md: "row" }}
            >
              <Select
                placeholder="Select Category"
                value={foodCategory}
                onChange={(e) => {
                  setFoodCategory(e.target.value);
                  setFoodItem("");
                }}
              >
                {Object.keys(foodMenu).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>

              <Select
                placeholder="Select Item"
                value={foodItem}
                isDisabled={!foodCategory}
                onChange={(e) => setFoodItem(e.target.value)}
              >
                {foodCategory &&
                  foodMenu[foodCategory as keyof typeof foodMenu].map(
                    (item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    )
                  )}
              </Select>
            </Stack>

            <Text fontSize="sm" color="gray.600" alignSelf="start">
              Can't find what you want? Use the special food order below:
            </Text>

            <Input
              placeholder="Enter special food order here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              isDisabled={!!foodItem}
            />

            <Divider />

            <Heading size="md" alignSelf="start" w="full">
              Special Request
            </Heading>
            <Text fontSize="sm" color="gray.600" alignSelf="start">
              Any other requests or notes? (allergies, preferences, etc.)
            </Text>
            <Input
              placeholder="Example: No ice in drinks, allergic to nuts..."
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
            />

            <Button
              colorScheme="blue"
              leftIcon={<FaPlus />}
              onClick={handleSubmit}
              w="100%"
              size={{ base: "lg", md: "md" }}
            >
              Add Order
            </Button>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            mb={4}
            spacing={{ base: 4, md: 0 }}
          >
            <Heading size={{ base: "md", md: "lg" }}>
              Current Orders ({orders.length})
            </Heading>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={2}
              w={{ base: "full", md: "auto" }}
            >
              {orders.length > 0 && (
                <>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    w={{ base: "full", md: "auto" }}
                  >
                    Export Orders
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    onClick={onClearModalOpen}
                    w={{ base: "full", md: "auto" }}
                  >
                    Clear All Orders
                  </Button>
                </>
              )}
            </Stack>
          </Stack>

          {orders.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No orders yet. Be the first to add one!
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {orders.map((order) => (
                <Box
                  key={order.id}
                  p={4}
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                  bg="white"
                >
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "stretch", md: "flex-start" }}
                  >
                    <VStack align="start" spacing={1} w="full">
                      <Stack
                        direction={{ base: "column", md: "row" }}
                        align={{ base: "flex-start", md: "center" }}
                        spacing={2}
                        w="full"
                      >
                        <HStack>
                          {order.userPhotoURL && (
                            <Box
                              as="img"
                              src={order.userPhotoURL}
                              alt={order.name}
                              width="24px"
                              height="24px"
                              borderRadius="full"
                            />
                          )}
                          <Text fontWeight="bold">{order.name}</Text>
                        </HStack>
                        {order.drink && (
                          <Badge colorScheme="blue">{order.drink}</Badge>
                        )}
                      </Stack>
                      {order.foodItem && (
                        <Text fontSize="sm" color="gray.600">
                          Food: {order.foodCategory} - {order.foodItem}
                        </Text>
                      )}
                      {order.foodOrder && (
                        <Text fontSize="sm" color="gray.600">
                          Special Order: {order.foodOrder}
                        </Text>
                      )}
                      {order.specialRequest && (
                        <Text
                          fontSize="sm"
                          color="purple.600"
                          fontStyle="italic"
                        >
                          Special Request: {order.specialRequest}
                        </Text>
                      )}
                    </VStack>
                    {currentUser && order.userId === currentUser.uid && (
                      <IconButton
                        aria-label="Remove order"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() =>
                          removeOrder(order.id, order.userId || "")
                        }
                        alignSelf={{ base: "flex-end", md: "flex-start" }}
                        mt={{ base: 2, md: 0 }}
                      />
                    )}
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default OrderPage;
