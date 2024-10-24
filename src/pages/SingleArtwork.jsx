import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faHeart, faEllipsisVertical, faUser } from '@fortawesome/free-solid-svg-icons'; // Import faUser for the default icon
import ArtworkService from '../services/ArtworkService';
import { useParams, Link } from 'react-router-dom';
import { BackToTopButton, Footer } from '../components';
import styles from '../style';

const SingleArtwork = () => {
    const { artworkId } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    // Ensure artwork and user exist before trying to access properties
    if (!artwork || !artwork.user) {
        return <div>Loading...</div>;
    }

    return (
        <section className={`rounded-xl overflow-hidden shadow-md p-4 ${styles}`}>
            <div className="mx-auto px-4 py-8 max-w-2xl my-20">
                <div className="backdrop-filter backdrop-blur-lg shadow-2xl rounded-lg mb-6 tracking-wide">
                    <div className="md:flex-shrink-0">
                        <img
                            src={artwork.image_url || "https://ik.imagekit.io/q5edmtudmz/post1_fOFO9VDzENE.jpg"}
                            alt="singleArtwork"
                            className="w-full h-100 rounded-lg rounded-b-none"
                        />
                    </div>
                    <div className="flex items-center justify-end mt-2 mr-3">
                        <a href="#" className="flex text-gray-700">
                            <FontAwesomeIcon icon={faEllipsisVertical} className="text-purple-950 mr-2 ml-4" />
                        </a>
                    </div>
                    <div className="author flex items-center">
                        <Link to={`/profile/${artwork.user?.id}`} className="flex items-center">
                            {artwork.user?.profile?.profile_image_url ? (
                                <img
                                    src={`https://api.muralfinder.net/${artwork.user?.profile?.profile_image_url}`}
                                    alt={artwork.user?.username || artwork.user?.first_name}
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5 rounded-full mr-2 bg-gray-200 p-1" />
                            )}
                            <div className="font-raleway font-bold text-purple-400 text-sm mb-2">
                                {artwork.user?.username || artwork.user?.first_name || "Unknown User"}
                            </div>
                        </Link>
                    </div>

                    <div className="px-4 py-2 mt-2">
                        <h2 className={`text-xl tracking-normal font-raleway font-semibold xs:text-[28px] text-[30px] text-white xs:leading-[46.8px] leading-[30.8px] w-full px-2`}>
                            {artwork.title || "Untitled Artwork"}
                        </h2>
                        <p className={`text-sm px-2 pb-2 mr-1 ${styles.paragraph}`}>
                            {artwork.description || "No description available."}
                        </p>
                        <div className="flex items-center justify-start mt-2 mx-2">
                            <a href="#" className="flex text-gray-500">
                                <FontAwesomeIcon icon={faHeart} className="text-purple-950 mr-2" />
                                <span>{artwork.likes_count || 0}</span>
                            </a>
                            <a href="#" className="flex text-gray-500">
                                <FontAwesomeIcon icon={faComments} className="text-purple-950 mr-2 ml-4" />
                                <span>{artwork.comments_count || 0}</span>
                            </a>
                        </div>
                        <div className="flex items-center justify-end mt-2 mx-2">
                            <a href="#" className="text-blue-500 text-xs -ml-3 ">Expand</a>
                        </div>
                    </div>
                </div>
            </div>
            <BackToTopButton />
            <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
                <Footer />
            </div>
        </section>
    );
};

export default SingleArtwork;
