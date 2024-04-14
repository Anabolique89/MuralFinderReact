import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import MapForWall from './MapForWall';
import WallService from '../services/WallService';
import Card from '../components/Card';
import { useParams } from 'react-router-dom';
import Reviews from '../components/Reviews';

const ViewWall = () => {
    const { wallId } = useParams();

    const [wall, setWall] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWallFromDatabase();
    }, [wallId]);

    const fetchWallFromDatabase = async () => {
        try {
            const response = await WallService.getWallById(wallId);
            if (response.success) {
                setWall(response.data);
            } else {
                console.error('Error fetching wall:', response.message);
            }
        } catch (error) {
            console.error('Error fetching wall:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // State for controlling the map size
    const [mapSize, setMapSize] = useState('400px');

    // Function to toggle map size
    const toggleMapSize = () => {
        setMapSize(mapSize === '400px' ? '600px' : '400px');
    };

    return (
        <section className='bg-indigo w-full overflow-hidden'>
            {isLoading || !wall ? (
                <div className='flex justify-center items-center h-screen'>
                    <FontAwesomeIcon icon={faSpinner} spin size='3x' color="white" />
                </div>
            ) : (
                <div className='flex justify-center items-center'>
                    <div className='w-3/4'>
                        <div className='flex'>
                            <div className='w-1/2'>
                                <img
                                    src={`https://api.muralfinder.net/${wall.image_path}`}
                                    alt='Wall Image'
                                    className='w-full h-auto rounded-t-md'
                                />
                            </div>
                            <div className='w-1/2'>
                                <Card>
                                    <div style={{ height: mapSize, border: '2px solid #c2c', borderRadius: '2px', overflow: 'hidden' }}>
                                        <MapForWall
                                            lat={wall.latitude}
                                            long={wall.longitude}
                                            title={wall.location_text}
                                            image={wall.image_path}
                                            mapWidth={mapSize}
                                        />
                                    </div>
                                </Card>
                                <h2 className='text-xl font-bold mt-4'>{wall.location_text}</h2>
                                <button onClick={toggleMapSize}>Toggle Map Size</button>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <h3 className='text-lg font-semibold'>Reviews</h3>
                            <Reviews />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ViewWall;
