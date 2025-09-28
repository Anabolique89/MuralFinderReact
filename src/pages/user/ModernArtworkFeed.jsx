import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetArtworksQuery } from '@store/api/muralFinderApi';
import { useArtworks, useAuth, useTheme } from '@hooks/redux';
import { setFeedArtworks, setViewMode, setFilters } from '@store/slices/artworkSlice';
import { addNotification } from '@store/slices/uiSlice';
import { ModernRoute, ArtworkCard, ModernInput, ModernButton, LoadingSpinner } from '@components';
import { MdGridView, MdViewList, MdViewModule, MdSearch, MdFilterList, MdRefresh } from 'react-icons/md';

const ModernArtworkFeed = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { feedArtworks, viewMode, filters } = useArtworks();
  
  // Local state
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // API Queries
  const { 
    data: artworksData, 
    isLoading: artworksLoading, 
    error: artworksError,
    refetch: refetchArtworks
  } = useGetArtworksQuery({ 
    page, 
    pageSize: 20,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery || undefined,
    sortBy
  });

  // Mock categories for now - can be replaced with real API later
  const categoriesData = [
    { id: 'street-art', name: 'Street Art' },
    { id: 'murals', name: 'Murals' },
    { id: 'graffiti', name: 'Graffiti' },
    { id: 'stencils', name: 'Stencils' },
    { id: 'installations', name: 'Installations' }
  ];

  // Update Redux state when data changes
  useEffect(() => {
    if (artworksData?.data) {
      if (page === 1) {
        dispatch(setFeedArtworks(artworksData.data));
      } else {
        // Append for pagination
        dispatch(setFeedArtworks([...feedArtworks, ...artworksData.data]));
      }
    }
  }, [artworksData, page, dispatch]);

  // Handle errors
  useEffect(() => {
    if (artworksError) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to load artworks. Please try again.',
        duration: 5000
      }));
    }
  }, [artworksError, dispatch]);

  // Interactive functions
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    dispatch(addNotification({
      type: 'info',
      message: searchQuery ? `Searching for "${searchQuery}"...` : 'Showing all artworks',
      duration: 2000
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
    dispatch(setFilters({ category: categoryId }));
    dispatch(addNotification({
      type: 'info',
      message: `Filtering by ${categoryId === 'all' ? 'all categories' : categoryId}`,
      duration: 2000
    }));
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
    dispatch(addNotification({
      type: 'info',
      message: `Switched to ${mode} view`,
      duration: 1500
    }));
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(1);
    dispatch(addNotification({
      type: 'info',
      message: `Sorting by ${sort}`,
      duration: 1500
    }));
  };

  const handleLoadMore = () => {
    if (artworksData?.pagination?.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    refetchArtworks();
    dispatch(addNotification({
      type: 'success',
      message: 'Artworks refreshed!',
      duration: 2000
    }));
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'grid grid-cols-1 gap-6';
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6';
      default: // grid
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <ModernRoute title="Artwork Feed" requireAuth={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Discover Street Art
              </h1>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Explore amazing artworks from artists around the world
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <ModernButton
                variant="outline"
                onClick={handleRefresh}
                icon={<MdRefresh className="w-4 h-4" />}
                disabled={artworksLoading}
              >
                Refresh
              </ModernButton>
              
              {isAuthenticated && (
                <ModernButton
                  variant="primary"
                  onClick={() => {/* Open upload modal */}}
                >
                  Upload Artwork
                </ModernButton>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <ModernInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks, artists, locations..."
                icon={<MdSearch className="w-5 h-5" />}
                fullWidth
              />
            </form>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <MdFilterList className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Categories</option>
                {categoriesData?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                View:
              </span>
              <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                {[
                  { mode: 'grid', icon: MdGridView, label: 'Grid' },
                  { mode: 'list', icon: MdViewList, label: 'List' },
                  { mode: 'masonry', icon: MdViewModule, label: 'Masonry' }
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => handleViewModeChange(mode)}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      viewMode === mode
                        ? 'bg-blue-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {artworksData?.pagination?.total || 0} artworks found
            </div>
          </div>
        </div>

        {/* Content */}
        {artworksLoading && page === 1 ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading amazing artworks..." />
          </div>
        ) : feedArtworks.length > 0 ? (
          <>
            <div className={getGridClasses()}>
              {feedArtworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  size={viewMode === 'list' ? 'lg' : 'md'}
                  showActions={true}
                />
              ))}
            </div>

            {/* Load More Button */}
            {artworksData?.pagination?.hasNextPage && (
              <div className="flex justify-center mt-12">
                <ModernButton
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  loading={artworksLoading && page > 1}
                >
                  Load More Artworks
                </ModernButton>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No artworks found
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to share some amazing street art!'
              }
            </p>
            {isAuthenticated && (
              <ModernButton
                variant="primary"
                onClick={() => {/* Open upload modal */}}
              >
                Upload First Artwork
              </ModernButton>
            )}
          </div>
        )}
      </div>
    </ModernRoute>
  );
};

export default ModernArtworkFeed;
