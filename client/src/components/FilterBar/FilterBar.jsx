// FilterBar.jsx
import './FilterBar.css'
import { useState, useEffect } from 'react'

// add userLocation in FilterBar later
export default function FilterBar() {
    const [costUserInput, setCostUserInput] = useState("");
    const [distanceUserInput, setDistanceUserInput] = useState("");
    const [parkingSpots, setParkingSpots] = useState([]);
    


    // Hardcoded downtown Calgary coordinates for testing
    const DOWNTOWN_CALGARY = {
        latitude: 51.0447,
        longitude: -114.0719
    };

    // Function to fetch parking spots based on distance
    const fetchParkingSpots = async () => {

        try {

            // Use hardcoded location for now
            const locationToUse = DOWNTOWN_CALGARY;

             // Later we'll use: const locationToUse = userLocation || DOWNTOWN_CALGARY;

            // Convert km to meters for the API
            const radiusInMeters = parseFloat(distanceUserInput) * 1000;
            console.log(`Fetching parking spots within ${radiusInMeters}m of`, locationToUse);
            
            const response = await fetch(
                `/api/parking/search?` + 
                `latitude=${locationToUse.latitude}&` +
                `longitude=${locationToUse.longitude}&` +
                `radius=${radiusInMeters}`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setParkingSpots(data.spots);
            console.log("Found parking spots:", data);
            
            // Results passed up to App.js and then down to Map.js
            // if (props.onParkingSpotsFound) {
            //     props.onParkingSpotsFound(data.spots);
            // }

        } catch (error) {
            console.error("Error fetching parking spots:", error);
            alert("Error finding parking spots");
        }
    };

    // Debounce the API call when distance changes
    useEffect(() => {
        if (distanceUserInput && userLocation) {
            const timeoutId = setTimeout(() => {
                fetchParkingSpots();
            }, 500); // Wait 500ms after user stops changing distance

            return () => clearTimeout(timeoutId);
        }
    }, [distanceUserInput, userLocation]);

    function handleChange(e) {
        const { id, value } = e.target;
        if (id === "costRange") {
            setCostUserInput(value);
        }
        else if (id === "distanceRange") {
            setDistanceUserInput(value);
        }
    }

    function resetValues() {
        setCostUserInput(0);
        setDistanceUserInput(0);
        setParkingSpots([]);
    }

    return (
        <>
            <div className="filterBarContainer">
                Cost($): <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1" 
                    className="slider-with-ticks" 
                    id="costRange" 
                    value={costUserInput} 
                    onInput={handleChange}
                />
                <p>${costUserInput}</p>
            </div>

            <div className="filterBarContainer">
                Distance(km): <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1" 
                    className="slider-with-ticks" 
                    id="distanceRange" 
                    value={distanceUserInput} 
                    onInput={handleChange}
                />
                <p>{distanceUserInput}km</p>
            </div>

            <button onClick={resetValues}>
                Reset Filters
            </button>

            {/* Optional: Display number of spots found */}
            {parkingSpots.length > 0 && (
                <p>Found {parkingSpots.length} parking spots within {distanceUserInput}km</p>
            )}
        </>
    )
}