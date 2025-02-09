import { Box, Heading, IconButton, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Previous slide"
      icon={<ChevronLeftIcon boxSize={6} />}
      position="absolute"
      left={{ base: "5px", md: "10px" }}
      top="50%"
      transform="translateY(-50%)"
      zIndex="2"
      onClick={onClick}
      bg="whiteAlpha.800"
      _hover={{ bg: "whiteAlpha.900" }}
      size={{ base: "sm", md: "md" }}
      boxShadow="lg"
      borderRadius="full"
      display={{ base: "none", md: "flex" }}
    />
  );
};

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Next slide"
      icon={<ChevronRightIcon boxSize={6} />}
      position="absolute"
      right={{ base: "5px", md: "10px" }}
      top="50%"
      transform="translateY(-50%)"
      zIndex="2"
      onClick={onClick}
      bg="whiteAlpha.800"
      _hover={{ bg: "whiteAlpha.900" }}
      size={{ base: "sm", md: "md" }}
      boxShadow="lg"
      borderRadius="full"
      display={{ base: "none", md: "flex" }}
    />
  );
};

const images = [
  "images/pic1.jpg",
  "images/pic2.jpg",
  "images/pic3.jpg",
  "images/pic4.jpg",
  "images/pic5.jpg",
  "images/pic6.jpg",
  "images/pic7.jpg",
];

const ImageSlider = () => {
  const slidesToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 }) || 1;

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box
      className="slider-container"
      position="relative"
      py={{ base: 6, md: 10 }}
      px={{ base: 4, md: 8 }}
      maxW="100vw"
      overflow="hidden"
      bg="gray.50"
    >
      <Box maxW="1200px" mx="auto" textAlign="center" mb={{ base: 6, md: 10 }}>
        <Heading
          as="h2"
          size={{ base: "xl", md: "2xl" }}
          color="#204081"
          fontWeight="bold"
        >
          "Runners with a drinking problem"
        </Heading>
      </Box>

      <Box
        sx={{
          ".slick-slide": {
            px: 2,
          },
          ".slick-dots": {
            bottom: "-40px",
            li: {
              button: {
                _before: {
                  color: "gray.500",
                  fontSize: "8px",
                },
              },
            },
            "li.slick-active button:before": {
              color: "#204081",
            },
          },
        }}
      >
        <Slider {...settings}>
          {images.map((img, index) => (
            <Box
              key={index}
              position="relative"
              overflow="hidden"
              borderRadius="lg"
              boxShadow="lg"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.02)" }}
            >
              <Box
                as="img"
                src={img}
                alt={`Slide ${index + 1}`}
                w="100%"
                h={{ base: "200px", md: "300px", lg: "400px" }}
                objectFit="cover"
                loading="lazy"
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ImageSlider;
