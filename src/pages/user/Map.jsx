import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Map,
  Marker,
  InfoWindow,
  APIProvider,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faDirections,
  faMapMarkerAlt,
  faSpinner,
  faFilter,
  faExpand,
  faCompress,
  faTimes,
  faLocationArrow
} from '@fortawesome/free-solid-svg-icons';
import WallService from "../../services/WallService";
import { getFileUrl } from "../../utils/apiConfig";
import { Footer, BackToTopButton } from "../../components";
import styles from "../../style";
import { Link } from "react-router-dom";
import { AdvancedMarker, Pin} from "@vis.gl/react-google-maps";


const mapOptions = {
  styles: [
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { color: "#6366f1" },
        { weight: 1 },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        { color: "#4f46e5" },
        { weight: 2 },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#1e1b4b" },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        { color: "#ffffff" },
        { weight: 2 },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        { color: "#3730a3" },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#ffffff" },
      ],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        { color: "#f1f5f9" },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        { color: "#e0e7ff" },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        { color: "#8b5cf6" },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#4c1d95" },
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        { color: "#a5b4fc" },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#312e81" },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#4338ca" },
        { weight: 1 },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#6b7280" },
      ],
    },
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: false,
  fullscreenControl: true,
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const defaultProps = {
  center: defaultCenter,
  zoom: 9,
  gestureHandling: "cooperative",
  zoomControl: true,
  options: mapOptions,
  scrollwheel: true,
  streetViewControl: true,
};

// Address Search Component with Autocomplete
const AddressSearchBox = ({ onPlaceSelect, searchQuery, setSearchQuery }) => {
 const map = useMap();
  const places = useMapsLibrary('places');
  const [sessionToken, setSessionToken] = useState();
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [predictionResults, setPredictionResults] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  const fetchPredictions = async (inputValue) => {
    if (!autocompleteService || !inputValue) {
      setPredictionResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const request = { input: inputValue, sessionToken };
      const response = await autocompleteService.getPlacePredictions(request);
      setPredictionResults(response.predictions || []);
      setShowPredictions(true);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictionResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 2) {
      fetchPredictions(value);
    } else {
      setPredictionResults([]);
      setShowPredictions(false);
    }
  };

  const onPlaceSelectInternal = (placeId) => {
    if (!placesService) return;

    const detailRequestOptions = {
      placeId,
      fields: ['geometry', 'name', 'formatted_address'],
      sessionToken
    };

    placesService.getDetails(detailRequestOptions, (placeDetails) => {
      if (placeDetails && placeDetails.geometry && placeDetails.geometry.location) {
        onPlaceSelect(placeDetails);
        setSearchQuery(placeDetails.formatted_address || placeDetails.name);
        setShowPredictions(false);
        setPredictionResults([]);
        setSessionToken(new places.AutocompleteSessionToken());
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && predictionResults.length > 0) {
      e.preventDefault();
      onPlaceSelectInternal(predictionResults[0].place_id);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-600 z-10"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for an address or location..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => predictionResults.length > 0 && setShowPredictions(true)}
          className="w-full h-12 pl-12 pr-12 rounded-full border-2 border-white/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
        />
        {isSearching && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-600"
          />
        )}
        {searchQuery && !isSearching && (
          <button
            onClick={() => {
              setSearchQuery('');
              setPredictionResults([]);
              setShowPredictions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {/* Predictions Dropdown */}
      {showPredictions && predictionResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {predictionResults.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => onPlaceSelectInternal(prediction.place_id)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-indigo-600 mt-1 mr-3 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Maps = () => {
  const navigate = useNavigate();

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [walls, setWalls] = useState([]);
  const [filteredWalls, setFilteredWalls] = useState([]);
  const [image, setImage] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);

  const [cameraProps, setCameraProps] = useState({
    ...defaultProps,
    center: defaultCenter,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [wallSearchQuery, setWallSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWallType, setSelectedWallType] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [searchMode, setSearchMode] = useState('address'); // 'address' or 'walls'

  const apiKey = import.meta.env.VITE_MAP_KEY;

  useEffect(() => {
    const initializeMap = async () => {
      setIsLoading(true);
      setMapError(null);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(currentLocation);
            setMapCenter(currentLocation);
            setCameraProps((prevProps) => ({
              ...prevProps,
              center: currentLocation,
            }));
          },
          (error) => {
            console.warn("Error getting user location:", error);
            setMapCenter(defaultCenter);
          }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
        setMapCenter(defaultCenter);
      }

      try {
        const response = await WallService.getAllWalls();
        if (response.success && response.data?.data) {
          const wallsData = response.data.data;
          console.log('Loaded walls:', wallsData);
          setWalls(wallsData);
          setFilteredWalls(wallsData);
        } else {
          setMapError("Failed to load walls. Please try again.");
          console.error("Error fetching walls:", response.message);
        }
      } catch (error) {
        setMapError("Network error while loading walls.");
        console.error("Error fetching walls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []);

  // Filter walls based on wall search query
  useEffect(() => {
    let filtered = walls;

    if (selectedWallType !== 'all') {
      filtered = filtered.filter(wall =>
        wall.wall_type === selectedWallType ||
        wall.surface_type === selectedWallType
      );
    }

    if (wallSearchQuery.trim()) {
      filtered = filtered.filter(wall =>
        wall.name?.toLowerCase().includes(wallSearchQuery.toLowerCase()) ||
        wall.location_text?.toLowerCase().includes(wallSearchQuery.toLowerCase()) ||
        wall.city?.toLowerCase().includes(wallSearchQuery.toLowerCase()) ||
        wall.description?.toLowerCase().includes(wallSearchQuery.toLowerCase())
      );
    }

    setFilteredWalls(filtered);
  }, [walls, selectedWallType, wallSearchQuery]);

  const handlePlaceSelect = (placeDetails) => {
    if (placeDetails && placeDetails.geometry && placeDetails.geometry.location) {
      const location = {
        lat: placeDetails.geometry.location.lat(),
        lng: placeDetails.geometry.location.lng()
      };
      
      setSearchMarker({
        position: location,
        name: placeDetails.name,
        address: placeDetails.formatted_address
      });
      
      setCameraProps(prev => ({
        ...prev,
        center: location,
        zoom: 16
      }));
    }
  };

  const handleMarkerClick = (index) => {
    const wall = filteredWalls[index];
    setSelectedMarker(index);
    setImage(wall.image_path ? getFileUrl(wall.image_path) : null);
    setSearchMarker(null); // Clear search marker when clicking a wall

    setCameraProps(prev => ({
      ...prev,
      center: {
        lat: Number(wall.latitude),
        lng: Number(wall.longitude)
      },
      zoom: Math.max(prev.zoom, 15)
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetMapView = () => {
    if (userLocation) {
      setCameraProps(prev => ({
        ...prev,
        center: userLocation,
        zoom: 12
      }));
    } else {
      setCameraProps(prev => ({
        ...prev,
        center: defaultCenter,
        zoom: 9
      }));
    }
    setSearchMarker(null);
    setSearchQuery('');
  };

  const handleDirections = (destination) => {
    if (!userLocation) {
      setMapError("Please allow location access to get directions.");
      setTimeout(() => setMapError(null), 3000);
      return;
    }

    const destinationLatLng = `${destination.latitude},${destination.longitude}`;
    const userLatLng = `${userLocation.lat},${userLocation.lng}`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLatLng}&destination=${destinationLatLng}&travelmode=driving`;

    window.open(directionsUrl, "_blank");
  };

  const getWallTypeIcon = (wallType) => {
    switch (wallType) {
      case 'building': return '🏢';
      case 'fence': return '🚧';
      case 'bridge': return '🌉';
      case 'tunnel': return '🚇';
      default: return '🎨';
    }
  };

  const getWallStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (mapError && isLoading) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-6xl mb-4 opacity-50" />
          <h1 className="text-2xl font-bold mb-4">Map Error</h1>
          <p className="mb-6">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Reload Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-indigo-600 ${isFullscreen ? 'fixed inset-0 z-50' : 'pt-20'}`}>
      <APIProvider apiKey={apiKey} libraries={["places"]}>
          <div className="relative w-full h-screen">

            {isLoading && (
              <div className="absolute inset-0 bg-indigo-600 flex items-center justify-center z-50">
                <div className="text-center text-white">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-6xl mb-4" />
                  <p className="text-xl">Loading map and walls...</p>
                </div>
              </div>
            )}

            {/* Top Controls Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center space-y-4 w-full max-w-2xl px-4">
              {/* Search Mode Toggle */}
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
                <button
                  onClick={() => {
                    setSearchMode('address');
                    setWallSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    searchMode === 'address'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  Search Address
                </button>
                <button
                  onClick={() => {
                    setSearchMode('walls');
                    setSearchQuery('');
                    setSearchMarker(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    searchMode === 'walls'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🎨 Search Walls
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full z-[9999] pointer-events-auto">

                {searchMode === 'address' ? (
                  <AddressSearchBox
                    onPlaceSelect={handlePlaceSelect}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                ) : (
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-600 z-10"
                    />
                    <input
                      type="text"
                      placeholder="Search walls by name, location, or city..."
                      value={wallSearchQuery}
                      onChange={(e) => setWallSearchQuery(e.target.value)}
                      className="w-full h-12 pl-12 pr-12 rounded-full border-2 border-white/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
                    />
                    {wallSearchQuery && (
                      <button
                        onClick={() => setWallSearchQuery('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleFilters}
                  className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg ${
                    showFilters
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Filters
                </button>

                <button
                  onClick={() => navigate("/addWall")}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Wall
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="absolute top-48 left-1/2 transform -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter Walls</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wall Type</label>
                    <select
                      value={selectedWallType}
                      onChange={(e) => setSelectedWallType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="building">Building</option>
                      <option value="fence">Fence</option>
                      <option value="bridge">Bridge</option>
                      <option value="tunnel">Tunnel</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setSelectedWallType('all');
                        setWallSearchQuery('');
                      }}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Side Controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3">
              <button
                onClick={resetMapView}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-indigo-600 hover:bg-white transition-colors"
                title="Reset View"
              >
                <FontAwesomeIcon icon={faLocationArrow} />
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-indigo-600 hover:bg-white transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
              </button>
            </div>

            {/* Stats Panel */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">{filteredWalls.length} Walls</span>
                </div>
                {userLocation && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Your Location</span>
                  </div>
                )}
                {searchMarker && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Search Result</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Toast */}
            {mapError && !isLoading && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
                {mapError}
              </div>
            )}

            {/* Map Component */}
            {/* <Map {...cameraProps} onCameraChanged={(ev) => setCameraProps(ev.detail)}> */}
<Map
  {...cameraProps}
  onCameraChanged={(ev) => {
    // Only update bounds and other camera details, not your manually set center
    setCameraProps(prev => ({
      ...prev,
      bounds: ev.detail.bounds,
    }));
  }}
>

              {/* User Location Marker */}
              {userLocation && showUserLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="#10b981" stroke="#ffffff" stroke-width="3"/>
                        <circle cx="16" cy="16" r="8" fill="#ffffff"/>
                        <circle cx="16" cy="16" r="4" fill="#10b981"/>
                        <text x="16" y="6" text-anchor="middle" fill="#10b981" font-size="8" font-weight="bold">YOU</text>
                      </svg>
                    `),
                    anchor: { x: 16, y: 16 }
                  }}
                  title="Your Location"
                />
              )}

              {/* Search Result Marker */}
              {searchMarker && (
                <Marker
                  position={searchMarker.position}
                  onClick={() => {
                    setSelectedMarker(null);
                  }}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#f97316" stroke="#ffffff" stroke-width="3"/>
                        <text x="20" y="28" text-anchor="middle" fill="white" font-size="20" font-weight="bold">📍</text>
                      </svg>
                    `),
                    anchor: { x: 20, y: 20 }
                  }}
                  title={searchMarker.name}
                >
                  <InfoWindow
                    position={searchMarker.position}
                    onCloseClick={() => setSearchMarker(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold text-gray-800">{searchMarker.name}</h3>
                      <p className="text-sm text-gray-600">{searchMarker.address}</p>
                    </div>
                  </InfoWindow>
                </Marker>
              )}

              {/* Art Wall Markers */}
              {filteredWalls.map((wall, index) => (
                <Marker
                  key={wall.id}
                  position={{
                    lat: Number(wall.latitude),
                    lng: Number(wall.longitude),
                  }}
                  onClick={() => handleMarkerClick(index)}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" fill="#4f46e5" stroke="#ffffff" stroke-width="3"/>
                        <text x="18" y="24" text-anchor="middle" fill="white" font-size="18" font-weight="bold">🎨</text>
                      </svg>
                    `),
                    anchor: { x: 18, y: 18 }
                  }}
                  title={wall.name || wall.location_text}
                />
              ))}

              {/* Enhanced InfoWindow for Art Walls */}
              {selectedMarker !== null && filteredWalls[selectedMarker] && (
                <InfoWindow
                  position={{
                    lat: Number(filteredWalls[selectedMarker].latitude),
                    lng: Number(filteredWalls[selectedMarker].longitude),
                  }}
                  onCloseClick={() => {
                    setSelectedMarker(null);
                    setImage("");
                  }}
                >
                  <div className="max-w-sm bg-white rounded-lg overflow-hidden">
                    <div className="bg-indigo-600 text-white p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold truncate">
                          {filteredWalls[selectedMarker].name || filteredWalls[selectedMarker].location_text}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getWallStatusColor(filteredWalls[selectedMarker].status)} bg-white`}>
                          {filteredWalls[selectedMarker].status}
                        </span>
                      </div>
                      <p className="text-indigo-100 text-sm mt-1">
                        {getWallTypeIcon(filteredWalls[selectedMarker].wall_type)} {filteredWalls[selectedMarker].wall_type}
                      </p>
                    </div>

                    {image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={image}
                          alt="Wall"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {filteredWalls[selectedMarker].description || "No description available."}
                      </p>

                      <div className="text-xs text-gray-500 mb-4">
                        <p>📍 {filteredWalls[selectedMarker].city}</p>
                        {filteredWalls[selectedMarker].is_legal && (
                          <p className="text-green-600">✅ Legal wall</p>
                        )}
                        <p>🎨 {filteredWalls[selectedMarker].artworks_count || 0} artworks</p>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/wall/${filteredWalls[selectedMarker].id}`}
                          className="flex-1 bg-indigo-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleDirections(filteredWalls[selectedMarker])}
                          disabled={!userLocation}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={faDirections} className="mr-1" />
                          Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}

            </Map>
          </div>
        </APIProvider>

      {!isFullscreen && (
        <>
          <BackToTopButton />
          <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Maps;