// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { PriceDistanceProvider } from "./components/context/PriceDistanceContext";

// Page imports
import Home from "./pages/Home";
import MainLayout from "./MainLayout";

import "./App.css";
import AboutUs from "./pages/AboutUs";

const App = () => {
  return (
    <PriceDistanceProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="about" element={<AboutUs />} />

        {/* Protected routes with MainLayout */}
        <Route path="/dashboard" element={<MainLayout />}></Route>
      </Routes>
    </PriceDistanceProvider>
  );
};

export default App;
