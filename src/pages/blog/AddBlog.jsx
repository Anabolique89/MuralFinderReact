import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faCloudUploadAlt,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { useCreatePostMutation } from '../../store/api/muralFinderApi';
import AuthService from '../../services/AuthService';
import { Footer, BackToTopButton } from '../../components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../style';

const AddBlog = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [tags, setTags] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [type, setType] = useState('article');
    const [isPublished, setIsPublished] = useState(true);
    const [allowComments, setAllowComments] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const navigate = useNavigate();

    // RTK Query hook
    const [createPost, { isLoading }] = useCreatePostMutation();

    // Check authentication on component mount
    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            toast.error('🔒 Please log in to create a blog post', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            navigate('/login', { replace: true });
        }
    }, [navigate]);


    // Drag and drop handlers
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles[0]) {
            const file = acceptedFiles[0];
            setFeaturedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
        setIsDragActive(false);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop, 
        accept: 'image/*',
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false)
    });

    const deleteImage = () => {
        setFeaturedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('📝 Please enter a blog title', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        if (!description.trim()) {
            toast.error('📄 Please enter blog content', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('content', description);
            formData.append('type', type); // Use selected type
            formData.append('is_published', isPublished ? '1' : '0'); // Use selected status
            formData.append('allow_comments', allowComments ? '1' : '0'); // Use selected setting
            formData.append('is_featured', isFeatured ? '1' : '0'); // Use selected setting
            if (excerpt.trim()) formData.append('excerpt', excerpt.trim());
            
            // EXACT same tags handling as admin form - send as individual fields
            if (tags.trim()) {
                // Convert comma-separated tags to array - send as individual fields
                const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                tagsArray.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            }
            
            if (categoryId) formData.append('category_id', categoryId);
            if (featuredImage) {
                formData.append('featured_image', featuredImage);
            }

            await createPost(formData).unwrap();

            toast.success('🎉 Blog post created successfully! Redirecting to community...', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Reset form
            setTitle('');
            setDescription('');
            setExcerpt('');
            setTags('');
            setCategoryId('');
            setType('article');
            setIsPublished(true);
            setAllowComments(true);
            setIsFeatured(false);
            setFeaturedImage(null);
            setImagePreview(null);

            // Navigate back to community page to see the new post
            setTimeout(() => {
                navigate('/Community');
            }, 2000);

        } catch (error) {
            toast.error(error.data?.message || 'Failed to create post');
            if (error.data?.errors) {
                // Handle field-specific errors if needed
                console.error('Field errors:', error.data.errors);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header - Add top padding to account for fixed nav */}
            <div className="bg-indigo-600 py-12 pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-raleway font-bold text-white mb-3">
                            Create Blog Post
                        </h1>
                        <p className="text-indigo-100 text-xl">
                            Share your thoughts and ideas with the community
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Container - Full Width */}
            <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Single Column Layout - Much Bigger */}
                    <div className="px-8 py-12">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-raleway font-bold mb-4 text-gray-900">
                                Blog Details
                            </h2>
                            <p className="text-gray-600 font-raleway text-lg">
                                Tell your story to the world
                            </p>
                        </div>

                        {/* Form - Much Bigger */}
                        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                            {/* Image Upload Section */}
                            <div className="bg-gray-50 rounded-xl p-8">
                                <h3 className="text-2xl font-raleway font-bold text-gray-900 mb-6 text-center">
                                    Featured Image
                                </h3>
                                
                                <div
                                    {...getRootProps()}
                                    className={`w-full p-12 transition-all duration-300 border-2 border-dashed rounded-xl cursor-pointer ${
                                        isDragActive
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50'
                                    } focus:outline-none group`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="text-center">
                                        <FontAwesomeIcon
                                            icon={faCloudUploadAlt}
                                            className="mx-auto h-16 w-16 text-indigo-400 group-hover:text-indigo-600 transition-colors mb-6"
                                        />
                                        <p className="text-xl font-medium text-gray-900 mb-2">
                                            {isDragActive ? 'Drop the image here' : 'Click to upload or drag & drop'}
                                        </p>
                                        <p className="text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-8 relative max-w-2xl mx-auto">
                                        <img
                                            src={imagePreview}
                                            alt="Blog preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={deleteImage}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg hover:bg-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Title Field */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-3">
                                    Blog Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your blog title..."
                                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Excerpt Field */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-3">
                                    Excerpt (Optional)
                                </label>
                                <textarea
                                    placeholder="Write a short summary of your blog post..."
                                    rows="3"
                                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                />
                            </div>

                            {/* Category and Tags Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        Category (Optional)
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    >
                                        <option value="">No Category</option>
                                        <option value="1">🎨 Art & Design</option>
                                        <option value="2">🏙️ Street Art</option>
                                        <option value="3">👥 Community</option>
                                        <option value="4">📅 Events</option>
                                        <option value="5">📰 News</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        Tags (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., react, javascript, tutorial... (separate with commas)"
                                        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Separate multiple tags with commas (e.g., &quot;art, design, community&quot;)
                                    </p>
                                </div>
                            </div>

                            {/* Post Type and Settings Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        Post Type *
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                    >
                                        <option value="article">📰 Article</option>
                                        <option value="discussion">💬 Discussion</option>
                                        <option value="question">❓ Question</option>
                                        <option value="showcase">🎨 Showcase</option>
                                        <option value="event">📅 Event</option>
                                        <option value="news">📢 News</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        Publication Status
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={isPublished}
                                        onChange={(e) => setIsPublished(e.target.value === 'true')}
                                    >
                                        <option value={true}>✅ Published</option>
                                        <option value={false}>📝 Draft</option>
                                    </select>
                                </div>
                            </div>

                            {/* Additional Settings Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        Allow Comments
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={allowComments}
                                        onChange={(e) => setAllowComments(e.target.value === 'true')}
                                    >
                                        <option value={true}>✅ Yes</option>
                                        <option value={false}>❌ No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                        Featured Post
                                    </label>
                                    <select
                                        className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.value === 'true')}
                                    >
                                        <option value={false}>❌ No</option>
                                        <option value={true}>⭐ Yes</option>
                                    </select>
                                </div>
                            </div>

                            {/* Content Field - Much Bigger */}
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-3">
                                    Content *
                                </label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={setDescription}
                                        placeholder="Write your blog content here..."
                                        className="min-h-[400px] text-lg"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                [{ 'script': 'sub'}, { 'script': 'super' }],
                                                [{ 'indent': '-1'}, { 'indent': '+1' }],
                                                [{ 'direction': 'rtl' }],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'align': [] }],
                                                ['link', 'image', 'video'],
                                                ['blockquote', 'code-block'],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin className="mr-3" />
                                                Creating Post...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faEdit} className="mr-3" />
                                                Create Blog Post
                                            </>
                                        )}
                                    </button>
                            </div>
                        </form>
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

export default AddBlog;