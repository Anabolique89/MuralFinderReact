import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ArtworksGallery, Footer, BackToTopButton } from '../../components';
import ArtworkService from '../../services/ArtworkService';
import styles from '../../style';

const ArtworkFeed = () => {
  // State management
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch artworks and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [artworksResponse, categoriesResponse] = await Promise.all([
          ArtworkService.loadUngroupedArtworks(currentPage, 20),
          ArtworkService.loadCategories()
        ]);

        console.log('ArtworkFeed - artworksResponse:', artworksResponse);
        console.log('ArtworkFeed - categoriesResponse:', categoriesResponse);

        if (artworksResponse && artworksResponse.artworks && Array.isArray(artworksResponse.artworks)) {
          const newArtworks = artworksResponse.artworks;
          console.log('ArtworkFeed - newArtworks:', newArtworks);
          if (currentPage === 1) {
            setArtworks(newArtworks);
          } else {
            setArtworks(prev => [...prev, ...newArtworks]);
          }
          setHasMore(artworksResponse.hasMore);
        } else {
          console.log('ArtworkFeed - No artworks found in response');
          setArtworks([]);
          setHasMore(false);
        }

        if (categoriesResponse && Array.isArray(categoriesResponse)) {
          setCategories([{ id: 'all', name: 'All Categories' }, ...categoriesResponse]);
        } else {
          console.log('ArtworkFeed - No categories found in response');
          setCategories([{ id: 'all', name: 'All Categories' }]);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load artworks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Filter artworks based on search and category
  useEffect(() => {
    console.log('Filtering artworks:', {
      totalArtworks: artworks.length,
      selectedCategory,
      searchQuery
    });

    let filtered = artworks;

    // Filter by category
    if (selectedCategory !== 'all') {
      console.log('Filtering by category:', selectedCategory);
      filtered = filtered.filter(artwork => {
        // Handle both string and number comparison for category ID
        const categoryId = artwork.category?.id;
        const matches = categoryId == selectedCategory ||
                       artwork.category?.slug === selectedCategory ||
                       artwork.category?.name === selectedCategory;

        if (matches) {
          console.log('Category match found:', artwork.title, artwork.category);
        }
        return matches;
      });
      console.log('After category filter:', filtered.length);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      console.log('Filtering by search:', searchQuery);
      filtered = filtered.filter(artwork =>
        artwork.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('After search filter:', filtered.length);
    }

    console.log('Final filtered artworks:', filtered.length);
    setFilteredArtworks(filtered);
  }, [artworks, selectedCategory, searchQuery]);

  // Handler functions
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect above
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };
  if (error) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error Loading Artworks</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-600">
      {/* Hero Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Artwork Feed
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Discover amazing street art from artists around the world
            </p>

            {/* Search and Filter Section */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search artworks, artists, or descriptions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-white text-indigo-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} spin className="text-white text-6xl mb-4" />
              <p className="text-white text-xl">Loading amazing artworks...</p>
            </div>
          </div>
        ) : filteredArtworks.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <p className="text-white/80 text-lg">
                Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && (
                  <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
                )}
                {searchQuery && (
                  <span> matching "{searchQuery}"</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredArtworks.map(artwork => (
                <ArtworksGallery key={artwork.id} artwork={artwork} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More Artworks'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-4">No Artworks Found</h3>
              <p className="text-white/80 mb-6">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No artworks available at the moment.'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <BackToTopButton />

      {/* Footer */}
      <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
        <Footer />
      </div>
    </div>
  );
}

export default ArtworkFeed;