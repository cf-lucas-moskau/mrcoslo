import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { motion, useAnimation } from "framer-motion";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const SCROLL_UP = "up";
const SCROLL_DOWN = "down";

interface MenuItem {
  name: string;
  id?: string;
  path?: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [scrollDirection, setScrollDirection] = useState(SCROLL_UP);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNavigation = (sectionId: string) => {
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollingUp = prevScrollY > currentScrollY;
    const scrollDifference = Math.abs(currentScrollY - prevScrollY);
    const minScrollDistance = 10; // Minimum scroll distance to trigger change

    // Only update if we've scrolled more than the minimum distance
    if (scrollDifference > minScrollDistance) {
      // Determine scroll direction and visibility
      if (scrollingUp) {
        if (scrollDirection !== SCROLL_UP) {
          setScrollDirection(SCROLL_UP);
          setIsVisible(true);
        }
      } else {
        if (scrollDirection !== SCROLL_DOWN && currentScrollY > 100) {
          setScrollDirection(SCROLL_DOWN);
          setIsVisible(false);
        }
      }
      setPrevScrollY(currentScrollY);
    }
  }, [prevScrollY, scrollDirection]);

  // Throttle scroll handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const throttledScrollHandler = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = undefined as unknown as NodeJS.Timeout;
      }, 100); // Throttle to every 100ms
    };

    window.addEventListener("scroll", throttledScrollHandler);
    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  // Handle visibility animation
  useEffect(() => {
    controls.start({
      y: isVisible ? 0 : -100,
      opacity: isVisible ? 1 : 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    });
  }, [isVisible, controls]);

  // Handle scrolling after navigation to home page
  useEffect(() => {
    if (window.location.pathname === "/") {
      const state = window.history.state;
      const scrollTo = state?.usr?.scrollTo;
      if (scrollTo) {
        const element = document.getElementById(scrollTo);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const menuItems: MenuItem[] = [
    { name: "Regular Runs", id: "regular-runs" },
    { name: "Captains", id: "captains" },
    { name: "Races", path: "/races" },
  ];

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
      style={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bgGradient="linear(to-r, #B9DDB9, #D5B2D3, #204081)"
        color="white"
        boxShadow="0 2px 10px rgba(0,0,0,0.1)"
        height="80px"
      >
        <Flex align="center" mr={5} height="100%">
          <RouterLink to="/">
            <Image
              src="/images/mrc-logo.jpg"
              alt="Logo"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              height="120%"
              cursor="pointer"
            />
          </RouterLink>
        </Flex>

        {isMobile ? (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              variant="outline"
              aria-label="Options"
              color={"white"}
            />
            <MenuList
              bgGradient="linear(to-r, #B9DDB9, #D5B2D3, #204081)"
              color="white"
            >
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else if (item.id) {
                      handleNavigation(item.id);
                    }
                  }}
                  bgGradient="linear(to-r, #B9DDB9, #D5B2D3, #204081)"
                  color="white"
                  cursor="pointer"
                >
                  {item.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ) : (
          <Stack direction="row" spacing={4}>
            {menuItems.map((item, index) => (
              <Box
                key={index}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  } else if (item.id) {
                    handleNavigation(item.id);
                  }
                }}
                cursor="pointer"
                _hover={{ textDecoration: "none" }}
              >
                {item.name}
              </Box>
            ))}
          </Stack>
        )}
      </Flex>
    </motion.div>
  );
};

export default Navbar;
