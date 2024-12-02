import React, { useEffect, useRef, useContext, useState } from "react";
import L from "leaflet";
// import "leaflet-bounce-marker";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet-routing-machine";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./Map.css";
import { PriceDistanceContext } from "../context/PriceDistanceContext";

const MapComponent = ({ selectedCoordinates }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // const markersRef = useRef([]); // Store markers and polygons
  const circleLayerRef = useRef(null); // Ref for distance circle
  const markerClusterGroup = useRef(null); // Ref for marker cluster
  const { distance, setDistance, userCoords, setUserCoords } =
    useContext(PriceDistanceContext);
  const routingControlRef = useRef(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Initialize map
    map.current = L.map(mapContainer.current, {
      preferCanvas: true,
      center: [51.0447, -114.0719],
      zoom: 12,
      zoomControl: false,
    }).setView([51.0447, -114.0719], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map.current);

    // Default marker icon
    const DefaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerIconShadow,
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Add zoom control
    L.control.zoom({ position: "bottomleft" }).addTo(map.current);
// Handle user geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = [position.coords.latitude, position.coords.longitude];
      setUserCoords(coords);

      // Initialize a variable to store the marker
      let userMarker = L.marker(coords, {
        draggable: true, // Make the marker draggable
        icon: L.icon({
          iconUrl: "src/assets/pp-icon-primary.svg",
          iconSize: [40, 40],
          popupAnchor: [0, -20],
          shadowAnchor: [10, 12],
          shadowUrl: markerIconShadow,
        }),
      })
        .addTo(map.current)
        .bindPopup("<span style='font-size: 1rem; font-weight: bold' >Haul me over to set the spot<span style='font-size: 1.25rem; magin: 5px;'>🦜</span></span>")
        .openPopup();

      // Fly to the user's location
      map.current.flyTo(coords, 15);

      // Listen for the dragend event to get the new marker position
      userMarker.on("dragend", function (e) {
        const newCoords = e.target.getLatLng(); // Get the new latitude and longitude
        setUserCoords([newCoords.lat, newCoords.lng]); // Update the state
        console.log("New Marker Position:", newCoords);

        // Remove the old marker before adding a new one
        if (userMarker) {
          map.current.removeLayer(userMarker);
        }

        // Add a new marker at the new position
        userMarker = L.marker([newCoords.lat, newCoords.lng], {
          draggable: true,
          icon: L.icon({
            iconUrl: "src/assets/pp-icon-primary.svg",
            iconSize: [40, 40],
            popupAnchor: [0, -20],
            shadowAnchor: [10, 12],
            shadowUrl: markerIconShadow,
          }),
        })
          .addTo(map.current)
          .bindPopup(
            `New Location: ${newCoords.lat.toFixed(5)}, ${newCoords.lng.toFixed(5)}`
          )
          .openPopup();

        // Reattach the dragend listener to the new marker
        userMarker.on("dragend", function (e) {
          const updatedCoords = e.target.getLatLng();
          setUserCoords([updatedCoords.lat, updatedCoords.lng]);
          console.log("Updated Marker Position:", updatedCoords);
        });
      });
    },
    (error) => alert("Unable to retrieve your location: " + error.message)
  );
} else {
  alert("Geolocation not supported by your browser.");
}


    // Initialize marker cluster group

    markerClusterGroup.current = L.markerClusterGroup({
      maxClusterRadius: 40, // Adjust the radius for clusters (smaller values = more zoomed in clusters)
      spiderfyOnMaxZoom: true, // Disable spiderfy to reduce rendering load
      removeOutsideVisibleBounds: true,
    }).addTo(map.current);

    // Initialize layer group for distance circle
    circleLayerRef.current = L.layerGroup().addTo(map.current);

    return () => {
      if (map.current) map.current.remove();
    };
  }, [setUserCoords]);

  useEffect(() => {
    const removeMarkers = () => {
      // markersRef.current = [];
      if (markerClusterGroup.current) {
        markerClusterGroup.current.clearLayers();
      }
    };

    const fetchParkingData = async () => {
      removeMarkers(); // Clear previous markers and polygons
      setLoading(true); // Start loading

      try {
        const response = await fetch(
          `/api/parkingrates?lat=${userCoords[0]}&lng=${userCoords[1]}&maxDistance=${distance}`
        );
        const data = await response.json();

        // Define chunk size to process entries in smaller batches
        const chunkSize = 100;
        const processChunk = async (chunk) => {
          for (const lot of chunk) {
            // MultiPolygon processing
            if (
              lot.coordinates?.type === "MultiPolygon" &&
              Array.isArray(lot.coordinates.coordinates)
            ) {
              const coordinates = lot.coordinates.coordinates[0][0].map(
                (coord) => [coord[1], coord[0]]
              );
              const polygon = L.polygon(coordinates, {
                className: "parking-lot",
                color: "#ffe508",
                fillOpacity: 0.5,
              }).addTo(map.current);

              const parkingZoneMarker = L.marker(
                [
                  lot.coordinates.coordinates[0][0][0][1],
                  lot.coordinates.coordinates[0][0][0][0],
                ],
                {
                  icon: L.icon({
                    iconUrl: "src/assets/pp-pin-primary.svg",
                    iconSize: [40, 40],
                    iconAnchor: [16, 32],
                    shadowAnchor: [10, 24],
                    shadowUrl: markerIconShadow,
                  }),
                }
              ).bindPopup(`
                <div>
                  <strong>${lot.title}</strong><br><br>
                  <strong>Info:</strong><br>
                  ${lot.parkingRates
                    .map(
                      (rate) =>
                        `${rate.period}<br>${rate.rate}<br>${rate.hours}`
                    )
                    .join("<br>")}<br><br>
                </div>
              `);

              markerClusterGroup.current.addLayer(parkingZoneMarker);
            }

            // MultiLineString processing
            else if (lot.coordinates?.type === "MultiLineString") {
              const allLines = lot.coordinates.coordinates;

              allLines.forEach((line) => {
                const transformedLine = line.map(([lng, lat]) => [lat, lng]);

                const [lat, lng] = transformedLine[0]; // Use the first coordinate for the marker

                L.marker([lat, lng], {
                  icon: L.icon({
                    iconUrl: "src/assets/pp-pin-primary.svg",
                    iconSize: [40, 40],
                    iconAnchor: [16, 32],
                    shadowAnchor: [10, 24],
                    shadowUrl: markerIconShadow,
                  }),
                })
                  .bindPopup(
                    `
                    <div>
                      <strong>${lot.address}</strong><br>
                      <strong>Rates:</strong><br>
                      ${lot.dailyRate}<br>
                      <strong>Maximum Parking Time:</strong><br>
                      ${lot.maxTime / 60} Hours<br><br>
                      <strong>Info:</strong><br>
                      Restrictions:<br>
                      ${lot.parkingRestrictTime}<br>
                    </div>
                  `
                  )
                  .addTo(markerClusterGroup.current);
              });
            }
          }
        };

        // Chunk and process data
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          await processChunk(chunk); // Process each chunk
        }

        setLoading(false); // Data loaded
      } catch (error) {
        console.error("Error fetching parking data:", error);
        setLoading(false); // Ensure loading is stopped in case of error
      }
    };
    if (userCoords) {
      fetchParkingData();
    }
  }, [distance, userCoords]);

 const routingMarkers = []; // To track only start and end markers
const parkingMarkers = []; // To store other parking markers

useEffect(() => {
  if (userCoords && selectedCoordinates) {
    // Remove existing routing control, if any
    if (routingControlRef.current) {
      map.current.removeControl(routingControlRef.current);
    }

    // Add routing control
    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(userCoords[0], userCoords[1]),
        L.latLng(selectedCoordinates.lat, selectedCoordinates.lng),
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      createMarker: (i, waypoint) => {
        const marker = L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl:
              i === 0
                ? "src/assets/pp-pin-black.svg"
                : "src/assets/pp-pin-primary.svg",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            shadowAnchor: [10, 24],
            shadowUrl: markerIconShadow,
          }),
        });
        routingMarkers.push(marker); // Track only routing markers
        return marker;
      },
      lineOptions: {
        styles: [
          {
            color: "yellow",
            weight: 10,
            opacity: 0.8,
          },
          {
            color: "#000000",
            weight: 4,
            opacity: 1,
          },
        ],
      },
    }).addTo(map.current);

    routingControlRef.current.on("routesfound", (event) => {
      const route = event.routes[0];
      const distance = route.summary.totalDistance;
      const time = route.summary.totalTime;

      const distanceInKm = (distance / 1000).toFixed(2);
      const timeInMinutes = (time / 60).toFixed(2);

      const clearRouteAndMarker = () => {
        if (routingControlRef.current) {
          map.current.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
        // Remove routing markers
        routingMarkers.forEach((marker) => {
          map.current.removeLayer(marker);
        });
        routingMarkers.length = 0; // Clear the routing marker array

        // Restore parking markers if needed
        parkingMarkers.forEach((marker) => {
          marker.addTo(map.current);
        });
        setDistance((prevDistance) => prevDistance + 1);
        map.current.closePopup();
       
      };

      // Add a clear route function to the window object
      window.clearRoute = clearRouteAndMarker;

      const popupContent = `
        <div style="min-width: 200px;">
          <div style="margin-bottom: 12px;">
            <p style="margin: 4px 0;"><strong>Distance:</strong> ${distanceInKm} km</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${timeInMinutes} minutes</p>
          </div>
          <button 
            onclick="clearRoute()" 
            style="
              background-color: #ff4444;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              width: 100%;
              font-weight: 500;
              transition: background-color 0.2s;
            "
            onmouseover="this.style.backgroundColor='#ff6666'"
            onmouseout="this.style.backgroundColor='#ff4444'"
          >
            Close Route
          </button>
        </div>
      `;

      const destinationMarker = L.marker(
        [selectedCoordinates.lat, selectedCoordinates.lng],
        {
          icon: L.icon({
            iconUrl: "src/assets/pp-pin-primary.svg",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            shadowAnchor: [10, 24],
            shadowUrl: markerIconShadow,
          }),
        }
      ).addTo(map.current);

      routingMarkers.push(destinationMarker); // Add destination marker to routingMarkers

      const popup = L.popup({
        minWidth: 200,
        closeButton: true,
        className: "custom-popup",
      }).setContent(popupContent);

      destinationMarker.bindPopup(popup).openPopup();
    });
  }

  // Add parking markers when the component loads
  parkingMarkers.forEach((marker) => {
    marker.addTo(map.current);
  });

  return () => {
    // Cleanup on component unmount
    if (routingControlRef.current) {
      map.current.removeControl(routingControlRef.current);
    }
    routingMarkers.forEach((marker) => {
      map.current.removeLayer(marker);
    });
    routingMarkers.length = 0;
  };
}, [userCoords, selectedCoordinates]);


  useEffect(() => {
    // Handle circle update
    if (userCoords && distance) {
      circleLayerRef.current.clearLayers();
      const radiusInMeters = distance * 1000;
      const circle = L.circle(userCoords, {
        color: "yellow",
        fillColor: "#30b1ff",
        fillOpacity: 0.01,
        radius: radiusInMeters,
      });
      circleLayerRef.current.addLayer(circle);
    }
  }, [distance, userCoords]);

  useEffect(() => {
    if (selectedCoordinates) {
      map.current.flyTo([selectedCoordinates.lat, selectedCoordinates.lng]);
      markerClusterGroup.current.clearLayers();
    }
  }, [selectedCoordinates]);

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div className="loading-overlay" style={{ zIndex: 999 }}>
          <div className="spinner" />
          <p>Loading map...</p>
        </div>
      )}
      <div ref={mapContainer} style={{ height: "100vh", width: "100%" }} />
    </div>
  );
};

export default MapComponent;