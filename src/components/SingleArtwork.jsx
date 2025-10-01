import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faComments, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './WebFooter';
import AuthService from '@services/AuthService';
import ArtworkService from '@services/ArtworkService';
import { useGetArtworkByIdQuery } from '../store/api/muralFinderApi';
import styles from '@styles';
import BackToTopButton from './BackToTopButton';
import { ShareSocial } from 'react-share-social';

import DropdownMenu from '@components/DropdownMenu';
import { getFileUrl } from '../utils/apiConfig';
const stylez = {
    root: {
        width: '100%',
        background: 'transparent',
        borderRadius: 3,
        border: 0,
        color: 'white',

    },
    copyContainer: {
        border: '1px solid blue',
        background: 'rgb(0,0,0,0.7)',
        display: 'none'
    },
};

const SingleArtwork = () => {
    const { artworkId } = useParams();
    const { data: artworkData, isLoading, error } = useGetArtworkByIdQuery(artworkId, {
        skip: !artworkId, // Skip the query if artworkId is not available
    });
    const artwork = artworkData?.data;
    const user = AuthService.getUser() ?? null;

    // Debug logging
    console.log('SingleArtwork Debug:', {
        artworkId,
        artworkIdType: typeof artworkId,
        artworkData,
        artwork,
        isLoading,
        error,
        skip: !artworkId
    });
    const defaultImage = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likedComments, setLikedComments] = useState({});
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [currentImageSrc, setCurrentImageSrc] = useState('');

    // Function to get the best available image
    const getArtworkImage = () => {
        if (imageError || !artwork) return defaultImage;

        const primaryImage = artwork.primary_image_path ? getFileUrl(artwork.primary_image_path) : null;
        const fallbackImage = artwork.image_path ? getFileUrl(artwork.image_path) : null;

        return primaryImage || fallbackImage || defaultImage;
    };

    // Handle image load error
    const handleImageError = (e) => {
        const failedSrc = e.target.src;
        // Only set error if we're not already showing the default image
        if (failedSrc !== defaultImage && !imageError) {
            setImageError(true);
            setCurrentImageSrc(defaultImage);
        }
        setImageLoading(false);
    };

    // Handle image load success
    const handleImageLoad = () => {
        setImageLoading(false);
        // Don't reset imageError here to prevent infinite loop
    };

    useEffect(() => {
        // Reset image states when artwork changes
        setImageError(false);
        setImageLoading(true);
        setCurrentImageSrc('');
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [artworkId]);

    // Update current image source when artwork changes
    useEffect(() => {
        if (artwork && !imageError) {
            const primaryImage = artwork.primary_image_path ? getFileUrl(artwork.primary_image_path) : null;
            const fallbackImage = artwork.image_path ? getFileUrl(artwork.image_path) : null;
            const newImageSrc = primaryImage || fallbackImage || defaultImage;
            setCurrentImageSrc(newImageSrc);
        }
    }, [artwork, imageError]);




    const fetchComments = async () => {
        try {
            const response = await ArtworkService.loadComments(artworkId);
            if (response.success) {
                // Handle paginated response - comments are in response.data.data
                const commentsData = response.data?.data || response.data;
                const commentsArray = Array.isArray(commentsData) ? commentsData : [];
                setComments(commentsArray);
            } else {
                console.error('Error fetching comments:', response.message);
                setComments([]); // Set to empty array on error
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]); // Set to empty array on error
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const formData = new FormData();
                formData.append('content', newComment);
                const response = await ArtworkService.addComment(artworkId, formData);
                if (response.success) {
                    // Ensure comments is an array before spreading
                    const currentComments = Array.isArray(comments) ? comments : [];
                    setComments([...currentComments, response.data]);
                    setNewComment('');
                    toast.success('Comment added successfully!');
                } else {
                    toast.error('Failed to add comment.');
                }
            } catch (error) {
                console.error('Error adding comment:', error);
                toast.error('An error occurred while adding the comment.');
            }
        } else {
            toast.error('Comment cannot be empty.');
        }
    };

    const handleLikeComment = async (commentId, index) => {
        try {
            const response = await ArtworkService.likeComment(commentId);
            if (response.success) {
                // Ensure comments is an array before mapping
                const currentComments = Array.isArray(comments) ? comments : [];
                const updatedComments = currentComments.map((comment, idx) => {
                    if (idx === index) {
                        return { ...comment, likes: comment.likes + 1 };
                    }
                    return comment;
                });
                setComments(updatedComments);
                setLikedComments({ ...likedComments, [commentId]: true });
                toast.info('Comment liked!');
            } else {
                toast.error('Failed to like comment.');
            }
        } catch (error) {
            console.error('Error liking comment:', error);
            toast.error('An error occurred while liking the comment.');
        }
    };

    const likeArtwork = async (artworkId) => {
        try {
            const likeResponse = await ArtworkService.likeArtwork(artworkId);
            console.log(likeResponse, 'likeResponseeeeeeeeeData')
            if (likeResponse?.data?.success) {
                toast.success(likeResponse?.data?.message || 'Artwork liked successfully')
            } else {
                toast.error(likeResponse || 'Failed to like artwork')

            }

        } catch (error) {
            toast.error(error || 'error to like artwork')

        }
    }

    const userImage = artwork?.user?.profile?.profile_image_url || artwork?.user?.profile_image_url;

    // Handle error state
    if (error) {
        return (
            <div className="min-h-screen bg-indigo-600 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Error Loading Artwork</h1>
                    <p className="text-white/80 mb-4">
                        {error?.data?.message || error?.message || 'Failed to load artwork'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Handle case where artwork is not found
    if (!isLoading && !artwork) {
        return (
            <div className="min-h-screen bg-indigo-600 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Artwork Not Found</h1>
                    <p className="text-white/80 mb-4">The artwork you're looking for doesn't exist.</p>
                    <Link to="/artworks" className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                        Browse Artworks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-indigo-600">
            {/* Hero Section */}
            <div className="bg-indigo-600 pt-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="text-center">
                                <FontAwesomeIcon icon={faSpinner} spin className="text-white text-6xl mb-4" />
                                <p className="text-white text-xl">Loading artwork...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Image Section */}
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl group aspect-[4/3] bg-gray-200">
                                    {imageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl z-10">
                                            <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400 text-4xl" />
                                        </div>
                                    )}
                                    <img
                                        src={currentImageSrc || getArtworkImage()}
                                        alt={artwork?.title || 'Artwork'}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={handleImageError}
                                        onLoad={handleImageLoad}
                                    />
                                    {imageError && (
                                        <div className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-20">
                                            Using placeholder image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                </div>

                                {/* Category Badge */}
                                {artwork?.category && (
                                    <div className="absolute top-4 left-4">
                                        <span
                                            className="px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg backdrop-blur-sm"
                                            style={{ backgroundColor: artwork?.category?.color_code || '#6366f1' }}
                                        >
                                            {artwork?.category?.name}
                                        </span>
                                    </div>
                                )}

                                {/* Actions Menu */}
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu artworkId={artwork?.id} />
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="text-white space-y-6">
                                {/* Artist Info */}
                                <div className="flex items-center space-x-4">
                                    <Link to={`/profile/${artwork?.user?.username || artwork?.user?.id}`} className="flex items-center group">
                                        <div className="relative">
                                            {userImage ? (
                                                <img
                                                    src={getFileUrl(userImage)}
                                                    alt={artwork?.user?.username}
                                                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white/20 group-hover:ring-white/40 transition-all"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/20">
                                                    <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white"></div>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold group-hover:text-yellow-300 transition-colors">
                                                {artwork?.user?.username || artwork?.user?.profile?.first_name || 'Unknown Artist'}
                                            </h3>
                                            <p className="text-white/80">
                                                {artwork?.created_at ? new Date(artwork.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'Recently created'}
                                            </p>
                                        </div>
                                    </Link>
                                </div>

                                {/* Title */}
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-bold font-raleway leading-tight mb-4">
                                        {artwork?.title || 'Untitled Artwork'}
                                    </h1>
                                    {artwork?.description && (
                                        <p className="text-xl text-white/90 leading-relaxed">
                                            {artwork.description}
                                        </p>
                                    )}
                                </div>

                                {/* Tags */}
                                {artwork?.tags && artwork?.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {artwork.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center space-x-8">
                                    <button
                                        onClick={() => likeArtwork(artwork?.id)}
                                        className="flex items-center space-x-2 text-white hover:text-red-300 transition-colors group"
                                    >
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className="text-2xl group-hover:scale-110 transition-transform"
                                        />
                                        <span className="text-lg font-semibold">{artwork?.likes_count || 0}</span>
                                        <span className="text-white/80">likes</span>
                                    </button>

                                    <div className="flex items-center space-x-2 text-white">
                                        <FontAwesomeIcon icon={faComments} className="text-2xl" />
                                        <span className="text-lg font-semibold">{Array.isArray(comments) ? comments.length : 0}</span>
                                        <span className="text-white/80">comments</span>
                                    </div>

                                    <div className="flex items-center space-x-2 text-white/80">
                                        <span className="text-lg font-semibold">{artwork?.views_count || 0}</span>
                                        <span>views</span>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                {(artwork?.style || artwork?.technique || artwork?.location_text) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/20">
                                        {artwork?.style && (
                                            <div>
                                                <p className="text-white/60 text-sm uppercase tracking-wide">Style</p>
                                                <p className="text-white font-medium">{artwork?.style}</p>
                                            </div>
                                        )}
                                        {artwork?.technique && (
                                            <div>
                                                <p className="text-white/60 text-sm uppercase tracking-wide">Technique</p>
                                                <p className="text-white font-medium">{artwork?.technique}</p>
                                            </div>
                                        )}
                                        {artwork?.location_text && (
                                            <div>
                                                <p className="text-white/60 text-sm uppercase tracking-wide">Location</p>
                                                <p className="text-white font-medium">{artwork?.location_text}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Comments Section */}
            <div className="bg-indigo-600 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-bold text-white">
                                Comments ({Array.isArray(comments) ? comments.length : 0})
                            </h3>
                            <div className="flex items-center space-x-2 text-white/80">
                                <FontAwesomeIcon icon={faComments} />
                                <span className="text-sm">Join the conversation</span>
                            </div>
                        </div>

                    {/* Add Comment Form */}
                    {user ? (
                        <div className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    {user.profile_image_url ? (
                                        <img
                                            src={getFileUrl(user.profile_image_url)}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
                                            <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-colors resize-none text-white placeholder-white/60"
                                        rows="3"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts about this artwork..."
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim()}
                                            className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-white/20"
                                        >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl text-center border border-white/10">
                            <p className="text-white/80 mb-4">Please log in to join the conversation</p>
                            <Link
                                to="/Login"
                                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/20"
                            >
                                Log In
                            </Link>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {Array.isArray(comments) && comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={comment.id} className="flex space-x-4 p-4 hover:bg-white/5 rounded-xl transition-colors border border-white/10">
                                    <div className="flex-shrink-0">
                                        {comment.user?.profile_image_url ? (
                                            <img
                                                src={getFileUrl(comment.user.profile_image_url)}
                                                alt={comment.user.username}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
                                                <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h4 className="font-semibold text-white">
                                                {comment?.user?.username || 'Anonymous'}
                                            </h4>
                                            <span className="text-white/60 text-sm">
                                                {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Recently'}
                                            </span>
                                        </div>
                                        <p className="text-white/90 leading-relaxed mb-3">
                                            {comment?.content}
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleLikeComment(comment?.id, index)}
                                                className="flex items-center space-x-1 text-white/60 hover:text-red-300 transition-colors group"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faHeart}
                                                    className={`text-sm group-hover:scale-110 transition-transform ${
                                                        likedComments[comment.id] ? "text-red-400" : ""
                                                    }`}
                                                />
                                                <span className="text-sm font-medium">{comment.likes || 0}</span>
                                            </button>
                                            <button className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <FontAwesomeIcon icon={faComments} className="text-white/30 text-4xl mb-4" />
                                <h4 className="text-xl font-semibold text-white/80 mb-2">No comments yet</h4>
                                <p className="text-white/60">Be the first to share your thoughts about this artwork!</p>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>

            {/* Share Section */}
            <div className="bg-indigo-600 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Love this artwork? Share it!
                    </h2>
                    <p className="text-white/80 mb-6 text-lg">
                        Help spread the beauty of street art with your friends and community
                    </p>
                    <div className="flex justify-center">
                        <ShareSocial
                            url={!imageError ? getArtworkImage() : window.location.href}
                            socialTypes={["whatsapp", "facebook", "twitter", "email", "reddit"]}
                            style={{
                                root: {
                                    background: 'transparent',
                                    borderRadius: '12px',
                                    border: 0,
                                    color: 'white',
                                },
                                copyContainer: {
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '8px',
                                }
                            }}
                        />
                    </div>
                    </div>
                </div>

                {/* Related Artworks Section */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            More from {artwork?.user?.username || 'this artist'}
                        </h2>
                        <p className="text-white/80 text-lg mb-6">
                            Discover more amazing artworks from talented street artists
                        </p>

                        <Link
                            to={`/profile/${artwork?.user?.username || artwork?.user?.id}`}
                            className="inline-flex items-center px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors font-medium text-lg border border-white/20"
                        >
                            View Artist Profile
                        </Link>
                    </div>
                </div>
            </div>

            <BackToTopButton />

            {/* Footer */}
            <div className="bg-indigo-600 w-full overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <Footer />
                </div>
            </div>


        </div>
    );
}

export default SingleArtwork;
