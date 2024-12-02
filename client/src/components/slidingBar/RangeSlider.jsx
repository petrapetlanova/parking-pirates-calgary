import React, { useContext, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { PriceDistanceContext } from '../context/PriceDistanceContext'; // import context

function valuetext(value) {
  return `${value} km`;
}

export default function RangeSlider() {
  // Access context values (price, distance, setPrice, setDistance)
  const { price, setPrice, distance, setDistance } = useContext(PriceDistanceContext);
  const [delayedDistance, setDelayedDistance] = useState(distance); // Local state to handle delayed updates
  const timeoutRef = useRef(null); // Ref to store the timeout ID

  // console.log('Price and Distance:', PriceDistanceContext); for debugging purposes

  // const handlePriceChange = (event, newPrice) => {
  //   setPrice(newPrice); // Calls the real setPrice function
  // };

  const handleDistanceChange = (event, newDistance) => {
    // Clear any previously set timeout to prevent multiple updates in quick succession
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to delay the distance update
    timeoutRef.current = setTimeout(() => {
      setDistance(newDistance); // Calls the real setDistance function
    }, 200); // 500ms delay (you can adjust the delay as needed)

    // Update the local state immediately to show the updated value on the slider
    setDelayedDistance(newDistance);
  };

  return (
    <Box sx={{ width: 300, 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {/* <Slider
        style={{ margin: 10,
          color: 'white'
         }}
        getAriaLabel={() => 'Price range'}
        value={price}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        getAriaValueText={(value) => `${value}$`}
        min={0}
        max={50}
      /> */} 
      <Box sx={{ color: 'white' }} >Distance: {valuetext(delayedDistance)}</Box>
      <Slider
        style={{ margin: 10, color: 'white' }}
        getAriaLabel={() => 'Distance range'}
        value={delayedDistance} // Use the delayed value for smoother updates
        onChange={handleDistanceChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={0.1}
        max={10}
        step={0.01}
      />
    </Box>
  );
}
