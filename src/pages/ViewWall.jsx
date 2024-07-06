import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import MapForWall from './MapForWall';
import WallService from '../services/WallService';
import { useParams } from 'react-router-dom';
import styles from '../style';
import Footer from '../components/Footer';
import { BackToTopButton } from '../components';
import { FaCheckCircle } from 'react-icons/fa'; // Import green check icon

const ViewWall = () => {
    const { wallId } = useParams();
    const [wall, setWall] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commenting, setCommenting] = useState(false);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        fetchWallFromDatabase();
        fetchComments();
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

    const fetchComments = async () => {
        try {
            setLoadingComments(true);
            const response = await WallService.getCommentsForWall(wallId);
            setComments(response); // Assuming response is an array of comments
            setLoadingComments(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setLoadingComments(false);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            setCommenting(true);
            await WallService.commentOnWall(wallId, { content: comment, wall_id: wallId });
            setComment('');
            setShowCommentBox(false);
            fetchComments(); // Refresh the comments after submitting
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setCommenting(false);
        }
    };

    const handleLike = async () => {
        try {
            setLiking(true);
            await WallService.likeWall(wallId);
            const updatedWall = await WallService.getWallById(wallId);
            setWall(updatedWall);
        } catch (error) {
            console.error('Error liking wall:', error);
        } finally {
            setLiking(false);
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
                        {/* Comments Section */}
                        <h3 className='text-lg font-semibold text-white font-raleway'>Comments</h3>
                        {loadingComments ? (
                            <div className="flex items-center justify-center text-white-500 dark:text-white font-raleway">
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                Loading comments...
                            </div>
                        ) : (
                            <>
                                {comments.map((comment) => (
                                    <div key={comment.id} className="bg-indigo-200 p-4 mb-4 rounded-lg flex items-center">
                                        <div className="flex items-center justify-center h-8 w-8 bg-gray-50 rounded-full mr-2">
                                            {comment.user && comment.user.profile?.profile_image_url ? (
                                                <a href={`/profile/${comment.user.id}`}>
                                                    <img
                                                        src={`https://api.muralfinder.net/${comment.user.profile?.profile_image_url}`}
                                                        alt={comment.user.username}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                </a>
                                            ) : (
                                                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold font-raleway">{comment.user ? comment.user.username : '...'}</p>
                                            <p className=''>{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        <button onClick={() => setShowCommentBox(!showCommentBox)} className="bg-blue-500 text-white py-2 px-4 rounded-md self-start">
                            {showCommentBox ? 'Hide Comment Box' : 'Add Comment'}
                        </button>
                        {showCommentBox && (
                            <div className="mt-4">
                                <textarea
                                    rows="4"
                                    placeholder="Enter your comment..."
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                                <button onClick={handleCommentSubmit} className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2">
                                    {commenting ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit'}
                                </button>
                            </div>
                        )}
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
                            {/* Wall Images and Details */}
                            <div className='w-full shadow-lg mt-4 p-4'>
                            <h1 className='text-3xl font-bold mb-2 text-white dark:text-white'>{wall.location_text} Artwork Name</h1>
                            <img
                                src={`https://api.muralfinder.net/${wall.image_path}`}
                                alt='Wall Image'
                                className='w-full h-auto object-cover rounded-xl'
                            />
                        </div>
                        {/* Duplicate sections as needed */}
                            {/* Wall Images and Details */}
                            <div className='w-full shadow-lg mt-4 p-4'>
                            <h1 className='text-3xl font-bold mb-2 text-white dark:text-white'>{wall.location_text} Artwork Name</h1>
                            <img
                                src={`https://api.muralfinder.net/${wall.image_path}`}
                                alt='Wall Image'
                                className='w-full h-auto object-cover rounded-xl'
                            />
                        </div>
                        {/* Duplicate sections as needed */}
                    </div>
                </div>
            )}
            <BackToTopButton />
            <Footer />
        </section>
    );
};

export default ViewWall;
