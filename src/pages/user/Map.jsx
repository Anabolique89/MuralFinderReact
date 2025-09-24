import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Map,
  Marker,
  InfoWindow,
  APIProvider,
} from "@vis.gl/react-google-maps";
import {
  DirectionsRenderer,
} from "@react-google-maps/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faDirections,
  faMapMarkerAlt,
  faSpinner,
  faFilter,
  faExpand,
  faCompress
} from '@fortawesome/free-solid-svg-icons';
import WallService from "../../services/WallService";
import { getFileUrl } from "../../utils/apiConfig";
import { Footer, BackToTopButton } from "../../components";
import styles from "../../style";
import { Link } from "react-router-dom";

const mapOptions = {
  styles: [
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { color: "#6366f1" }, // Indigo-500 for roads
        { weight: 1 },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        { color: "#4f46e5" }, // Indigo-600 for highways
        { weight: 2 },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#1e1b4b" }, // Indigo-900 for road labels
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
        { color: "#3730a3" }, // Indigo-700 for water
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
        { color: "#f1f5f9" }, // Light gray for landscape
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        { color: "#e0e7ff" }, // Indigo-100 for natural areas
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        { color: "#8b5cf6" }, // Purple-500 for POI
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#4c1d95" }, // Purple-900 for POI labels
      ],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        { color: "#a5b4fc" }, // Indigo-300 for transit
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#312e81" }, // Indigo-800 for transit labels
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#4338ca" }, // Indigo-700 for borders
        { weight: 1 },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#6b7280" }, // Gray-500 for admin labels
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

// Default map center (San Francisco)
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

const Maps = () => {
  const navigate = useNavigate();

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [walls, setWalls] = useState([]);
  const [filteredWalls, setFilteredWalls] = useState([]);
  const [image, setImage] = useState("");
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [directions, setDirections] = useState(null);
  const [userLocation, setUserLocation] = useState('');

  const [cameraProps, setCameraProps] = useState({
    ...defaultProps,
    center: defaultCenter,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWallType, setSelectedWallType] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [mapError, setMapError] = useState(null);

  // load environment vairables

  const apiKey = import.meta.env.VITE_MAP_KEY;

  useEffect(() => {
    const initializeMap = async () => {
      setIsLoading(true);
      setMapError(null);

      // Get user location
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
            // Use default location if geolocation fails
            setMapCenter(defaultCenter);
          }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
        setMapCenter(defaultCenter);
      }

      // Fetch walls from database
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

  // Filter walls based on search and wall type
  useEffect(() => {
    let filtered = walls;

    // Filter by wall type
    if (selectedWallType !== 'all') {
      filtered = filtered.filter(wall =>
        wall.wall_type === selectedWallType ||
        wall.surface_type === selectedWallType
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(wall =>
        wall.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wall.location_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wall.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wall.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWalls(filtered);
  }, [walls, selectedWallType, searchQuery]);

  const handleMarkerClick = (index) => {
    const wall = filteredWalls[index];
    setSelectedMarker(index);
    setImage(wall.image_path ? getFileUrl(wall.image_path) : null);

    // Center map on selected marker
    setCameraProps(prev => ({
      ...prev,
      center: {
        lat: Number(wall.latitude),
        lng: Number(wall.longitude)
      },
      zoom: Math.max(prev.zoom, 15)
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
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
  };

  // const handleDirections = async (destination) => {
  //   if (!userLocation) {
  //     alert("Please allow location access to get directions.");
  //     return;
  //   }
   
  //   // Ensure latitude and longitude are numbers
  //   const finalDestination = {
  //     lat: parseFloat(destination.latitude),
  //     lng: parseFloat(destination.longitude)
  //   };
  // console.log(finalDestination);
  //   const service = new google.maps.DirectionsService();

  //   service.route(
  //     {
  //       origin: userLocation,
  //       destination: finalDestination,  // Properly structured destination object
  //       travelMode: google.maps.TravelMode.DRIVING,
  //     },
  //     (result, status) => {
  //       console.log(result);
  //       if (status === google.maps.DirectionsStatus.OK) {
  //         setDirections(result);
  //       } else {
  //         // console.error(`Error fetching directions ${result}`);
  //         console.error(`Error fetching directions: ${status}`, result);
  //       }
  //     }
  //   );
  // };
  

  const handleDirections = (destination) => {
    if (!userLocation) {
      // Show a more user-friendly notification
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



  if (mapError) {
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
          {/* Map Container */}
          <div className="relative w-full h-screen">

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-indigo-600 flex items-center justify-center z-50">
                <div className="text-center text-white">
                  <FontAwesomeIcon icon={faSpinner} spin className="text-6xl mb-4" />
                  <p className="text-xl">Loading map and walls...</p>
                </div>
              </div>
            )}

            {/* Top Controls Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center space-y-4">
              {/* Search Bar */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-600 z-10"
                  />
                  <input
                    type="text"
                    placeholder="Search walls by name, location, or city..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-80 h-12 pl-12 pr-4 rounded-full border-2 border-white/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
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
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80">
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
                        setSearchQuery('');
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
                <FontAwesomeIcon icon={faMapMarkerAlt} />
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
              </div>
            </div>

            {/* Map Component */}
            <Map {...cameraProps} onCameraChanged={(ev) => setCameraProps(ev.detail)}>

              {/* User Location Marker - You are here */}
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



              {/* Enhanced InfoWindow */}
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
                    {/* Header */}
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

                    {/* Image */}
                    {image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={image}
                          alt="Wall"
                        />
                      </div>
                    )}

                    {/* Content */}
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

                      {/* Actions */}
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

              {/* Directions Renderer */}
              {directions && (
                <DirectionsRenderer
                  key={`directions_${Date.now()}`}
                  directions={directions}
                />
              )}

            </Map>
          </div>
        </APIProvider>

      {/* Footer - only show when not in fullscreen */}
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