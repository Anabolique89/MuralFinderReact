import React, { useState } from 'react';
import Card from '../components/Card';
import { Map, Marker, InfoWindow, APIProvider, AdvancedMarker } from '@vis.gl/react-google-maps';

const MapForWall = ({ lat, long, title, image, mapWidth, mapHeight }) => {
    // Ensure lat and long are numbers
    const latitude = Number(lat);
    const longitude = Number(long);

    if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Latitude and Longitude must be valid numbers.");
        return null;
    }

    const [selected, setSelected] = useState(null);

    const mapStyles = {
        width: mapWidth || '100%', // Default width is 100% if not specified
        height: mapHeight || '200px', // Default height is 200px if not specified
        border: '2px solid ',
        borderRadius: '8px',
        overflow: 'hidden'
    };

    const imageStyles = {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px 8px 0 0' 
    };

    const defaultCenter = {
        lat: latitude,
        lng: longitude
    };

    return (
        <Card>
            <div className="rounded-md p-5">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <img
                    src={`https://api.muralfinder.net/${image}`}
                    alt="Wall Image"
                    style={imageStyles}
                />

                <div style={{ height: mapStyles.height, marginBottom: '10px' }}>
                    <APIProvider apiKey="AIzaSyBEfyuMVyPbaYNEDUXgbEE_SCoNC1y6kaw">
                        <Map
                            defaultCenter={defaultCenter}
                            defaultZoom={8}
                            gestureHandling={"greedy"}
                            disableDefaultUI={true}
                            className="h-[200px] w-full" // Assuming TailwindCSS for styling
                        >
                            <Marker 
                                position={defaultCenter}
                                onClick={() => setSelected(defaultCenter)}
                            />
                            {selected && (
                                <InfoWindow 
                                    position={defaultCenter}
                                    onCloseClick={() => setSelected(null)}
                                >
                                    <div>{title}</div>
                                </InfoWindow>
                            )}
                        </Map>
                    </APIProvider>
                </div>
            </div>
        </Card>
    );
};

export default MapForWall;
