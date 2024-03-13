import { Box, Heading, IconButton } from "@chakra-ui/react";
import React from "react";
import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Previous slide"
      icon={<ChevronLeftIcon />}
      position="absolute"
      left="10px"
      top="50%"
      transform="translateY(-50%)"
      zIndex="2"
      onClick={onClick}
      // Apply any additional styling or props you need
    />
  );
};

// Custom Next Arrow
const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      aria-label="Next slide"
      icon={<ChevronRightIcon />}
      position="absolute"
      right="10px"
      top="50%"
      transform="translateY(-50%)"
      zIndex="2"
      onClick={onClick}
      // Apply any additional styling or props you need
    />
  );
};

// Sample images, replace these URLs with your actual image sources
const images = [
  "images/pic1.jpg",
  "images/pic2.jpg",
  "images/pic3.jpg",
  "images/pic4.jpg",
  "images/pic5.jpg",
  "images/pic6.jpg",
  "images/pic7.jpg",
  // Add more images as needed
];

const ImageSlider = () => {
  // Settings for the slider
  const settings = {
    dots: true, // Show dot indicators at the bottom
    infinite: true, // Infinite looping
    speed: 500, // Transition speed
    slidesToShow: 3, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at once
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Delay between each autoplay transition
    cssEase: "linear", // Animation timing function
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768, // Adjust the number of slides for smaller screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div
      className="my-slider"
      style={{
        overflow: "hidden",
        marginBottom: "30px",
        height: "480px",
      }}
    >
      <Box
        style={{ width: "100%", overflow: "hidden" }}
        alignContent={"center"}
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        marginTop={"40px"}
        textAlign={"center"}
      >
        <Heading marginBottom={"30px"} as={"h2"}>
          "Runners with a beer trinking problem"
        </Heading>
      </Box>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Slide ${index}`}
              style={{
                width: "100%", // This makes the image take the full width of its container
                height: "300px", // Fixed height for all images
                objectFit: "cover", // Resize the image to cover the container while maintaining its aspect ratio
                display: "block",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
