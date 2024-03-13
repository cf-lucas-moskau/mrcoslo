import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import { Box } from "@chakra-ui/react";
import HeroSection from "./components/HeroSection";
import EventsComponent from "./components/EventsComponent";
import RunDaysComponent from "./components/RunDaysComponent";
import ImageSlider from "./components/ImageSlider";

function App() {
  return (
    <div>
      <Box zIndex="1000" position={"relative"}>
        <Navbar />
      </Box>
      {/* padding of navbar underneath */}
      <Box marginTop="150px" zIndex={1}>
        <HeroSection />
        <Box display="flex" justifyContent="center" alignItems="center">
          {/* This container centers the slider */}
          <Box maxWidth="1500px" width="100%" position="relative" zIndex="1">
            <ImageSlider />
          </Box>
        </Box>
        <RunDaysComponent />
        <EventsComponent />
      </Box>

      <Box h="50vh" />
    </div>
  );
}

export default App;
