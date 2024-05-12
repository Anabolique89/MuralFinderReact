import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'; // Import spinner icon
import styles from '../style';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';
import ArtworkService from '../services/ArtworkService';
import { useParams } from 'react-router-dom';
import Footer from './Footer';

const SingleArtwork = () => {
    const { artworkId } = useParams(); // Use object destructuring to get artworkId from useParams
    const [artwork, setArtwork] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const defaultImage = 'https://example.com/default-image.jpg'; // Default image URL from CDN

    useEffect(() => {
        fetchArtwork();
    }, [artworkId]);

    const fetchArtwork = async () => {
        try {
            const response = await ArtworkService.getArtworkById(artworkId);
            if (response.success) {
                setArtwork(response.data);
            } else {
                console.error('Error fetching artwork:', response.message);
            }
        } catch (error) {
            console.error('Error fetching artwork:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={`rounded-xl overflow-hidden shadow-md p-4 ${styles}`}>

            <div className="mx-auto px-4 py-8 max-w-4xl my-20">
                {isLoading ? ( // Check if still loading
                    <div className="flex justify-center items-center h-full">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-purple-950 text-4xl" />
                    </div>
                ) : (
                    <div className="backdrop-filter backdrop-blur-lg shadow-2xl rounded-lg mb-6 tracking-wide" >
                        {/* Render artwork data here */}
                        {/* Image */}
                        <div className="md:flex-shrink-0">
                            <img 
                            src={artwork.image_path ? `https://api.muralfinder.net${artwork.image_path}` : defaultImage}
                            alt={artwork.title || 'Artwork'}
                            className="w-full h-100 rounded-lg rounded-b-none" />
                        </div>
                        {/* Author */}
                        <div className="flex items-center justify-end mt-2 mr-3">
                            <a href="#" className="flex text-gray-700">
                                <FontAwesomeIcon icon={faEllipsisVertical} className="text-purple-950 mr-2 ml-4" />
                            </a>
                        </div>
                        <div className="author flex items-center -ml-3 px-2">
                            <div className="user-logo">
                                <img className="w-12 h-12 object-cover rounded-full mx-4  shadow" src={artwork.user.profile} alt="avatar" />
                            </div>
                            <h2 className="tracking-tighter font-raleway font-bold text-purple-500 text-l mb-2">
                                <a href="#">{artwork.user.username}</a> <span className={`${styles.paragraph} text-sm float-right ml-80`}>{artwork.date}</span>
                            </h2>
                        </div>
                        {/* Artwork Content */}
                        <div className="px-4 py-2 mt-2">
                            <h2 className={`text-xl tracking-normal font-raleway font-semibold xs:text-[28px] text-[30px] text-white xs:leading-[46.8px] leading-[30.8px] w-full px-2`}>{artwork.title}</h2>
                            <p className={`text-sm px-2 pb-2 mr-1 ${styles.paragraph}`}>{artwork.description}</p>
                            {/* Likes and Comments */}
                            <div className="flex items-center justify-start mt-2 mx-2">
                                <a href="#" className="flex text-gray-700">
                                    <FontAwesomeIcon icon={faHeart} className="text-purple-950 mr-2" />
                                    <span>{artwork.likes}</span>
                                </a>
                                <a href="#" className="flex text-gray-700">
                                    <FontAwesomeIcon icon={faComments} className="text-purple-950 mr-2 ml-4" />
                                    <span>{artwork.comments}</span>
                                </a>
                            </div>
                            {/* Expand Button */}
                            <div className="flex items-center justify-end mt-2 mx-2">
                                <a href="#" className="text-blue-500 text-xs -ml-3 ">Expand</a>
                            </div>
                        </div>
                    </div>
                )} </div>
                  <Footer />

        </section>
    );
}

export default SingleArtwork;
