import React, { createContext, useState } from 'react';

export const PriceDistanceContext = createContext({
  price: [0, 50],
  setPrice: () => {},
  distance: 0.8,
  setDistance: () => {},
  selectedCoordinates: null,
  setSelectedCoordinates: () => {},
});

export const PriceDistanceProvider = ({ children }) => {
  const [order, setOrder] = useState(""); // for sorting
  const [showFreeOnly, setShowFreeOnly] = useState(false); // for showing only free parking spots
  const [userCoords, setUserCoords] = useState(null); // State for storing user coordinates

  const [distance, setDistance] = useState(0.5);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null); // New state


  return (
    <PriceDistanceContext.Provider
      value={{distance, setDistance, selectedCoordinates, setSelectedCoordinates , userCoords , setUserCoords,order , setOrder, showFreeOnly , setShowFreeOnly }}
    >
      {children}
    </PriceDistanceContext.Provider>
  );
};
