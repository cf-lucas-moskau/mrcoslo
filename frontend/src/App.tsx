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
import RacesPage from "./components/RacesPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Box marginTop="80px">
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
                    <Box maxWidth="1500px" width="100%" position="relative">
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
            <Route path="/races" element={<RacesPage />} />
          </Routes>
        </Box>
      </div>
    </Router>
  );
}

export default App;
