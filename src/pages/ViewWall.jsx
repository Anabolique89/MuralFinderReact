import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import MapForWall from './MapForWall';
import WallService from '../services/WallService';
import { useParams } from 'react-router-dom';
import Reviews from '../components/Reviews';
import styles from '../style';
import Footer from '../components/Footer';
import { BackToTopButton } from '../components';
import { FaCheckCircle } from 'react-icons/fa'; // Import green check icon

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

    return (
        <section className={` ${styles.paddingX} ${styles.boxWidth} m-auto`}>
            {isLoading || !wall ? (
                <div className='flex justify-center items-center h-screen'>
                    <FontAwesomeIcon icon={faSpinner} spin size='3x' color="#4B5563" />
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center'>
                    <div className='w-full text-white'>
                        {/* Map as a full-width banner */}
                        <div style={{ height: '500px', overflow: 'hidden' }}>
                            <MapForWall
                                lat={wall.latitude}
                                long={wall.longitude}
                                title={wall.location_text}
                                image={wall.image_path}
                                isVerified={wall.is_verified}
                                mapWidth='100%'
                            />
                        </div>
                    </div>
         
                    <div className='w-full shadow-lg mt-6 mb-4 p-4'>
                        {/* Reviews Section */}
                        <h3 className='text-lg font-semibold text-white font-raleway'>Reviews</h3>
                        <Reviews wallId={wallId} />
                    </div>

                    <h2 className={`flex flex-col justify-center items-center ${styles.heading2} ${styles.paddingX} ${styles.paddingY}`}>
                        Wall Feed
                    </h2>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center'>
                        <div className='w-full shadow-lg mt-4 p-4'>
                            {/* Image and Location Text */}
                            <div className='flex items-center'>
                                <h1 className='text-3xl font-bold mb-2 text-white dark:text-white flex-grow'>
                                    {wall.location_text} Artwork Name
                                </h1>
                                {/* Conditionally render the green check icon */}
                                {wall.is_verified && (
                                    <FaCheckCircle size={24} color='green' className='ml-2' />
                                )}
                            </div>
                            <img
                                src={`https://api.muralfinder.net/${wall.image_path}`}
                                alt='Wall Image'
                                className='w-full h-auto object-cover rounded-xl'
                            />
                        </div>
                        {/* Repeat the above div for other wall details if needed */}
                    </div>
                </div>
            )}
            <BackToTopButton />
            <Footer />
        </section>
    );
};

export default ViewWall;
