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

const Navbar: React.FC = () => {
  const menuItems: { name: string; link: string }[] = [
    { name: "Us", link: "#us" },
    { name: "Regular Runs", link: "#regular-runs" },
    { name: "Facebook Events", link: "#facebook-events" },
    { name: "Contact", link: "#contact" },
  ];

  const controls = useAnimation();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastActionScrollY, setLastActionScrollY] = useState(0);
  const [lastActionScrollTime, setLastActionScrollTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Scroll Down: Make navbar slightly transparent
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
      }
      // Scroll Up: Make navbar fully opaque
      else if (currentScrollY < lastActionScrollY) {
        controls.start({ opacity: 1, display: "block" });
        setLastActionScrollY(currentScrollY);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
        bgGradient="linear(to-r, #B9DDB9, #D5B2D3, #204081)" // Gradient background
        color="white"
      >
        <Flex align="center" mr={5} height={"5rem"}>
          <Image
            src="/images/mrc-logo.jpg"
            alt="Logo"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            height={["130%", "140%"]} // This makes the logo overflow the Navbar height
          />
        </Flex>

        {/* Menu Items */}
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
              bgGradient="linear(to-r, #B9DDB9, #D5B2D3, #204081)" // Gradient background
              color="white"
            >
              {/* Add your menu items here */}
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  as="a"
                  href={item.link}
                  bgGradient="linear(to-r, #B9DDB9, #D5B2D3, #204081)" // Gradient background
                  color="white"
                >
                  {item.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ) : (
          // Desktop Menu
          <Stack direction="row" spacing={4}>
            {/* Add your menu items here */}
            {menuItems.map((item) => (
              <Box as="a" href={item.link} _hover={{ textDecoration: "none" }}>
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
