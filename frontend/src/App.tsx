import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Box } from "@chakra-ui/react";
import HeroSection from "./components/HeroSection";
import EventsComponent from "./components/EventsComponent";
import RunDaysComponent from "./components/RunDaysComponent";
import ImageSlider from "./components/ImageSlider";
import RunDetailPage from "./components/RunDetailPage";
import CaptainsComponent from "./components/CaptainsComponent";
import CaptainsPage from "./components/CaptainsPage";
import OrderPage from "./components/OrderPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Box zIndex="1000" position={"relative"}>
          <Navbar />
        </Box>
        {/* padding of navbar underneath */}
        <Box marginTop="150px" zIndex={1}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* This container centers the slider */}
                    <Box
                      maxWidth="1500px"
                      width="100%"
                      position="relative"
                      zIndex="1"
                    >
                      <ImageSlider />
                    </Box>
                  </Box>
                  <RunDaysComponent />
                  <CaptainsComponent />
                  <EventsComponent />
                </>
              }
            />
            <Route path="/runs/:day" element={<RunDetailPage />} />
            <Route path="/captains" element={<CaptainsPage />} />
            <Route path="/order" element={<OrderPage />} />
          </Routes>
        </Box>

        <Box h="50vh" />
      </div>
    </Router>
  );
}

export default App;
