import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import { Box } from "@chakra-ui/react";
import HeroSection from "./components/HeroSection";
import EventsComponent from "./components/EventsComponent";
import RunDaysComponent from "./components/RunDaysComponent";

function App() {
  return (
    <div>
      <Box zIndex={999}>
        <Navbar />
      </Box>
      {/* padding of navbar underneath */}
      <Box marginTop="150px" zIndex={1}>
        <HeroSection />
        <RunDaysComponent />
        <EventsComponent />
      </Box>

      <Box h="50vh" />
    </div>
  );
}

export default App;
