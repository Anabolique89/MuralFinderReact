import React from 'react';
import GoogleMapReact from 'google-map-react';

const MapForWall = ({ lat, long }) => {
  const defaultProps = {
    center: { lat: lat, lng: long },
    zoom: 13
  };

  return (
    <div style={{ height: '300px', width: '300px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker 
          lat={lat} 
          lng={long} 
          text="Location" 
        />
      </GoogleMapReact>
    </div>
  );
};

export default MapForWall;