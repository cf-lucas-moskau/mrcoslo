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
import PhotosPage from "./components/PhotosPage";
import HolmenkollenPage from "./components/HolmenkollenPage";
import FeedbackButton from "./components/FeedbackButton";
import MostLikedPhoto from "./components/MostLikedPhoto";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import CookiePolicy from "./components/CookiePolicy";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
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
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      bg="gray.50"
                      py={8}
                    >
                      <Box maxWidth="1200px" width="100%" px={4}>
                        <MostLikedPhoto />
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
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/holmenkollen" element={<HolmenkollenPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
            </Routes>
          </Box>
          <FeedbackButton />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
