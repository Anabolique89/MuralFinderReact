import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  results: [],
  suggestions: [],
  recentSearches: [],
  filters: {
    type: 'all', // 'all', 'artworks', 'walls', 'posts', 'users'
    location: null,
    category: null,
    dateRange: null,
  },
  isSearching: false,
  hasSearched: false,
  totalResults: 0,
  currentPage: 1,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
      state.hasSearched = true;
    },
    appendResults: (state, action) => {
      state.results = [...state.results, ...action.payload];
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    addRecentSearch: (state, action) => {
      const search = action.payload;
      state.recentSearches = [
        search,
        ...state.recentSearches.filter(s => s !== search)
      ].slice(0, 10);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: 'all',
        location: null,
        category: null,
        dateRange: null,
      };
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setTotalResults: (state, action) => {
      state.totalResults = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.hasSearched = false;
      state.totalResults = 0;
      state.currentPage = 1;
    },
  },
});

export const {
  setQuery,
  setResults,
  appendResults,
  setSuggestions,
  addRecentSearch,
  clearRecentSearches,
  setFilters,
  clearFilters,
  setIsSearching,
  setTotalResults,
  setCurrentPage,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
