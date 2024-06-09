import React, { useState, useEffect } from 'react';
import { 
    Map, Marker, InfoWindow, APIProvider 
} from '@vis.gl/react-google-maps';
import { DirectionsRenderer } from '@react-google-maps/api';

const Maps = ({ locations, defaultCenter, center, style }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const apiKey = "AIzaSyBEfyuMVyPbaYNEDUXgbEE_SCoNC1y6kaw"; 

  locations = locations || [
    { lat: 37.7749, lng: -122.4194, name: 'Location 1' },
    { lat: 37.7859, lng: -122.4364, name: 'Location 2' },
    { lat: 37.7969, lng: -122.4574, name: 'Location 3' }
  ];
  defaultCenter = defaultCenter || { lat: 37.7749, lng: -122.4194 }; 
  center = center || defaultCenter;
  style = style || {
    width: '100%',
    height: '100vh',
    border: '2px solid #c2c',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
        (error) => console.error('Error getting user location:', error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleMarkerClick = (index) => {
    setSelectedMarker(index);
  };

  const handleDirections = async (destination) => {
    if (!userLocation) {
      alert('Please allow location access to get directions.');
      return; 
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setDirections(data);
    } catch (error) {
      console.error("Error fetching directions:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <APIProvider apiKey={apiKey}> 
      <Map style={style} defaultZoom={10} defaultCenter={center} scrollwheel={true}>
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(index)}
          />
        ))}

        {selectedMarker !== null && (
          <InfoWindow
            position={locations[selectedMarker]}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              {locations[selectedMarker].name}
              <button 
                onClick={() => handleDirections(locations[selectedMarker])}
                disabled={!userLocation} 
              >
                Get Directions
              </button>
            </div>
          </InfoWindow>
        )}

        {directions && (
          <DirectionsRenderer directions={directions} />
        )}
      </Map>
    </APIProvider>
  );
};

export default Maps;
