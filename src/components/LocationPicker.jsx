import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const LocationPicker = ({ onSelectLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const handleMapClick = ({ x, y, lat, lng }) => {
        setSelectedLocation({ latitude: lat, longitude: lng });
        onSelectLocation({ latitude: lat, longitude: lng });
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearch = () => {
        if (searchInput.trim() === '') return;

        // Use Google Places Autocomplete API to get the location details
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: searchInput }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                const { lat, lng } = results[0].geometry.location;
                setSelectedLocation({ latitude: lat(), longitude: lng() });
                onSelectLocation({ latitude: lat(), longitude: lng() });
            } else {
                console.error('Geocode was not successful for the following reason:', status);
            }
        });
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <div style={{ marginBottom: '10px' }}>
                <input type="text" value={searchInput} onChange={handleSearchInputChange} />
                <button onClick={handleSearch}>Search</button>
            </div>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyBEfyuMVyPbaYNEDUXgbEE_SCoNC1y6kaw' }} // Replace with your own API key
                defaultCenter={{ lat: 0, lng: 0 }}
                defaultZoom={10}
                onClick={handleMapClick}
            >
                {selectedLocation && (
                    <Marker
                        lat={selectedLocation.latitude}
                        lng={selectedLocation.longitude}
                        text="Selected Location"
                    />
                )}
            </GoogleMapReact>
        </div>
    );
};

const Marker = ({ text }) => <div style={{ color: 'red', fontSize: '20px' }}>{text}</div>;

export default LocationPicker;
