import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSpinner, faThumbsUp, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import MapForWall from './MapForWall';
import WallService from '../services/WallService';
import { useParams } from 'react-router-dom';
import styles from '../style';
import Footer from '../components/Footer';
import { BackToTopButton } from '../components';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import AuthService from '../services/AuthService';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

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
    const [isDeleting, setIsDeleting] = useState(false); // State for loading during delete

    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    // Assuming we have a currentUser object representing the logged-in user
    const currentUser = AuthService.getUser()

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
            setComments(response.data); // Assuming response is an array of comments
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            setCommenting(true);
            if (editCommentId) {
                // If in edit mode, update the comment
                await WallService.updateComment(wallId, editCommentId, { comment: editCommentText });
                setEditCommentId(null);
                setEditCommentText('');
            } else {
                await WallService.commentOnWall(wallId, { comment });
                setComment('');
            }
            setShowCommentBox(false);
            fetchComments(); // Refresh the comments after submitting
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setCommenting(false);
        }
    };

    const handleEdit = (comment) => {
        setEditCommentId(comment.id);
        setEditCommentText(comment.comment);
        setShowCommentBox(true);
    };

    const handleDelete = async (wallId, commentId) => {
        setIsDeleting(true); // Set deleting state to true
        try {
            await WallService.deleteComment(wallId, commentId);
            toast.success('Comment deleted successfully!'); // Success toast
            fetchComments(); // Refresh comments after deletion
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment'); // Error toast
        } finally {
            setIsDeleting(false); // Reset deleting state
        }
    };

    const handleLike = async () => {
        try {
            setLiking(true);
            await WallService.likeWall(wallId);
            fetchWallFromDatabase(); // Refresh wall data to update like count
        } catch (error) {
            console.error('Error liking wall:', error);
        } finally {
            setLiking(false);
        }
    };

    return (
        <section className={` ${styles.paddingX} ${styles.boxWidth} m-auto`}>
            <ToastContainer /> {/* Toast Container for notifications */}
            {isLoading ? (
                <div className='flex justify-center items-center h-screen'>
                    <FontAwesomeIcon icon={faSpinner} spin size='3x' color="#4B5563" />
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center'>
                    <div className='w-full text-white'>
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
                        <h3 className='text-lg font-semibold text-white font-raleway'>Comments</h3>
                        {loadingComments ? (
                            <div className="flex items-center justify-center text-white-500 dark:text-white font-raleway">
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                Loading comments...
                            </div>
                        ) : (
                            <>
                                {comments.length ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="bg-indigo-200 p-4 mb-4 rounded-lg flex items-center">
                                            <div className="flex items-center justify-center h-8 w-8 bg-gray-50 rounded-full mr-2">
                                                {comment.user && comment.user.profile?.profile_image_url ? (
                                                    <a href={`/profile/${comment.user.id}`}>
                                                        <img
                                                            src={`https://api.muralfinder.net/${comment.user?.profile?.profile_image_url}`}
                                                            alt={comment.user.username}
                                                            className="h-8 w-8 rounded-full object-cover"
                                                        />
                                                    </a>
                                                ) : (
                                                    <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold font-raleway">{comment.user ? comment.user.username : '...'}</p>
                                                <p className=''>{comment.comment}</p>
                                            </div>
                                            {comment.user && comment?.user?.id === currentUser.id && (
                                                <div className="flex">
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        onClick={() => handleEdit(comment)}
                                                        className='text-blue-500 hover:text-blue-700 cursor-pointer mr-2'
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        onClick={() => handleDelete(comment.wall_id, comment.id)}
                                                        className={`text-red-500 hover:text-red-700 cursor-pointer ${isDeleting ? 'cursor-not-allowed opacity-50' : ''}`} // Disable and style the button when deleting
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-white font-raleway'>No comments yet.</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className='w-full shadow-lg mt-6 mb-4 p-4'>
                        <button
                            onClick={() => setShowCommentBox(!showCommentBox)}
                            className='bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-full'
                        >
                            {showCommentBox ? 'Cancel' : 'Add Comment'}
                        </button>
                        {showCommentBox && (
                            <div className='mt-4'>
                                <textarea
                                    value={editCommentId ? editCommentText : comment}
                                    onChange={(e) => editCommentId ? setEditCommentText(e.target.value) : setComment(e.target.value)}
                                    placeholder='Write your comment...'
                                    className='w-full p-2 border rounded-lg'
                                />
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={commenting}
                                    className='bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-full mt-2'
                                >
                                    {commenting ? 'Submitting...' : (editCommentId ? 'Update Comment' : 'Submit Comment')}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='flex items-center justify-center'>
                        <button
                            onClick={handleLike}
                            disabled={liking}
                            className='bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-full flex items-center'
                        >
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                className='mr-2'
                                style={{ color: '#ffffff' }}
                            />
                            {liking ? 'Liking...' : `Like (${wall.likes_count || 0})`}
                        </button>
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        {wall.is_verified && (
                            <FaCheckCircle className="text-green-500 mr-2" />
                        )}
                        <span className="text-gray-500 text-sm">Verified</span>
                    </div>
                </div>
            )}
            <Footer />
            <BackToTopButton />
        </section>
    );
};

export default ViewWall;
