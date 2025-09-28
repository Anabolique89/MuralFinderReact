import { useState, useRef, useEffect } from 'react';
import { useGetArtworksQuery } from '@store/api/muralFinderApi';
import { useAuth } from '@hooks/redux';
import styles from '@styles';
import AuthService from '@services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faThumbsUp, faComment, faUser, faEdit, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getFileUrl } from '../utils/apiConfig';

const Carousel = () => {
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useRef(null);

  // Use the same beautiful default image as ArtworkFeed
  const defaultImage = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80';

  // Create a branded placeholder for sample data
  const createPlaceholderImage = (title = 'Artwork') => {
    return `https://via.placeholder.com/400x300/6366f1/ffffff?text=${encodeURIComponent(title)}`;
  };

  const [imageErrors, setImageErrors] = useState(new Set());
  const { isAuthenticated } = useAuth();
  const currentUser = AuthService.getUser();

  // Use Redux Query to fetch artworks (like HomePage does)
  const { data: artworksData, isLoading } = useGetArtworksQuery({ page: 1, pageSize: 6 });

  // Convert the API response to grouped format for display
  // The data structure is: { data: { data: [...artworks], current_page: 1, ... } }
  const artworks = artworksData?.data?.data && Array.isArray(artworksData.data.data) ? [{
    category: "Featured Artworks",
    artworks: artworksData.data.data.slice(0, 6)
  }] : [];

  console.log('Carousel artworksData:', artworksData);
  console.log('Carousel converted artworks:', artworks);

  // Handle image error
  const handleImageError = (artworkId, artworkTitle) => {
    setImageErrors(prev => new Set([...prev, artworkId]));
  };

  // Check if image has error
  const hasImageError = (artworkId) => {
    return imageErrors.has(artworkId);
  };

  // Get image source with fallback
  const getImageSrc = (artwork) => {
    if (hasImageError(artwork.id)) {
      return defaultImage;
    }

    // Try primary_image_path first, then image_path
    const imagePath = artwork.primary_image_path || artwork.image_path;

    if (imagePath) {
      if (imagePath.startsWith('/api/placeholder')) {
        return createPlaceholderImage(artwork.title || 'Artwork');
      }
      return getFileUrl(imagePath);
    }

    return defaultImage;
  };



  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction) => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, []);



  return (
    <section>
      <div className="carousel my-2 mx-2 w-full overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-white mb-4" />
              <p className="text-white text-lg font-raleway">Loading amazing artworks...</p>
            </div>
          </div>
        ) : artworks.length > 0 ? (
          artworks.map(categoryData => (
            <div key={categoryData.category} className="mb-8">
              <h2 className={`${styles.paragraph} text-2xl mb-2 font-bold text-white`}>{categoryData.category}</h2>
              <hr className='p-5 mt-1 mb-2' />
              <div className="flex items-center space-x-4">
                <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-webkit">
                  <div ref={carousel} className="flex space-x-4">
                    {categoryData.artworks.map(artwork => (
                      <div key={artwork.id} className="w-64 flex-shrink-0 relative">
                        <Link to={`/artworks/${artwork.id}`} className="block rounded-lg overflow-hidden group">
                          <div className="relative h-40 bg-gray-200 overflow-hidden">
                            <img
                              src={getImageSrc(artwork)}
                              alt={artwork.title || 'Artwork'}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={() => handleImageError(artwork.id, artwork.title)}
                            />

                            {/* Error indicator */}
                            {hasImageError(artwork.id) && (
                              <div className="absolute top-2 left-2 bg-indigo-500/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs z-20">
                                <FontAwesomeIcon icon={faImage} className="mr-1" />
                                Placeholder
                              </div>
                            )}

                            {/* Title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <h4 className="text-white font-semibold text-sm truncate">
                                {artwork.title || 'Untitled Artwork'}
                              </h4>
                            </div>
                          </div>
                          <div className="absolute inset-0 flex items-start justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 pl-2">
                            <div className="flex items-center mt-4 w-full text-white justify-between">
                              <div className="flex items-center">
                                <Link to={`/profile/${artwork.user.id}`} className="flex items-center">
                                  {artwork?.user?.profile?.profile_image_url ? (
                                    <img
                                      src={
                                        artwork.user.profile.profile_image_url.startsWith('/api/placeholder')
                                          ? `https://via.placeholder.com/50x50/8b5cf6/ffffff?text=${artwork.user.username.charAt(0).toUpperCase()}`
                                          : `https://api.muralfinder.net${artwork.user.profile.profile_image_url}`
                                      }
                                      alt={artwork.user.username}
                                      className='w-8 h-8 rounded-full mr-2 object-cover border-2 border-white/20'
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}

                                  {/* Fallback avatar */}
                                  <div
                                    className="w-8 h-8 rounded-full mr-2 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-2 border-white/20"
                                    style={{ display: artwork?.user?.profile?.profile_image_url ? 'none' : 'flex' }}
                                  >
                                    <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
                                  </div>
                                  <div>
                                    <p className="font-semibold font-raleway">{artwork?.user?.username?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                                  </div>
                                </Link>
                              </div>
                              {currentUser && currentUser.id === artwork.user.id && (
                                <div className="flex space-x-2 ml-20">
                                  <Link to={`/artwork/edit/${artwork.id}`}>
                                    <button className="text-blue-500 hover:text-blue-700">
                                      <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                  </Link>
                                  <button onClick={() => handleDelete(artwork.id)} className="text-red-500 hover:text-red-700">
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-white font-raleway mb-4">
              Loading Artworks...
            </h3>
            <p className="text-white/70 font-raleway mb-8 max-w-md mx-auto">
              We're fetching the latest artworks from our community. If this takes too long, try refreshing the page.
            </p>
            <Link
              to="/ArtworkFeed"
              className="inline-flex items-center px-6 py-3 bg-blue-gradient text-primary font-raleway font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              View All Artworks
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel;
