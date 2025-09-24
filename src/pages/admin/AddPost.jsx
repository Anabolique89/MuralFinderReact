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
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Add New Post</h1>
          <p className="text-gray-600 font-raleway mt-1">Create a new blog post or article</p>
        </div>

        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter post title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description of the post"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={10}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Write your post content here..."
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type (Required) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="article">Article</option>
                    <option value="discussion">Discussion</option>
                    <option value="question">Question</option>
                    <option value="showcase">Showcase</option>
                    <option value="event">Event</option>
                    <option value="news">News</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                {/* Category ID (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">No Category</option>
                    <option value="1">Art & Design</option>
                    <option value="2">Street Art</option>
                    <option value="3">Community</option>
                    <option value="4">Events</option>
                    <option value="5">News</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Published Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                    Publication Status
                  </label>
                  <select
                    name="is_published"
                    value={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={true}>Published</option>
                    <option value={false}>Draft</option>
                  </select>
                </div>

                {/* Allow Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                    Allow Comments
                  </label>
                  <select
                    name="allow_comments"
                    value={formData.allow_comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, allow_comments: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                {/* Featured */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                    Featured Post
                  </label>
                  <select
                    name="is_featured"
                    value={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-raleway mb-2">
                  <FontAwesomeIcon icon={faTag} className="mr-2" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/posts')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-raleway"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-raleway flex items-center space-x-2"
              >
                {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
                <span>{isLoading ? 'Creating...' : 'Create Post'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddPost;
