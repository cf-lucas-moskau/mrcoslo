import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Image,
  Text,
  Button,
  IconButton,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Textarea,
  useToast,
  Flex,
  Avatar,
  Divider,
  Badge,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import {
  CloseIcon,
  DeleteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { FaHeart, FaRegHeart, FaComment, FaUpload } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase";
import {
  ref,
  push,
  set,
  onValue,
  remove,
  update,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { formatDistanceToNow, isToday, format } from "date-fns";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  userId: string;
  userPhotoURL?: string | null;
  timestamp: number;
  likes: { [key: string]: boolean };
  comments: Comment[];
  bundleId?: string | null;
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL?: string | null;
  timestamp: number;
}

interface DatabaseComment {
  text: string;
  userId: string;
  userName: string;
  userPhotoURL?: string | null;
  timestamp: number;
}

interface DatabasePhoto {
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  userId: string;
  userPhotoURL?: string | null;
  timestamp: number;
  likes: { [key: string]: boolean };
  comments?: { [key: string]: DatabaseComment };
  bundleId?: string | null;
}

interface FirebaseData {
  [key: string]: DatabasePhoto;
}

interface UploadFile {
  file: File;
  preview: string;
}

interface PhotoGroup {
  id: string;
  photos: Photo[];
  timestamp: number;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return format(date, "PPpp"); // e.g., "Apr 29, 2023, 3:00 PM"
};

const PhotosPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCaption, setUploadCaption] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [userUploadsToday, setUserUploadsToday] = useState<number>(0);
  const [bundledPhotos, setBundledPhotos] = useState<{
    [key: string]: Photo[];
  }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PHOTOS_PER_PAGE = 12;

  useEffect(() => {
    const photosRef = ref(db, "photos");
    const unsubscribe = onValue(photosRef, (snapshot) => {
      const data = snapshot.val() as FirebaseData | null;
      if (data) {
        const photosList = Object.entries(data).map(([id, photo]) => ({
          id,
          imageUrl: photo.imageUrl,
          caption: photo.caption,
          uploadedBy: photo.uploadedBy,
          userId: photo.userId,
          userPhotoURL: photo.userPhotoURL || undefined,
          timestamp: photo.timestamp,
          likes: photo.likes || {},
          bundleId: photo.bundleId || undefined,
          comments: photo.comments
            ? Object.entries(photo.comments).map(([commentId, comment]) => ({
                id: commentId,
                text: comment.text,
                userId: comment.userId,
                userName: comment.userName,
                userPhotoURL: comment.userPhotoURL || undefined,
                timestamp: comment.timestamp,
              }))
            : [],
        }));

        // Group photos by bundleId
        const bundled: { [key: string]: Photo[] } = {};
        photosList.forEach((photo) => {
          if (photo.bundleId) {
            if (!bundled[photo.bundleId]) {
              bundled[photo.bundleId] = [];
            }
            bundled[photo.bundleId].push(photo);
          }
        });
        setBundledPhotos(bundled);

        const sortedPhotos = photosList.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setPhotos(sortedPhotos);
        // Initialize visible photos with first batch
        setVisiblePhotos(sortedPhotos.slice(0, PHOTOS_PER_PAGE));
        setHasMore(sortedPhotos.length > PHOTOS_PER_PAGE);
      } else {
        setPhotos([]);
        setVisiblePhotos([]);
        setBundledPhotos({});
        setHasMore(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      checkUserUploadLimit();
    }
  }, [currentUser]);

  const checkUserUploadLimit = async () => {
    if (!currentUser) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const userPhotosRef = ref(db, "photos");
    const userPhotosQuery = query(
      userPhotosRef,
      orderByChild("userId"),
      equalTo(currentUser.uid)
    );

    try {
      const snapshot = await get(userPhotosQuery);
      const photos = snapshot.val() || {};
      const todayUploads = Object.values(photos).filter(
        (photo: any) => photo.timestamp >= todayTimestamp
      ).length;
      setUserUploadsToday(todayUploads);
      return todayUploads;
    } catch (error) {
      console.error("Error checking upload limit:", error);
      return 0;
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newFiles = await Promise.all(
        files.slice(0, 3).map(async (file) => ({
          file,
          preview: URL.createObjectURL(file),
        }))
      );
      setSelectedFiles((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 3); // Limit to 3 files
      });
      onUploadOpen();
    }
  };

  const uploadFiles = async () => {
    if (
      !currentUser ||
      !userData ||
      !uploadCaption.trim() ||
      selectedFiles.length === 0
    )
      return;

    const uploadsToday = await checkUserUploadLimit();
    if (uploadsToday >= 2) {
      toast({
        title: "Upload Limit Reached",
        description: "You can only create 2 posts per day. Try again tomorrow!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    try {
      // Only create bundleId if there are multiple files
      const bundleId =
        selectedFiles.length > 1 ? Date.now().toString() : undefined;

      for (const { file } of selectedFiles) {
        const imageRef = storageRef(
          storage,
          `photos/${Date.now()}_${file.name}`
        );
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);

        const photosRef = ref(db, "photos");
        const newPhotoRef = push(photosRef);
        const photoData: DatabasePhoto = {
          imageUrl,
          caption: uploadCaption,
          uploadedBy: userData.name,
          userId: currentUser.uid,
          userPhotoURL: userData.photoURL || undefined,
          timestamp: Date.now(),
          likes: {},
        };

        // Only add bundleId if it exists
        if (bundleId) {
          photoData.bundleId = bundleId;
        }

        await set(newPhotoRef, photoData);
      }

      setUploadCaption("");
      setSelectedFiles([]);
      onUploadClose();
      checkUserUploadLimit();

      toast({
        title: "Success",
        description: "Photos uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload photos. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  const handleLike = async (photo: Photo) => {
    if (!currentUser) return;

    const photoRef = ref(db, `photos/${photo.id}/likes`);
    const userLiked = photo.likes?.[currentUser.uid];

    // Optimistic update for both photos list and selected photo
    const updateLikes = (p: Photo) => {
      const updatedLikes = { ...p.likes };
      if (userLiked) {
        delete updatedLikes[currentUser.uid];
      } else {
        updatedLikes[currentUser.uid] = true;
      }
      return { ...p, likes: updatedLikes };
    };

    // Update photos list
    setPhotos((prevPhotos) => {
      return prevPhotos.map((p) => {
        if (p.id === photo.id) {
          return updateLikes(p);
        }
        return p;
      });
    });

    // Update visible photos
    setVisiblePhotos((prevPhotos) => {
      return prevPhotos.map((p) => {
        if (p.id === photo.id) {
          return updateLikes(p);
        }
        return p;
      });
    });

    // Update selected photo if it's the one being liked
    if (selectedPhoto?.id === photo.id) {
      setSelectedPhoto(updateLikes(photo));
    }

    try {
      if (userLiked) {
        await update(photoRef, { [currentUser.uid]: null });
      } else {
        await update(photoRef, { [currentUser.uid]: true });
      }
    } catch (error) {
      // Revert optimistic updates on error
      const revertLikes = (p: Photo) => {
        if (p.id === photo.id) {
          return { ...p, likes: photo.likes };
        }
        return p;
      };

      setPhotos((prevPhotos) => prevPhotos.map(revertLikes));
      setVisiblePhotos((prevPhotos) => prevPhotos.map(revertLikes));
      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto({ ...selectedPhoto, likes: photo.likes });
      }

      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleComment = async () => {
    if (!currentUser || !userData || !selectedPhoto || !commentText.trim())
      return;

    try {
      const commentRef = ref(db, `photos/${selectedPhoto.id}/comments`);
      const commentData: DatabaseComment = {
        text: commentText,
        userId: currentUser.uid,
        userName: userData.name,
        userPhotoURL: userData.photoURL || undefined,
        timestamp: Date.now(),
      };
      await push(commentRef, commentData);

      setCommentText("");
      toast({
        title: "Success",
        description: "Comment added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const groupPhotos = (photos: Photo[]): PhotoGroup[] => {
    const groups: { [key: string]: PhotoGroup } = {};

    photos.forEach((photo) => {
      const groupId = photo.bundleId || photo.id;
      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          photos: [],
          timestamp: photo.timestamp,
        };
      }
      groups[groupId].photos.push(photo);
    });

    return Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
  };

  const nextImage = () => {
    if (!selectedPhoto?.bundleId) return;
    const bundle = bundledPhotos[selectedPhoto.bundleId];
    setCurrentImageIndex((prev) => (prev + 1) % bundle.length);
  };

  const prevImage = () => {
    if (!selectedPhoto?.bundleId) return;
    const bundle = bundledPhotos[selectedPhoto.bundleId];
    setCurrentImageIndex((prev) => (prev - 1 + bundle.length) % bundle.length);
  };

  const openPhotoView = (photo: Photo) => {
    setSelectedPhoto(photo);
    if (photo.bundleId) {
      const bundle = bundledPhotos[photo.bundleId];
      setCurrentImageIndex(bundle.findIndex((p) => p.id === photo.id));
    }
    onViewOpen();
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    if (!currentUser || currentUser.uid !== photo.userId) return;

    try {
      // Close the modal first to prevent accessing deleted data
      if (isViewOpen) {
        onViewClose();
        setSelectedPhoto(null);
        setCurrentImageIndex(0);
      }

      if (photo.bundleId && bundledPhotos[photo.bundleId]) {
        // Delete all photos in the bundle
        const bundlePhotos = bundledPhotos[photo.bundleId];
        for (const bundlePhoto of bundlePhotos) {
          // Delete from Storage
          const imageUrl = new URL(bundlePhoto.imageUrl);
          const imagePath = decodeURIComponent(
            imageUrl.pathname.split("/o/")[1].split("?")[0]
          );
          const imageRef = storageRef(storage, imagePath);
          await deleteObject(imageRef);

          // Delete from Database
          await remove(ref(db, `photos/${bundlePhoto.id}`));
        }
      } else {
        // Delete single photo
        // Delete from Storage
        const imageUrl = new URL(photo.imageUrl);
        const imagePath = decodeURIComponent(
          imageUrl.pathname.split("/o/")[1].split("?")[0]
        );
        const imageRef = storageRef(storage, imagePath);
        await deleteObject(imageRef);

        // Delete from Database
        await remove(ref(db, `photos/${photo.id}`));
      }

      toast({
        title: "Success",
        description: "Photo(s) deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete photo(s). Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    const currentLength = visiblePhotos.length;
    const nextBatch = photos.slice(
      currentLength,
      currentLength + PHOTOS_PER_PAGE
    );

    setVisiblePhotos((prev) => [...prev, ...nextBatch]);
    setHasMore(currentLength + PHOTOS_PER_PAGE < photos.length);
    setIsLoadingMore(false);
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={10}>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Text fontSize="2xl" fontWeight="bold">
          Photo Gallery
        </Text>
        {currentUser && (
          <Button
            leftIcon={<FaUpload />}
            colorScheme="blue"
            onClick={onUploadOpen}
            isDisabled={userUploadsToday >= 2}
            title={userUploadsToday >= 2 ? "Daily upload limit reached" : ""}
          >
            Upload Photo {userUploadsToday >= 2 ? "(Limit Reached)" : ""}
          </Button>
        )}
      </Flex>

      {/* Photo Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {groupPhotos(visiblePhotos).map((group) => (
          <Box
            key={group.id}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            cursor="pointer"
            onClick={() => openPhotoView(group.photos[0])}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.02)" }}
            position="relative"
          >
            <Box position="relative">
              <Image
                src={group.photos[0].imageUrl}
                alt={group.photos[0].caption}
                w="100%"
                h="200px"
                objectFit="cover"
              />
              {group.photos.length > 1 && (
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme="blue"
                  borderRadius="full"
                  px={2}
                >
                  +{group.photos.length - 1}
                </Badge>
              )}
            </Box>
            <Box p={4}>
              <Text fontSize="sm" noOfLines={2}>
                {group.photos[0].caption}
              </Text>
              <HStack mt={2} justify="space-between">
                <HStack>
                  <Icon
                    as={FaHeart}
                    color="red.500"
                    transform="scale(1)"
                    transition="all 0.2s"
                  />
                  <Text fontSize="sm">
                    {Object.keys(group.photos[0].likes || {}).length}
                  </Text>
                  <Icon as={FaComment} color="gray.500" />
                  <Text fontSize="sm">
                    {group.photos[0].comments?.length || 0}
                  </Text>
                </HStack>
                <HStack>
                  <Avatar
                    size="xs"
                    src={group.photos[0].userPhotoURL || ""}
                    name={group.photos[0].uploadedBy}
                  />
                  <Text fontSize="xs">{group.photos[0].uploadedBy}</Text>
                </HStack>
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* Load More Button */}
      {hasMore && (
        <Flex justify="center" mt={8}>
          <Button
            onClick={loadMore}
            isLoading={isLoadingMore}
            loadingText="Loading more photos..."
            size="lg"
            colorScheme="blue"
            variant="outline"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            Load More Photos
          </Button>
        </Flex>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => {
          setSelectedFiles([]);
          setUploadCaption("");
          onUploadClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Photos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading || selectedFiles.length >= 3}
                ref={fileInputRef}
                hidden
                multiple
              />
              <Button
                leftIcon={<FaUpload />}
                onClick={handleSelectFile}
                w="100%"
                isDisabled={selectedFiles.length >= 3}
              >
                Select Photos (Max 3)
              </Button>

              {selectedFiles.length > 0 && (
                <SimpleGrid columns={3} spacing={2} w="100%">
                  {selectedFiles.map((file, index) => (
                    <Box key={index} position="relative">
                      <Image
                        src={file.preview}
                        alt={`Preview ${index + 1}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <IconButton
                        aria-label="Remove photo"
                        icon={<CloseIcon />}
                        size="xs"
                        position="absolute"
                        top={1}
                        right={1}
                        onClick={() => removeSelectedFile(index)}
                        colorScheme="red"
                        isRound
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              )}

              <Textarea
                placeholder="Add a caption..."
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                setSelectedFiles([]);
                setUploadCaption("");
                onUploadClose();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              isLoading={isUploading}
              isDisabled={
                isUploading ||
                !uploadCaption.trim() ||
                selectedFiles.length === 0
              }
              onClick={uploadFiles}
            >
              Upload{" "}
              {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Photo View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="white" maxW={{ base: "95vw", lg: "900px" }}>
          <ModalCloseButton
            size="lg"
            color="white"
            bg="blackAlpha.600"
            _hover={{ bg: "blackAlpha.700" }}
            borderRadius="full"
            zIndex={3}
            position="absolute"
            right={4}
            top={4}
          />
          <ModalBody p={0}>
            {selectedPhoto && (
              <VStack align="stretch" spacing={0}>
                <Box position="relative" bg="gray.900">
                  {selectedPhoto.bundleId &&
                    bundledPhotos[selectedPhoto.bundleId]?.length > 1 && (
                      <>
                        <IconButton
                          aria-label="Previous image"
                          icon={<ChevronLeftIcon boxSize={8} />}
                          position="absolute"
                          left={4}
                          top="50%"
                          transform="translateY(-50%)"
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          zIndex={2}
                          size="lg"
                          variant="solid"
                          bg="whiteAlpha.800"
                          _hover={{ bg: "white" }}
                          borderRadius="full"
                          boxShadow="lg"
                        />
                        <IconButton
                          aria-label="Next image"
                          icon={<ChevronRightIcon boxSize={8} />}
                          position="absolute"
                          right={4}
                          top="50%"
                          transform="translateY(-50%)"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          zIndex={2}
                          size="lg"
                          variant="solid"
                          bg="whiteAlpha.800"
                          _hover={{ bg: "white" }}
                          borderRadius="full"
                          boxShadow="lg"
                        />
                      </>
                    )}
                  <Image
                    src={
                      selectedPhoto.bundleId
                        ? bundledPhotos[selectedPhoto.bundleId][
                            currentImageIndex
                          ]?.imageUrl
                        : selectedPhoto.imageUrl
                    }
                    alt={selectedPhoto.caption}
                    w="100%"
                    maxH="70vh"
                    objectFit="contain"
                    transition="opacity 0.3s ease"
                  />
                  {selectedPhoto.bundleId &&
                    bundledPhotos[selectedPhoto.bundleId]?.length > 1 && (
                      <HStack
                        justify="center"
                        position="absolute"
                        bottom={4}
                        left={0}
                        right={0}
                        spacing={2}
                      >
                        {bundledPhotos[selectedPhoto.bundleId].map(
                          (_, index) => (
                            <Box
                              key={index}
                              w="2.5"
                              h="2.5"
                              borderRadius="full"
                              bg={
                                index === currentImageIndex
                                  ? "white"
                                  : "whiteAlpha.600"
                              }
                              transition="all 0.2s"
                              cursor="pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(index);
                              }}
                              _hover={{
                                transform: "scale(1.2)",
                                bg: "white",
                              }}
                            />
                          )
                        )}
                      </HStack>
                    )}
                </Box>
                <Box p={4}>
                  <HStack justify="space-between" mb={4}>
                    <HStack>
                      <Avatar
                        size="sm"
                        src={selectedPhoto.userPhotoURL || ""}
                        name={selectedPhoto.uploadedBy}
                      />
                      <Text fontWeight="bold">{selectedPhoto.uploadedBy}</Text>
                    </HStack>
                    {currentUser && (
                      <IconButton
                        aria-label="Like photo"
                        icon={
                          selectedPhoto.likes?.[currentUser.uid] ? (
                            <Icon
                              as={FaHeart}
                              color="red.500"
                              transform="scale(1)"
                              transition="all 0.2s"
                              _hover={{ transform: "scale(1.1)" }}
                              animation={
                                selectedPhoto.likes?.[currentUser.uid]
                                  ? "heartBeat 0.3s ease-in-out"
                                  : undefined
                              }
                            />
                          ) : (
                            <Icon
                              as={FaRegHeart}
                              transform="scale(1)"
                              transition="all 0.2s"
                              _hover={{ transform: "scale(1.1)" }}
                            />
                          )
                        }
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(selectedPhoto);
                        }}
                        sx={{
                          "@keyframes heartBeat": {
                            "0%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.3)" },
                            "100%": { transform: "scale(1)" },
                          },
                        }}
                      />
                    )}
                  </HStack>

                  <Text mb={4}>{selectedPhoto.caption}</Text>
                  <Text fontSize="sm" color="gray.500" mb={4}>
                    Posted {formatTimestamp(selectedPhoto.timestamp)}
                  </Text>

                  <Divider mb={4} />

                  {/* Comments Section */}
                  <VStack align="stretch" spacing={4}>
                    <Text fontWeight="bold">
                      Comments ({selectedPhoto.comments?.length || 0})
                    </Text>
                    <VStack align="stretch" maxH="200px" overflowY="auto">
                      {selectedPhoto.comments?.map((comment) => (
                        <HStack
                          key={comment.id}
                          spacing={3}
                          alignItems="flex-start"
                        >
                          <Avatar
                            size="xs"
                            src={comment.userPhotoURL || ""}
                            name={comment.userName}
                          />
                          <Box flex={1}>
                            <HStack spacing={2} mb={1}>
                              <Text fontSize="sm" fontWeight="bold">
                                {comment.userName}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {formatTimestamp(comment.timestamp)}
                              </Text>
                            </HStack>
                            <Text fontSize="sm">{comment.text}</Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>

                    {currentUser && (
                      <HStack>
                        <Input
                          placeholder="Add a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button
                          colorScheme="blue"
                          onClick={handleComment}
                          isDisabled={!commentText.trim()}
                        >
                          Post
                        </Button>
                      </HStack>
                    )}
                  </VStack>

                  {currentUser && currentUser.uid === selectedPhoto?.userId && (
                    <IconButton
                      aria-label="Delete photo"
                      icon={<DeleteIcon />}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeletePhoto(selectedPhoto)}
                    />
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default PhotosPage;
