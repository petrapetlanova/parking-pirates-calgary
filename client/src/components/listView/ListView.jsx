import React, { useState, useContext, useEffect, useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { VariableSizeList as List } from "react-window";
import { PriceDistanceContext } from "../context/PriceDistanceContext";
import { FaSquareParking } from "react-icons/fa6";
import { MdOutlineTimer } from "react-icons/md";
import "./ListView.css"

const ListView = ({ setSelectedCoordinates, setOpen, setIsClicked }) => {
  const distancePrice = useContext(PriceDistanceContext);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const listRef = useRef();

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/parkingrates?lat=${distancePrice.userCoords[0]}&lng=${distancePrice.userCoords[1]}&maxDistance=${distancePrice.distance}&showFreeOnly=${distancePrice.showFreeOnly}&sortOrder=${distancePrice.order}`
        );
        const data = await response.json();
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (distancePrice.userCoords) {
      fetchFilteredData();
    }
  }, [distancePrice]);

  const handleSelectResult = (result) => {
    // console.log("Selected Result:", result); for debuging purpose

    let lat, lng;

    // Try first format (coordinates[0][0])
    if (result?.coordinates?.coordinates?.[0]?.[0]) {
      const coords = result.coordinates.coordinates[0][0];
      // Check if it's a nested array format
      if (Array.isArray(coords?.[0])) {
        lng = coords[0][0];
        lat = coords[0][1];
      } else {
        // Direct coordinates format
        lng = coords[0];
        lat = coords[1];
      }
    }

    // Validate and set coordinates
    if (isValidCoordinate(lat, lng)) {
      setSelectedCoordinates({ lat, lng });
      setOpen(false);
      setIsClicked(false);
      console.log("Setting coordinates:", { lat, lng });
    } else {
      console.warn("Invalid or missing coordinates in result:", result);
    }
  };

  // Helper function to validate coordinates
  const isValidCoordinate = (lat, lng) => {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      !isNaN(lat) &&
      !isNaN(lng)
    );
  };

  const closeAllPanels = () => {
    setExpanded(null); // Collapse all panels
    if (listRef.current) {
      listRef.current.resetAfterIndex(0, true); // Recalculate layout
    }
  };

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    closeAllPanels(); // Collapse all panels
    setExpanded(isExpanded ? panel : null);
    if (listRef.current) {
      listRef.current.resetAfterIndex(panel, true);
    }
  };

  const getItemSize = (index) => {
    return expanded === index ? 450 : 45;
  };

  const Row = React.memo(({ index, style }) => {
    const result = filteredData[index];

    return (
      <div
        style={{
          ...style,
          height: "100vh",
          position: "absolute",
          left: 0,
          right: 0,
          top: style.top,
          padding: "2px 0",
          scrollbarWidth: "none",
        }}
      >
        <Accordion
          expanded={expanded === index}
          onChange={handleAccordionChange(index)}
          TransitionProps={{
            timeout: 200,
          }}
          sx={{
            "&.MuiAccordion-root": {
              margin: 0,
              "&:before": {
                display: "none",
              },
            },
            "& .MuiAccordionSummary-root": {
              minHeight: 48,

              backgroundColor: "#242423",
              color: "white",
              "&.Mui-expanded": {
                minHeight: 48,
                backgroundColor: "#000000",
                color: "white !important",
              },
            },
            "& .MuiAccordionSummary-content": {
              whiteSpace: "nowrap", //to avoid breaking lines in text
              margin: "12px 0",
              // flexWrap: "nowrap",

              "&.Mui-expanded": {
                margin: "12px 0",
              },
            },
            "& .MuiAccordionDetails-root": {
              backgroundColor: "#2c2c2c",
              color: "white",
              padding: "8px 16px",
              minHeight: "340px",
              overflowY: "auto",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            // style={{ overflow: "hidden" }}
          >
            <div
              className="text-sm"
              style={{
                justifyContent: "space-between",
                width: "450px",
                // overflow: "hidden",
              }}
            >
              <FaSquareParking
                size={22}
                color="#grey"
                style={{ top: "2px", position: "relative" }}
              />{" "}
              {result.title || "Parking Location"}
            </div>
            <span
              style={{ maxWidth: "10px" ,fontWeight: "bold", color: "#ffc900", fontSize: "1em" }}
            >
              {result.dailyRate}
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ padding: "8px ", position: "relative" }}>
              <strong> {result.zoneType} </strong>
            </div>
            <div className="text-sm">
              <strong>Type:</strong> {result.stallType}
            </div>
            {result.parkingRates && result.parkingRates.length > 0 ? (
              result.parkingRates.map((rate, i) => (
                <div key={i} className="text-sm mb-1">
                  {rate.period || "N/A"}
                  <br />
                  <strong></strong> {rate.rate || "N/A"}
                  {i < result.parkingRates.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm">
                <MdOutlineTimer
                  style={{ top: "2px", position: "relative" }}
                  size={20}
                />{" "}
                {result.enforceableTime}
              </div>
            )}

            <MdOutlineTimer
              style={{ top: "2px", position: "relative", marginRight: "5px" }}
              size={20}
            />
            Max Time:{" "}
            <span style={{ color: "#fff500" }}>
  {result.maxTime === "null" || result.maxTime === "" || isNaN(result.maxTime)
    ? "No maximum time"
    : result.maxTime < 60
    ? `${result.maxTime} minutes`
    : result.maxTime % 60 === 0
    ? `${result.maxTime / 60} hours`
    : `${(result.maxTime / 60).toFixed(1)} hours`}
</span>
            <div className="text-sm">{result.neighborhood}</div>
          </AccordionDetails>
          <AccordionActions sx={{ padding: "8px", backgroundColor: "#2c2c2c" }}>
            <Button
              onClick={() => handleSelectResult(result)}
             variant="outlined" style={{color:'white', backgroundColor:'#212121'}}
            >
              Navigate
            </Button>
          </AccordionActions>
        </Accordion>
      </div>
    );
  });

  return (
    <div className="h-full w-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      ) : (
        <List
          ref={listRef}
          height={window.innerHeight}
          itemCount={filteredData.length}
          itemSize={(index) => expanded === index ? 450 : 45} 
          width="100%"
          overscanCount={5}
          style={{scrollbarWidth: "none"}}
        >
          {Row}
        </List>
      )}
    </div>
  );
};

export default ListView;