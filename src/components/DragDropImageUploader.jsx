import React, { useState, useRef, useEffect } from 'react';
import AuthService from '@services/AuthService';
import ArtworkService from '@services/ArtworkService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';  // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS
import styles from '@styles';
import { useNavigate, Link } from 'react-router-dom';

const DragDropImageUploader = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [technique, setTechnique] = useState('');
  const [tags, setTags] = useState('');
  const [locationText, setLocationText] = useState('');
  const [isCommissioned, setIsCommissioned] = useState(false);
  const [commissioner, setCommissioner] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const isAuthenticated = AuthService.isAuthenticated();

  const navigate = useNavigate()

  function selectFiles() {
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    const files = event.target.files;

    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;
      setImages((prevImages) => [
        ...prevImages,
        {
          name: files[i].name,
          url: URL.createObjectURL(files[i]),
          file: files[i],
        },
      ]);
    }
  }

  useEffect(() => {
    setLoading(true);
    ArtworkService.loadCategories()
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }

  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = 'copy';
  }

  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;
      setImages((prevImages) => [
        ...prevImages,
        {
          name: files[i].name,
          url: URL.createObjectURL(files[i]),
          file: files[i],
        },
      ]);
    }
  }

  async function uploadImages() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category_id', category);
      formData.append('style', style);
      formData.append('technique', technique);
      formData.append('location_text', locationText);
      // Convert boolean to string for FormData
      formData.append('is_commissioned', isCommissioned ? '1' : '0');
      formData.append('commissioner', commissioner);
      formData.append('created_date', createdDate);

      // Handle tags - convert comma-separated string to array
      if (tags.trim()) {
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        tagsArray.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
      });

      const response = await ArtworkService.uploadArtwork(formData);
      setResponseMessage(response);
      if (response?.message.includes('successfully')) {
        toast.success('Artwork uploaded successfully!'); // Show success toast
        setImages([]);
        setTitle('');
        setDescription('');
        setCategory('');
        setStyle('');
        setTechnique('');
        setTags('');
        setLocationText('');
        setIsCommissioned(false);
        setCommissioner('');
        setCreatedDate('');
        navigate(`/artworks/${response?.data?.id}`); // Redirect to My Artwork page
      } else {
        toast.error('Failed to upload artwork.');
      }

      setTimeout(() => {
        setResponseMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('An error occurred while uploading images');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-indigo-600 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-auto flex mx-auto rounded-lg overflow-hidden shadow-xl">
          {isAuthenticated ? (
            <>
              {/* Left Side - Upload Area with Indigo Background */}
              <div className="hidden lg:block relative w-0 flex-1 bg-indigo-600 min-h-[700px] p-8">
                <div className="h-full flex flex-col items-center justify-center">
                  {/* Upload Header */}
                  <div className="text-center mb-8 animate-slide-in-left">
                    <h2 className="text-3xl font-raleway font-bold mb-4 text-white">
                      Share Your Art
                    </h2>
                    <p className="text-lg font-raleway text-dimWhite opacity-90 mb-6">
                      Upload your artwork and inspire the community
                    </p>
                    <div className="flex items-center justify-center space-x-2 mb-8">
                      <div className="w-12 h-0.5 bg-blue-gradient rounded-full"></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                      <div className="w-8 h-0.5 bg-blue-gradient rounded-full"></div>
                    </div>
                  </div>

                  {/* Drag & Drop Area */}
                  <div
                    className="w-full max-w-md p-8 transition-all duration-300 border-2 border-white/30 border-dashed rounded-xl cursor-pointer hover:border-white/60 hover:bg-white/5 focus:outline-none group"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={selectFiles}
                  >
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-white/70 group-hover:text-white transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-4 text-lg font-raleway text-white">
                        Click or drag & drop
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="mt-6 w-full max-w-md">
                      <div className="grid grid-cols-2 gap-2">
                        {images.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => deleteImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      {images.length > 4 && (
                        <p className="text-center text-white/70 text-sm mt-2">
                          +{images.length - 4} more images
                        </p>
                      )}
                    </div>
                  )}

                  {/* Floating Elements */}
                  <div className="absolute top-20 left-20 w-4 h-4 bg-secondary/20 rounded-full animate-pulse"></div>
                  <div className="absolute top-40 right-20 w-2 h-2 bg-secondary/40 rounded-full animate-ping"></div>
                  <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-secondary/30 rounded-full animate-bounce"></div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onFileSelect}
                  className="hidden"
                />
              </div>

              {/* Right Side - Form */}
              <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white min-h-[700px]">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                  {/* Mobile Upload Area (visible only on small screens) */}
                  <div className="lg:hidden mb-8">
                    <div
                      className="w-full p-6 transition-all duration-300 border-2 border-indigo-300 border-dashed rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none group"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      onClick={selectFiles}
                    >
                      <div className="text-center">
                        <svg className="mx-auto h-8 w-8 text-indigo-400 group-hover:text-indigo-600 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          Click to upload images
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Mobile Image Preview */}
                    {images.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-3 gap-2">
                          {images.slice(0, 6).map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-16 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => deleteImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        {images.length > 6 && (
                          <p className="text-center text-gray-500 text-xs mt-2">
                            +{images.length - 6} more images
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Header */}
                  <div className="text-center mb-8 animate-slide-in-up">
                    <h2 className="text-3xl font-raleway font-bold mb-2 text-gray-900">
                      Artwork Details
                    </h2>
                    <p className="text-gray-600 font-raleway">
                      Tell us about your masterpiece
                    </p>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    {/* Title Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Artwork Title *
                      </label>
                      <div className="relative">
                        <input
                          name="title"
                          type="text"
                          placeholder="Enter artwork title..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        placeholder="Describe your artwork..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    {/* Category Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {Array.isArray(categories) && categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Style and Technique Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Style
                        </label>
                        <select
                          name="style"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                        >
                          <option value="">Select a style...</option>
                          <option value="graffiti">Graffiti</option>
                          <option value="mural">Mural</option>
                          <option value="stencil">Stencil</option>
                          <option value="mosaic">Mosaic</option>
                          <option value="sculpture">Sculpture</option>
                          <option value="installation">Installation</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Technique
                        </label>
                        <select
                          name="technique"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          value={technique}
                          onChange={(e) => setTechnique(e.target.value)}
                        >
                          <option value="">Select a technique...</option>
                          <option value="spray_paint">Spray Paint</option>
                          <option value="brush">Brush</option>
                          <option value="marker">Marker</option>
                          <option value="stencil">Stencil</option>
                          <option value="digital">Digital</option>
                          <option value="mixed_media">Mixed Media</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Tags Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        name="tags"
                        type="text"
                        placeholder="urban, colorful, abstract (comma separated)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>

                    {/* Location Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        name="location_text"
                        type="text"
                        placeholder="e.g., Downtown, Main Street..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={locationText}
                        onChange={(e) => setLocationText(e.target.value)}
                      />
                    </div>

                    {/* Created Date Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Created Date
                      </label>
                      <input
                        name="created_date"
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={createdDate}
                        onChange={(e) => setCreatedDate(e.target.value)}
                      />
                    </div>

                    {/* Commission Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isCommissioned"
                        checked={isCommissioned}
                        onChange={(e) => setIsCommissioned(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isCommissioned" className="ml-2 block text-sm text-gray-700">
                        This is a commissioned artwork
                      </label>
                    </div>

                    {/* Commissioner Field (conditional) */}
                    {isCommissioned && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commissioner
                        </label>
                        <input
                          name="commissioner"
                          type="text"
                          placeholder="Commissioner name..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          value={commissioner}
                          onChange={(e) => setCommissioner(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={uploadImages}
                      disabled={loading || images.length === 0 || !title}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                          Uploading...
                        </>
                      ) : (
                        'Upload Artwork'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Not Authenticated View */
            <div className="w-full flex items-center justify-center min-h-[500px] bg-white rounded-lg">
              <div className="text-center p-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Login Required</h3>
                <p className="text-gray-600 mb-6">Please login to upload your artwork and share it with the community.</p>
                <Link
                  to="/Login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Login to Continue
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DragDropImageUploader;
