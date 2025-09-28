import styles from '@styles';
import { FaComments } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useState, useCallback, useEffect } from 'react';
import AuthService from '@services/AuthService';
import ArtworkService from '@services/ArtworkService';
import { Link, useNavigate } from 'react-router-dom';
import { getFileUrl } from '../utils/apiConfig';

const ArtworksGallery = ({ artwork, onDelete }) => {

  // console.log("artwork Gallery", artwork);
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getUser() ?? null;
  const userImage = artwork?.user?.profile_image_url || artwork?.user?.profile?.profile_image_url || '';

  const defaultImage = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80';
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const navigate = useNavigate();

  // Function to get the best available image
  const getArtworkImage = () => {
    if (imageError) return defaultImage;

    const primaryImage = artwork?.primary_image_path ? getFileUrl(artwork.primary_image_path) : null;
    const fallbackImage = artwork?.image_path ? getFileUrl(artwork.image_path) : null;

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

  // Update current image source when artwork changes
  useEffect(() => {
    if (artwork && !imageError) {
      const primaryImage = artwork?.primary_image_path ? getFileUrl(artwork.primary_image_path) : null;
      const fallbackImage = artwork?.image_path ? getFileUrl(artwork.image_path) : null;
      const newImageSrc = primaryImage || fallbackImage || defaultImage;
      setCurrentImageSrc(newImageSrc);
    }
  }, [artwork, imageError]);

  const handleEdit = (artworkId) => {
    navigate(`/artwork/edit/${artworkId}`);
  };

  const handleDelete = useCallback(async (artworkId) => {
    setLoading(true);
    try {
      const deleteResponse = await ArtworkService.deleteArtwork(artworkId);
      if (deleteResponse) {
        setSuccessMessage('Artwork deleted successfully');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        // onDelete(artworkId);
      } else {
        setErrorMessage('Failed to delete artwork');
        setSuccessMessage('');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    } catch (error) {
      setErrorMessage('Error deleting artwork');
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  }, [onDelete]);

  const likeArtwork = async (artworkId) => {
    try {
      const likeResponse = await ArtworkService.likeArtwork(artworkId);
      console.log(likeResponse, 'likeResponseeeeeeeeeData')
      // console.log(likeResponse, 'likeResponseeeeeeeee')

      if (likeResponse?.data?.success) {
        setSuccessMessage(likeResponse?.data?.message || 'Artwork liked successfully');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrorMessage(likeResponse || 'Failed to like artwork');
        setSuccessMessage('');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }

    } catch (error) {
      setErrorMessage('Error liking artwork');
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);

    }
  }
  const unLikeArtwork = async (artworkId) => {
    try {
      const unlikeResponse = await ArtworkService.unLikeArtwork(artworkId);
      console.log(unlikeResponse, 'unlikeResponse');

      // Check success in response data and update messages accordingly
      if (unlikeResponse?.success) {
        setSuccessMessage(unlikeResponse?.message || 'Artwork unliked successfully');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrorMessage(unlikeResponse || 'Failed to unlike artwork');
        setSuccessMessage('');
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }

      // Return response after handling success/error messages
      return unlikeResponse;
    } catch (error) {
      setErrorMessage('Error unliking artwork');
      setSuccessMessage('');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
          {errorMessage}
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/artworks/${artwork?.id}`}>
          <div className="aspect-square relative group bg-gray-200 overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400 text-2xl" />
              </div>
            )}
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={currentImageSrc || getArtworkImage()}
              alt={artwork?.title || 'Artwork'}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {imageError && (
              <div className="absolute top-2 left-2 bg-red-500/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs z-20">
                Placeholder
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

            {/* View Details Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                View Details
              </div>
            </div>
          </div>
        </Link>

        {/* Owner Actions (Edit/Delete) */}
        {isAuthenticated && user.id === artwork?.user_id && (
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/artwork/edit/${artwork?.id}`}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <FontAwesomeIcon icon={faPencil} className="text-gray-700 text-sm" />
            </Link>

            {!loading ? (
              <button
                onClick={() => handleDelete(artwork?.id)}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="text-red-600 text-sm" />
              </button>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                <FontAwesomeIcon icon={faSpinner} className="text-gray-400 text-sm animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* Category Badge */}
        {artwork?.category && (
          <div className="absolute top-3 left-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg"
              style={{ backgroundColor: artwork.category.color_code || '#6366f1' }}
            >
              {artwork.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Artist Info */}
        <div className="flex items-center mb-3">
          <Link to={`/profile/${artwork?.user?.username || artwork?.user?.id}`} className="flex items-center group/artist">
            <div className="relative">
              {userImage ? (
                <img
                  src={getFileUrl(userImage)}
                  alt={artwork?.user?.username}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 group-hover/artist:text-indigo-600 transition-colors">
                {artwork?.user?.username || artwork?.user?.profile?.first_name || 'Unknown Artist'}
              </p>
              <p className="text-xs text-gray-500">
                {artwork?.created_at ? new Date(artwork.created_at).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-3">
          <Link to={`/artworks/${artwork?.id}`}>
            <h3 className="font-bold text-gray-900 text-lg leading-tight hover:text-indigo-600 transition-colors line-clamp-2">
              {artwork?.title || 'Untitled Artwork'}
            </h3>
          </Link>
          {artwork?.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {artwork.description}
            </p>
          )}
        </div>

        {/* Tags */}
        {artwork?.tags && artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {artwork.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {artwork.tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{artwork.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => likeArtwork(artwork?.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors group/like"
            >
              <FaHeart className="text-sm group-hover/like:scale-110 transition-transform" />
              <span className="text-sm font-medium">{artwork?.likes_count || 0}</span>
            </button>

            <div className="flex items-center space-x-1 text-gray-600">
              <FaComments className="text-sm" />
              <span className="text-sm font-medium">{artwork?.comments_count || 0}</span>
            </div>
          </div>

          {/* Views */}
          <div className="text-xs text-gray-400">
            {artwork?.views_count || 0} views
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtworksGallery;
