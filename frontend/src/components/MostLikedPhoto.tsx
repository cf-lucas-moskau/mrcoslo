import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Icon,
  Avatar,
  Badge,
  Button,
  Heading,
} from "@chakra-ui/react";
import { FaHeart, FaComment } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { formatDistanceToNow, subDays } from "date-fns";

interface Photo {
  id: string;
  imageUrl: string;
  caption: string;
  uploadedBy: string;
  userPhotoURL?: string | null;
  timestamp: number;
  likes: { [key: string]: boolean };
  comments: any[];
  bundleId?: string | null;
  isBundle?: boolean;
  totalLikes?: number;
}

interface GroupedPhoto extends Photo {
  isBundle: boolean;
  totalLikes: number;
}

const MostLikedPhoto: React.FC = () => {
  const [mostLikedPhoto, setMostLikedPhoto] = useState<GroupedPhoto | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const photosRef = ref(db, "photos");
    const unsubscribe = onValue(photosRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setIsLoading(false);
        return;
      }

      // Convert data to array and add id to each photo
      const photos = Object.entries(data).map(([id, photo]: [string, any]) => ({
        id,
        ...photo,
        comments: photo.comments ? Object.values(photo.comments) : [],
      }));

      // Filter photos from the last 7 days
      const sevenDaysAgo = subDays(new Date(), 7).getTime();
      const recentPhotos = photos.filter(
        (photo) => photo.timestamp > sevenDaysAgo
      );

      // Group photos by bundleId
      const groupedPhotos = recentPhotos.reduce(
        (acc: { [key: string]: GroupedPhoto }, photo) => {
          if (photo.bundleId) {
            if (!acc[photo.bundleId]) {
              acc[photo.bundleId] = {
                ...photo,
                isBundle: true,
                totalLikes: Object.keys(photo.likes || {}).length,
              };
            } else {
              acc[photo.bundleId].totalLikes += Object.keys(
                photo.likes || {}
              ).length;
            }
          } else {
            acc[photo.id] = {
              ...photo,
              isBundle: false,
              totalLikes: Object.keys(photo.likes || {}).length,
            };
          }
          return acc;
        },
        {}
      );

      // Find the most liked photo/bundle
      const mostLiked = Object.values(groupedPhotos).reduce(
        (max: GroupedPhoto, current: GroupedPhoto) =>
          current.totalLikes > max.totalLikes ? current : max,
        { ...recentPhotos[0], isBundle: false, totalLikes: -1 } as GroupedPhoto
      );

      setMostLikedPhoto(mostLiked.totalLikes > -1 ? mostLiked : null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading || !mostLikedPhoto) {
    return null;
  }

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="xl"
      maxW="400px"
      mx="auto"
      my={8}
    >
      <VStack spacing={0}>
        <Box position="relative" width="100%">
          <Image
            src={mostLikedPhoto.imageUrl}
            alt={mostLikedPhoto.caption}
            w="100%"
            h="300px"
            objectFit="cover"
          />
          {mostLikedPhoto.isBundle && (
            <Badge
              position="absolute"
              top={2}
              right={2}
              colorScheme="blue"
              borderRadius="full"
              px={2}
            >
              Multiple Photos
            </Badge>
          )}
        </Box>
        <Box p={4} width="100%">
          <Heading size="md" mb={2}>
            Most Liked Recent Photo
          </Heading>
          <Text fontSize="sm" noOfLines={2} mb={3}>
            {mostLikedPhoto.caption}
          </Text>
          <HStack justify="space-between" mb={3}>
            <HStack>
              <Icon as={FaHeart} color="red.500" />
              <Text fontSize="sm">
                {mostLikedPhoto.totalLikes}{" "}
                {mostLikedPhoto.totalLikes === 1 ? "like" : "likes"}
              </Text>
              <Icon as={FaComment} color="gray.500" ml={2} />
              <Text fontSize="sm">{mostLikedPhoto.comments?.length || 0}</Text>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              {formatDistanceToNow(mostLikedPhoto.timestamp, {
                addSuffix: true,
              })}
            </Text>
          </HStack>
          <HStack justify="space-between" align="center">
            <HStack>
              <Avatar
                size="sm"
                src={mostLikedPhoto.userPhotoURL || ""}
                name={mostLikedPhoto.uploadedBy}
              />
              <Text fontSize="sm">{mostLikedPhoto.uploadedBy}</Text>
            </HStack>
            <Button
              as={RouterLink}
              to="/photos"
              size="sm"
              colorScheme="blue"
              variant="outline"
            >
              View All Photos
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MostLikedPhoto;
