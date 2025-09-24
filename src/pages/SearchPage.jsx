import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faMapMarkerAlt,
  faUser,
  faNewspaper,
  faImage,
  faSpinner,
  faTimes,
  faHeart,
  faComment,
  faEye,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { useSearch } from '../hooks/redux';
import { useGlobalSearchQuery } from '@store/api/muralFinderApi';
import { setQuery, setFilters, clearSearch } from '@store/slices/searchSlice';
import { useDispatch } from 'react-redux';
import { BackToTopButton, Footer } from '@components';
import styles from '@styles';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { query, searchResults } = useSearch();
  const [filters, setFilters] = useState({
    type: 'all',
    location: null,
    category: null,
    dateRange: null,
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [localQuery, setLocalQuery] = useState(query || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Get search query from URL
  const urlQuery = searchParams.get('q') || '';
  
  // Use the search query from URL or local state
  const searchQuery = urlQuery || localQuery;

  // Global search query
  const { data: searchData, isLoading, error } = useGlobalSearchQuery(
    { 
      query: searchQuery, 
      type: filters.type,
      page: 1,
      per_page: 20
    },
    { skip: !searchQuery || searchQuery.length < 2 }
  );

  // Extract results from the backend response structure
  const searchDataResults = searchData?.data || {};
  const results = [
    ...(searchDataResults.artworks?.data || []).map(item => ({ ...item, type: 'artwork' })),
    ...(searchDataResults.posts?.data || []).map(item => ({ ...item, type: 'post' })),
    ...(searchDataResults.walls?.data || []).map(item => ({ ...item, type: 'wall' })),
    ...(searchDataResults.users?.data || []).map(item => ({ ...item, type: 'user' }))
  ];
  
  const totalResults = (searchDataResults.artworks?.total || 0) + 
                     (searchDataResults.posts?.total || 0) + 
                     (searchDataResults.walls?.total || 0) + 
                     (searchDataResults.users?.total || 0);
  
  // Debug logging
  if (searchData) {
    console.log('Search response:', searchData);
    console.log('Search results:', searchDataResults);
    console.log('Flattened results:', results);
  }
  
  if (error) {
    console.error('Search error:', error);
  }

  useEffect(() => {
    if (urlQuery) {
      setLocalQuery(urlQuery);
      dispatch(setQuery(urlQuery));
    }
  }, [urlQuery, dispatch]);

  const handleSearch = (searchTerm = localQuery) => {
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
      dispatch(setQuery(searchTerm.trim()));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
  };

  const clearSearchHandler = () => {
    setLocalQuery('');
    setSearchParams({});
    dispatch(clearSearch());
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'artwork':
        return faImage;
      case 'wall':
        return faMapMarkerAlt;
      case 'post':
        return faNewspaper;
      case 'user':
        return faUser;
      default:
        return faSearch;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderResult = (result, index) => {
    const icon = getResultIcon(result.type);
    
    return (
      <div key={`${result.type}-${result.id}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={icon} className="text-indigo-600 text-lg" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 font-raleway truncate">
                {result.title || result.name || result.username}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {result.type}
              </span>
            </div>
            
            {result.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {result.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {result.location && (
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                  <span>{result.location}</span>
                </div>
              )}
              
              {result.created_at && (
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                  <span>{formatDate(result.created_at)}</span>
                </div>
              )}
              
              {result.likes_count !== undefined && (
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faHeart} className="text-xs" />
                  <span>{result.likes_count}</span>
                </div>
              )}
              
              {result.comments_count !== undefined && (
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faComment} className="text-xs" />
                  <span>{result.comments_count}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                // Navigate to the appropriate detail page
                if (result.type === 'artwork') {
                  navigate(`/artworks/${result.id}`);
                } else if (result.type === 'wall') {
                  navigate(`/wall/${result.id}`);
                } else if (result.type === 'post') {
                  navigate(`/blog/${result.id}`);
                } else if (result.type === 'user') {
                  navigate(`/profile/${result.id}`);
                }
              }}
              className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-raleway mb-4">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search artworks, walls, posts, users..."
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
              />
              {localQuery && (
                <button
                  onClick={clearSearchHandler}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Results Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-raleway"
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Filters</span>
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
            >
              <option value="relevance">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          
          {searchQuery && (
            <div className="text-sm text-gray-600 font-raleway">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Searching...</span>
                </div>
              ) : (
                <span>
                  {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">Filter Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Content Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                >
                  <option value="all">All Types</option>
                  <option value="artwork">Artworks</option>
                  <option value="wall">Walls</option>
                  <option value="post">Posts</option>
                  <option value="user">Users</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                >
                  <option value="">All Categories</option>
                  <option value="street-art">Street Art</option>
                  <option value="mural">Mural</option>
                  <option value="graffiti">Graffiti</option>
                  <option value="stencil">Stencil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange || ''}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                >
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!searchQuery ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">Start Your Search</h3>
            <p className="text-gray-500 font-raleway">Enter a search term to find artworks, walls, posts, and users.</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">Search Error</h3>
            <p className="text-gray-500 font-raleway">There was an error performing your search. Please try again.</p>
          </div>
        ) : results.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">No Results Found</h3>
            <p className="text-gray-500 font-raleway">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => renderResult(result, index))}
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors font-raleway"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <BackToTopButton />
      <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
        <Footer />
      </div>
    </div>
  );
};

export default SearchPage;
