import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchComponent.css";
import L, { DivIcon } from "leaflet";
import "leaflet-control-geocoder";

const MIN_SEARCH_LENGTH = 2;

const SearchComponent = ({ map, setSelectedCoordinates }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [geocoder, setGeocoder] = useState(null);
  // const [isFocused, setIsfocused] = useState(false);

  useEffect(() => {
    // Initializes the geocoder with Calgary focus
    const geocoderControl = L.Control.Geocoder.nominatim({
      geocodingQueryParams: {
        countrycodes: "ca",
        viewbox: "-114.2,50.85,-113.85,51.2", // Calgary bounding box
        bounded: 1,
        limit: 10,
        dedupe: 1, // Remove duplicates
        "accept-language": "en",
      },
      suggestMinLength: MIN_SEARCH_LENGTH,
      defaultMarkGeocode: false,
    });

    setGeocoder(geocoderControl);
  }, [map]);

  const handleChange = (event) => {
    const value = event.target.value;
    
    setInput(value);

    if (!value || value.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      return;
    }

    if (geocoder) {
      geocoder.geocode(value, (geoResults) => {
        console.log("Geo Results:", geoResults); // Debugging: Log raw geocoder results

        const filteredResults = geoResults
          .filter((result) =>
            ["calgary", "alberta"].some((region) =>
              result.properties.address?.city?.toLowerCase().includes(region) ||
              result.properties.address?.state?.toLowerCase().includes(region)
            )
          )
          .map((result) => ({
            title: result.name || result.properties.display_name,
            type: "address",
            coordinates: {
              lat: result.center.lat,
              lng: result.center.lng,
            },
          }));

        setResults(filteredResults);
      });
    }
  };
  const handleSelectResult = (result) => {
    setSelectedCoordinates({
      lat: result.coordinates.lat,
      lng: result.coordinates.lng,
    });
    setResults([]);
    setInput(""); // Clear input after selection
  };
  return (
  <div className="search-wrapper">
          <form
        className="search"
        // onFocus={() => setIsfocused(true)}
        // onBlur={(e) => {
          // if (!e.currentTarget.contains(e.relatedTarget)) {
          //   setIsfocused(false);
          // }
        // }}
      >
        <input
          type="text"
          id="search"
          className="search__input text-white"
          placeholder="Search fer a location, matey!"
          value={input}
          onChange={handleChange}
          style={{fontSize: "1rem"}}
        />
        <button type="button" className="search__button">
          <FaSearch />
        </button>
      </form>

      {results.length > 0 && (
        <div className="results-list">
          {results.map((result, id) => (
            <div
            key={id}
            className="search-result"
            onClick={() => handleSelectResult(result)}
          >
              <div className="result-title">{result.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
