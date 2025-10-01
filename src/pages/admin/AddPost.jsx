import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faSpinner, faImage, faTag } from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import { useCreatePostMutation } from '../../store/api/muralFinderApi';
import { toast } from 'react-toastify';

const AddPost = () => {
  const navigate = useNavigate();
  const [createPost, { isLoading }] = useCreatePostMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: null,
    type: 'article',
    tags: '',
    category_id: null,
    is_published: true,
    allow_comments: true,
    is_featured: false
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        featured_image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('content', formData.content);
      postData.append('excerpt', formData.excerpt);
      postData.append('type', formData.type);
      postData.append('is_published', formData.is_published ? '1' : '0');
      postData.append('allow_comments', formData.allow_comments ? '1' : '0');
      postData.append('is_featured', formData.is_featured ? '1' : '0');

      if (formData.category_id) {
        postData.append('category_id', formData.category_id);
      }

      if (formData.tags) {
        // Convert comma-separated tags to array
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        postData.append('tags', JSON.stringify(tagsArray));
      }

      if (formData.featured_image) {
        postData.append('featured_image', formData.featured_image);
      }

      await createPost(postData).unwrap();
      toast.success('Post created successfully!');
      navigate('/admin/posts');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create post');
      if (error.data?.errors) {
        setErrors(error.data.errors);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-400 rounded-full blur-xl animate-ping"></div>
        </div>

        <div className="relative z-10 p-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-raleway mb-2">
              Create New Post
            </h1>
            <p className="text-gray-600 font-raleway text-lg">Share your thoughts with the community</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="space-y-8">
              {/* Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faNewspaper} className="text-white text-sm" />
                  </div>
                  Post Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                    errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  placeholder="Enter an engaging title for your post..."
                />
                {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.title}
                </p>}
              </div>

              {/* Excerpt */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3">
                  📝 Post Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300 resize-none"
                  placeholder="Write a brief summary that will appear in post previews..."
                />
                <p className="text-xs text-gray-500 mt-2">This will be shown in post previews and search results</p>
              </div>

              {/* Content */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3">
                  ✍️ Post Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none ${
                    errors.content ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  placeholder="Write your post content here... Share your thoughts, ideas, and insights with the community."
                />
                {errors.content && <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.content}
                </p>}
              </div>

              {/* Featured Image */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faImage} className="text-white text-sm" />
                  </div>
                  Featured Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-400 transition-colors duration-300 bg-gray-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                  />
                  <p className="text-sm text-gray-500 mt-2">Upload an image to make your post more engaging</p>
                </div>
                {imagePreview && (
                  <div className="mt-4 p-4 bg-white/50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Type (Required) */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">📝</span>
                    </div>
                    Post Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                      errors.type ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <option value="article">📰 Article</option>
                    <option value="discussion">💬 Discussion</option>
                    <option value="question">❓ Question</option>
                    <option value="showcase">🎨 Showcase</option>
                    <option value="event">📅 Event</option>
                    <option value="news">📢 News</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                    {errors.type}
                  </p>}
                </div>

                {/* Category ID (Optional) */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">🏷️</span>
                    </div>
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                  >
                    <option value="">No Category</option>
                    <option value="1">🎨 Art & Design</option>
                    <option value="2">🏙️ Street Art</option>
                    <option value="3">👥 Community</option>
                    <option value="4">📅 Events</option>
                    <option value="5">📰 News</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Published Status */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">📢</span>
                    </div>
                    Publication Status
                  </label>
                  <select
                    name="is_published"
                    value={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.value === 'true' }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                  >
                    <option value={true}>✅ Published</option>
                    <option value={false}>📝 Draft</option>
                  </select>
                </div>

                {/* Allow Comments */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">💬</span>
                    </div>
                    Allow Comments
                  </label>
                  <select
                    name="allow_comments"
                    value={formData.allow_comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, allow_comments: e.target.value === 'true' }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                  >
                    <option value={true}>✅ Yes</option>
                    <option value={false}>❌ No</option>
                  </select>
                </div>

                {/* Featured */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">⭐</span>
                    </div>
                    Featured Post
                  </label>
                  <select
                    name="is_featured"
                    value={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.value === 'true' }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                  >
                    <option value={false}>❌ No</option>
                    <option value={true}>⭐ Yes</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 font-raleway mb-3 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faTag} className="text-white text-sm" />
                  </div>
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-indigo-300"
                  placeholder="art, design, community, inspiration..."
                />
                <p className="text-xs text-gray-500 mt-2">Separate tags with commas to help people discover your post</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/posts')}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-raleway font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <span>❌</span>
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-raleway font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="text-lg" />
                    <span>Creating Post...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Create Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};
export default AddPost;
