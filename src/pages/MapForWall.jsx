import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import Card from '../components/Card';

const MapForWall = ({ lat, long, title, image, google, mapWidth, mapHeight }) => {
    const mapStyles = {
        width: mapWidth || '315px', // Default width is 315px if not specified
        height: mapHeight || '200px', // Default height is 200px if not specified
        border: '2px solid #c2c',
        borderRadius: '2px',
        overflow: 'hidden'
    };

    const imageStyles = {
        width: '100%',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '8px 8px 0 0' 
    };

    const defaultProps = {
        center: { lat: lat, lng: long },
        zoom: 13
    };

    return (
        <Card>
            <div className='rounded-md p-5'>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <img
                    src={`https://api.muralfinder.net/${image}`}
                    alt="Wall Image"
                    style={imageStyles}
                />

                <div style={{ height: mapStyles.height, marginBottom: '10px', }}>
                    <Map
                        google={google}
                        style={mapStyles}
                        initialCenter={defaultProps.center}
                        zoom={defaultProps.zoom}
                    >
                        <Marker position={defaultProps.center} />
                    </Map>
                </div>
            </div>
        </Card>
    );
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBEfyuMVyPbaYNEDUXgbEE_SCoNC1y6kaw'
})(MapForWall);
