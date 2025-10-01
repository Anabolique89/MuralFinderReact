import React, { useState, useCallback } from 'react';
import { LoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudUploadAlt,
  faMapMarkerAlt,
  faSpinner,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import WallService from '../services/WallService';
import { Footer, BackToTopButton } from '../components';
import styles from '../style';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Google Maps API Key
const apiKey = import.meta.env.VITE_MAP_KEY;

const AddWall = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [city, setCity] = useState('');
  const [wallType, setWallType] = useState('');
  const [surfaceType, setSurfaceType] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [isLegal, setIsLegal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const navigate = useNavigate();



  const handleMapClick = (event) => {
    console.log('Map clicked:', event);

    // Standard Google Maps API event structure
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newLocation = { lat, lng };
      setLocation(newLocation);
      setMapCenter(newLocation);
      console.log('Location set:', newLocation);
      toast.success(`📍 Location selected!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      console.log('Could not extract coordinates from click event');
    }
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setLocation(newLocation);
        setMapCenter(newLocation);
        toast.success(`📍 Found: ${place.name || place.formatted_address}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
    setIsDragActive(false);
  }, []);

  useDropzone({ onDrop, accept: 'image/*' });

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const selectFiles = () => {
    document.querySelector('input[type="file"]').click();
  };

  const deleteImage = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error('🚫 Please enter a wall name', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!location) {
      toast.error('📍 Please select a location on the map', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading(true);

    // Show loading toast
    const loadingToast = toast.loading('🔄 Adding wall to database...', {
      position: "top-center",
    });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location_text', locationText);
    formData.append('city', city);
    formData.append('wall_type', wallType);
    formData.append('surface_type', surfaceType);
    formData.append('latitude', Number(location.lat));
    formData.append('longitude', Number(location.lng));
    formData.append('is_legal', isLegal ? 1 : 0);
    if (photo) {
      formData.append('image', photo);
    }

    try {
      const response = await WallService.addWall(formData);
      const wallId = response.data.id;

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('🎉 Wall added successfully! Redirecting...', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate(`/wall/${wallId}`);
      }, 2000);
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error('❌ Error adding wall. Please try again.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error adding wall:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="bg-indigo-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-raleway font-bold text-white mb-2">
              Add New Wall
            </h1>
            <p className="text-indigo-100 text-lg">
              Share a new wall location for street artists to discover
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Two-column layout matching Add Artwork design */}
          <div className="flex min-h-screen">

        {/* Left Side - Image Upload & Map (Indigo Background) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 lg:py-12 bg-indigo-600 relative overflow-hidden">
          <div className="relative z-10 w-full max-w-md mx-auto">

            {/* Upload Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-raleway font-bold text-white mb-4 text-center">
                Upload Wall Photo
              </h3>

              <div
                className={`w-full p-8 transition-all duration-300 border-2 border-dashed rounded-xl cursor-pointer ${
                  isDragActive
                    ? 'border-white bg-white/10'
                    : 'border-white/50 hover:border-white hover:bg-white/5'
                } focus:outline-none group`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={selectFiles}
              >
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className="mx-auto h-12 w-12 text-white/70 group-hover:text-white transition-colors mb-4"
                  />
                  <p className="text-lg font-medium text-white mb-2">
                    {isDragActive ? 'Drop the image here' : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-sm text-white/70">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {photoPreview && (
                <div className="mt-6 relative">
                  <img
                    src={photoPreview}
                    alt="Wall preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={deleteImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-white/20"></div>

            {/* Map Section */}
            <div>
              <h3 className="text-2xl font-raleway font-bold text-white mb-4 text-center">
                Select Location
              </h3>

              <div className="h-80 rounded-lg overflow-hidden border-2 border-white/20 relative">
                <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
                  {/* Google Places Autocomplete */}
                  <Autocomplete
                    onLoad={setAutocomplete}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <div className="absolute top-4 left-4 right-4 z-10">
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600 z-10"
                        />
                        <input
                          type="text"
                          placeholder="Search for a place..."
                          className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-white/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-lg"
                        />
                      </div>
                    </div>
                  </Autocomplete>

                  <GoogleMap
                    center={mapCenter}
                    zoom={12}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    onClick={handleMapClick}
                    options={{
                      zoomControl: true,
                      mapTypeControl: false,
                      streetViewControl: false,
                      fullscreenControl: false,
                      gestureHandling: 'greedy',
                      styles: [
                        {
                          featureType: 'road',
                          elementType: 'geometry',
                          stylers: [{ color: '#6366f1' }, { weight: 1 }],
                        },
                        {
                          featureType: 'water',
                          elementType: 'geometry',
                          stylers: [{ color: '#3730a3' }],
                        },
                        {
                          featureType: 'landscape',
                          elementType: 'geometry',
                          stylers: [{ color: '#f1f5f9' }],
                        },
                      ],
                    }}
                  >
                    {location && (
                      <Marker
                        position={location}
                        icon={{
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="16" cy="16" r="14" fill="#ef4444" stroke="#ffffff" stroke-width="3"/>
                              <text x="16" y="22" text-anchor="middle" fill="white" font-size="16" font-weight="bold">📍</text>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(32, 32),
                        }}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>

                {/* Map Instructions Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
                  <p>🖱️ Click to select location • 🔍 Search above • 🗺️ Drag to move around</p>
                </div>
              </div>

              {location && (
                <div className="mt-2 text-center text-white/90 text-sm">
                  📍 Selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              )}
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                const file = e.target.files[0];
                setPhoto(file);
                setPhotoPreview(URL.createObjectURL(file));
              }
            }}
            className="hidden"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white min-h-[700px]">
          <div className="mx-auto w-full max-w-sm lg:w-96">

            {/* Mobile Upload Area (visible only on small screens) */}
            <div className="lg:hidden mb-8">
              <div
                className={`w-full p-6 transition-all duration-300 border-2 border-dashed rounded-xl cursor-pointer ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50'
                } focus:outline-none group`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={selectFiles}
              >
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className="mx-auto h-8 w-8 text-indigo-400 group-hover:text-indigo-600 transition-colors"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Click to upload wall photo
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {/* Mobile Image Preview */}
              {photoPreview && (
                <div className="mt-4 relative">
                  <img
                    src={photoPreview}
                    alt="Wall preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={deleteImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Map Section (visible only on small screens) */}
            <div className="lg:hidden mb-8">
              <h3 className="text-xl font-raleway font-bold text-gray-900 mb-4 text-center">
                Select Location
              </h3>

              <div className="h-64 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
                  {/* Mobile Google Places Autocomplete */}
                  <Autocomplete
                    onLoad={setAutocomplete}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <div className="absolute top-2 left-2 right-2 z-10">
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600 z-10"
                        />
                        <input
                          type="text"
                          placeholder="Search for a place..."
                          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border-2 border-white/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-lg"
                        />
                      </div>
                    </div>
                  </Autocomplete>

                  <GoogleMap
                    center={mapCenter}
                    zoom={12}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    onClick={handleMapClick}
                    options={{
                      zoomControl: true,
                      mapTypeControl: false,
                      streetViewControl: false,
                      fullscreenControl: false,
                      gestureHandling: 'greedy',
                      styles: [
                        {
                          featureType: 'road',
                          elementType: 'geometry',
                          stylers: [{ color: '#6366f1' }, { weight: 1 }],
                        },
                        {
                          featureType: 'water',
                          elementType: 'geometry',
                          stylers: [{ color: '#3730a3' }],
                        },
                        {
                          featureType: 'landscape',
                          elementType: 'geometry',
                          stylers: [{ color: '#f1f5f9' }],
                        },
                      ],
                    }}
                  >
                    {location && (
                      <Marker
                        position={location}
                        icon={{
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
                              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">📍</text>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(24, 24),
                        }}
                      />
                    )}
                  </GoogleMap>
                </LoadScript>

                {/* Mobile Map Instructions */}
                <div className="absolute bottom-1 left-1 right-1 bg-black/50 backdrop-blur-sm rounded p-1 text-white text-xs text-center">
                  🖱️ Tap to select • 🔍 Search above
                </div>
              </div>

              {location && (
                <div className="mt-2 text-center text-gray-600 text-sm">
                  📍 Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              )}
            </div>

            {/* Header */}
            <div className="text-center mb-8 animate-slide-in-up">
              <h2 className="text-3xl font-raleway font-bold mb-2 text-gray-900">
                Wall Details
              </h2>
              <p className="text-gray-600 font-raleway">
                Tell us about this wall location
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Wall Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wall Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter wall name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe this wall location..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Location Text and City Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Downtown, Main Street..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., New York, London..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              {/* Wall Type and Surface Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wall Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={wallType}
                    onChange={(e) => setWallType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="building">Building</option>
                    <option value="fence">Fence</option>
                    <option value="bridge">Bridge</option>
                    <option value="tunnel">Tunnel</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={surfaceType}
                    onChange={(e) => setSurfaceType(e.target.value)}
                  >
                    <option value="">Select Surface</option>
                    <option value="brick">Brick</option>
                    <option value="concrete">Concrete</option>
                    <option value="metal">Metal</option>
                    <option value="wood">Wood</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Legal Wall Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isLegal"
                  checked={isLegal}
                  onChange={(e) => setIsLegal(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isLegal" className="ml-2 block text-sm text-gray-700">
                  This is a legal wall (permission granted for street art)
                </label>
              </div>

              {/* Location Status */}
              {location && (
                <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Location selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              )}

              {!location && (
                <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Please select a location on the map (desktop) or enter coordinates
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Adding Wall...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    Add Wall
                  </>
                )}
              </button>
            </form>
          </div>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <BackToTopButton />
      <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
        <Footer />
      </div>

    </div>
  );
};

export default AddWall;
