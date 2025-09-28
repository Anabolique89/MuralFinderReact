import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearch, useTheme } from '../../hooks/redux';
import { setQuery, addRecentSearch, clearSearch } from '../../store/slices/searchSlice';
import { useGlobalSearchQuery } from '../../store/api/muralFinderApi';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const SearchBar = ({ 
  placeholder = "Search artworks, walls, posts...",
  showFilters = true,
  onFocus,
  onBlur,
  className = ''
}) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { query, recentSearches, filters } = useSearch();
  const [localQuery, setLocalQuery] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced search
  const { data: searchResults, isLoading } = useGlobalSearchQuery(
    { query: localQuery, type: filters.type },
    { skip: localQuery.length < 2 }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== query) {
        dispatch(setQuery(localQuery));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, query, dispatch]);

  const handleSearch = (searchQuery = localQuery) => {
    if (searchQuery.trim()) {
      dispatch(setQuery(searchQuery));
      dispatch(addRecentSearch(searchQuery));
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(clearSearch());
    inputRef.current?.focus();
  };

  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const ClearIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const FilterIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
    </svg>
  );

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setShowSuggestions(true);
              onFocus?.();
            }}
            onBlur={(e) => {
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => {
                if (!suggestionsRef.current?.contains(document.activeElement)) {
                  setShowSuggestions(false);
                  onBlur?.(e);
                }
              }, 150);
            }}
            placeholder={placeholder}
            icon={isLoading ? (
              <div className="animate-spin">
                <SearchIcon />
              </div>
            ) : (
              <SearchIcon />
            )}
            className="pr-10"
          />
          
          {localQuery && (
            <button
              onClick={handleClear}
              className={`
                absolute right-3 top-1/2 transform -translate-y-1/2
                p-1 rounded-full hover:bg-gray-100 transition-colors
                ${theme === 'dark' ? 'hover:bg-gray-700' : ''}
              `}
            >
              <ClearIcon />
            </button>
          )}
        </div>

        {showFilters && (
          <Button
            variant="outline"
            size="md"
            icon={<FilterIcon />}
            onClick={() => {/* Open filters modal */}}
          >
            Filters
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (localQuery.length > 0 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className={`
            absolute top-full left-0 right-0 mt-1 z-50
            border rounded-lg shadow-lg max-h-96 overflow-y-auto
            ${theme === 'dark' 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
            }
          `}
        >
          {/* Search Results */}
          {searchResults && localQuery.length > 1 && (
            <div className="p-2">
              <div className={`
                text-xs font-medium px-2 py-1 mb-2
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                Search Results
              </div>
              {searchResults.data?.slice(0, 5).map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(result.title || result.name)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md
                    hover:bg-gray-100 transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-md flex items-center justify-center text-xs
                      ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
                    `}>
                      {result.type === 'artwork' ? '🎨' : 
                       result.type === 'wall' ? '🧱' : 
                       result.type === 'post' ? '📝' : '👤'}
                    </div>
                    <div>
                      <div className="font-medium">
                        {result.title || result.name}
                      </div>
                      <div className={`
                        text-sm capitalize
                        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                      `}>
                        {result.type}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-600">
              <div className={`
                text-xs font-medium px-2 py-1 mb-2
                ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              `}>
                Recent Searches
              </div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md
                    hover:bg-gray-100 transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{search}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
