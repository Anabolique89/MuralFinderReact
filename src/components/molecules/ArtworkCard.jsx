import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLikeArtworkMutation } from '../../store/api/muralFinderApi';
import { toggleArtworkLike, addToRecentlyViewed } from '../../store/slices/artworkSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { useAuth, useTheme } from '../../hooks/redux';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import { getFileUrl } from '../../utils/apiConfig';

const ArtworkCard = ({ 
  artwork, 
  size = 'md',
  showActions = true,
  showUser = true,
  className = ''
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const [likeArtwork, { isLoading: isLiking }] = useLikeArtworkMutation();

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      dispatch(addNotification({
        type: 'info',
        message: 'Please login to like artworks',
        action: {
          label: 'Login',
          onClick: () => dispatch({ type: 'ui/openModal', payload: 'loginModal' })
        }
      }));
      return;
    }

    try {
      const result = await likeArtwork(artwork.id).unwrap();
      
      dispatch(toggleArtworkLike({
        artworkId: artwork.id,
        isLiked: result.is_liked,
        likesCount: result.likes_count
      }));

      dispatch(addNotification({
        type: 'success',
        message: result.is_liked ? 'Artwork liked!' : 'Artwork unliked',
        duration: 2000
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update like status'
      }));
    }
  };

  const handleCardClick = () => {
    dispatch(addToRecentlyViewed(artwork));
    navigate(`/artworks/${artwork.id}`);
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    navigate(`/users/${artwork.user.username}`);
  };

  const HeartIcon = ({ filled = false }) => (
    <svg 
      className={`w-5 h-5 ${filled ? 'text-red-500' : 'text-gray-400'}`} 
      fill={filled ? 'currentColor' : 'none'} 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
      />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div 
      className={`
        group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl
        transition-all duration-300 transform hover:-translate-y-1
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        ${sizes[size]} ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className={`
            absolute inset-0 animate-pulse
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
          `} />
        )}
        
        {!imageError ? (
          <img
            src={getFileUrl(artwork.primary_image_path || artwork.image_path)}
            alt={artwork.title}
            className={`
              w-full h-full object-cover transition-transform duration-300
              group-hover:scale-105
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`
            w-full h-full flex items-center justify-center
            ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}
          `}>
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Overlay Actions */}
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                loading={isLiking}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 shadow-md"
                icon={<HeartIcon filled={artwork.is_liked} />}
              />
            </div>
          </div>
        )}

        {/* Category Badge */}
        {artwork.category && (
          <div className="absolute top-3 left-3">
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${theme === 'dark' 
                ? 'bg-gray-800 bg-opacity-80 text-gray-200' 
                : 'bg-white bg-opacity-90 text-gray-700'
              }
            `}>
              {artwork.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className={`
          font-semibold text-lg mb-2 line-clamp-2
          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
        `}>
          {artwork.title}
        </h3>

        {/* Description */}
        {artwork.description && (
          <p className={`
            text-sm mb-3 line-clamp-2
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
          `}>
            {artwork.description}
          </p>
        )}

        {/* Location */}
        {artwork.location_text && (
          <div className={`
            flex items-center text-sm mb-3
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
          `}>
            <LocationIcon />
            <span className="ml-1 truncate">{artwork.location_text}</span>
          </div>
        )}

        {/* User Info */}
        {showUser && artwork.user && (
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleUserClick}
            >
              <Avatar
                src={artwork.user.profile?.profile_image_url}
                alt={artwork.user.username}
                size="sm"
              />
              <div>
                <p className={`
                  text-sm font-medium
                  ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                `}>
                  {artwork.user.profile?.first_name} {artwork.user.profile?.last_name}
                </p>
                <p className={`
                  text-xs
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  @{artwork.user.username}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className={`
                flex items-center space-x-1
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                <HeartIcon filled={false} />
                <span>{artwork.likes_count || 0}</span>
              </div>
              
              {artwork.views_count && (
                <div className={`
                  flex items-center space-x-1
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{artwork.views_count}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;
