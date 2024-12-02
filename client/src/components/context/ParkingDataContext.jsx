import React, { createContext, useState, useEffect, useContext } from 'react';
import { PriceDistanceContext } from './PriceDistanceContext';

const ParkingDataContext = createContext(null);

const ParkingDataProvider = ({ children }) => {
  const [parkingLots, setParkingLots] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { distance, selectedCoordinates, order, showFreeOnly } = useContext(PriceDistanceContext);

  useEffect(() => {
    const fetchParkingData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = '/api/parkingrates';
        const params = new URLSearchParams();

        if (selectedCoordinates) {
          params.append('lat', selectedCoordinates.lat);
          params.append('lng', selectedCoordinates.lng);
          params.append('maxDistance', distance);
        }

        if (order) {
          params.append('sortOrder', order);
        }

        if (showFreeOnly) {
          params.append('showFreeOnly', showFreeOnly);
        }

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        console.log('Fetching from URL:', url); // Debug log

        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't gotten JSON!");
        }

        const data = await response.json();
        setParkingLots(data);
      } catch (err) {
        console.error('Error loading parking data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParkingData();
  }, [selectedCoordinates, distance, order, showFreeOnly]);

  return (
    <ParkingDataContext.Provider value={{ parkingLots, isLoading, error }}>
      {children}
    </ParkingDataContext.Provider>
  );
};

export const useParkingData = () => {
  const context = useContext(ParkingDataContext);
  if (context === null) {
    throw new Error('useParkingData must be used within a ParkingDataProvider');
  }
  return context;
};

export default ParkingDataProvider;