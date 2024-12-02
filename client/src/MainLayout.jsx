// MainLayout.jsx
import React, { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import MapComponent from './components/map/Map';

const MainLayout = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  return (
    <div className="app-container">
      <div className="navbar-container">
        <Navbar setSelectedCoordinates={setSelectedCoordinates} />
        <div className="main-content" style={{  height: "100vh"}}>
          <MapComponent selectedCoordinates={selectedCoordinates} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;