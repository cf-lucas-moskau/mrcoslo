import React, { useEffect, useState } from "react";
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

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (sectionId: string) => {
    // If we're already on the home page, just scroll
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we're on a different page, navigate home and then scroll
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

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

  const menuItems = [
    { name: "Regular Runs", id: "regular-runs" },
    { name: "Captains", id: "captains" },
  ];

  const controls = useAnimation();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastActionScrollY, setLastActionScrollY] = useState(0);
  const [lastActionScrollTime, setLastActionScrollTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (lastActionScrollTime + 200 > Date.now()) {
        return;
      }

      if (currentScrollY > lastActionScrollY + 80) {
        controls.start({ opacity: 0 });
        const timeoutId = setTimeout(() => {
          controls.start({ display: "none" });
        }, 200);
        setLastActionScrollY(currentScrollY);
        setLastActionScrollTime(Date.now());
      } else if (currentScrollY < lastActionScrollY) {
        controls.start({ opacity: 1, display: "block" });
        setLastActionScrollY(currentScrollY);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, lastScrollY]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={controls}
      style={{ width: "100%", position: "fixed", top: 0, left: 0 }}
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bgGradient="linear(to-r, #B9DDB9, #D5B2D3, #204081)"
        color="white"
      >
        <Flex align="center" mr={5} height={"5rem"}>
          <RouterLink to="/">
            <Image
              src="/images/mrc-logo.jpg"
              alt="Logo"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              height={["130%", "140%"]}
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
                  onClick={() => handleNavigation(item.id)}
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
                onClick={() => handleNavigation(item.id)}
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
