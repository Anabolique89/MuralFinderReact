import React, { useState, useEffect } from 'react';
import styles from '../../style';
import { defaultimg } from '../../assets';
import AuthService from '../../services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import BlogService from '../../services/BlogService';
import { formatDate } from '../../utils/dateUtils';
import { Footer, ArtworksGallery, BackToTopButton } from '../../components';
import { useParams } from 'react-router-dom';
import FellowshipService from '../../services/FellowshipService';
import ArtworkService from '../../services/ArtworkService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFileUrl } from '../../utils/apiConfig';
import { Link } from 'react-router-dom';

const PublicProfile = () => {
    const { userId } = useParams();

    const [profileData, setProfileData] = useState(null);
    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredImages, setFilteredImages] = useState([]);




    const handleFollow = async () => {
        setLoadingFollow(true);
        try {
            const message = await FellowshipService.follow(userId);
            toast.success(message);
            setIsFollowing(true);
        } catch (error) {
            toast.error('Error following user:', error);
        } finally {
            setLoadingFollow(false);
        }
    };

    const handleUnfollow = async () => {
        setLoadingFollow(true);
        try {
            const message = await FellowshipService.unfollow(userId);
            toast.success(message);
            setIsFollowing(false);
        } catch (error) {
            toast.error('Error unfollowing user:', error);
        } finally {
            setLoadingFollow(false);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const data = await AuthService.getProfile(userId);
                if (data.length > 1) {
                    setProfileData(data[0]);
                } else {
                    setProfileData(data);
                }
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
                setLoading(false);
            }
        };

        const fetchBlogsByUser = async () => {
            try {
                const data = await BlogService.getBlogPostByUserId(userId);
                console.log('Blog data:', data);
                setBlogData(data.data);
            } catch (error) {
                setError(error.message);
            }
        };

        const checkIsFollowing = async () => {
            try {
                const following = await FellowshipService.isFollowing(userId);
                setIsFollowing(following);
            } catch (error) {
                console.log('Error checking if user is following:', error);
            }
        };

        fetchProfileData();
        fetchBlogsByUser();
        setIsLoading(true);
        ArtworkService.getUserArtworks(userId)
            .then((artworksData) => {
                setFilteredImages(artworksData || []);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });

        checkIsFollowing();
    }, [userId]);




    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-200 text-4xl mr-2" style={{ fontSize: '2rem' }} />
                <span className="text-gray-200 text-xl">...</span>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>; // Render error message
    }

    return (
        <div className="min-h-screen bg-indigo-600">
            <ToastContainer />

            {/* Hero Section */}
            <div className="bg-indigo-600">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="text-center">
                                <FontAwesomeIcon icon={faSpinner} spin className="text-white text-6xl mb-4" />
                                <p className="text-white text-xl">Loading profile...</p>
                            </div>
                        </div>
                    ) : profileData ? (
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                            {/* Profile Image */}
                            <div className="flex-shrink-0">
                                <img
                                    src={(profileData && profileData?.profile)
                                        ? getFileUrl(profileData?.profile?.profile_image_url)
                                        : defaultimg}
                                    className="w-48 h-48 bg-gray-300 rounded-full object-cover border-4 border-white shadow-lg"
                                    alt="Profile"
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    {profileData?.profile?.first_name && profileData?.profile?.last_name
                                        ? `${profileData.profile.first_name} ${profileData.profile.last_name}`
                                        : profileData?.username || 'Unknown User'}
                                </h1>
                                <p className="text-xl text-white/80 mb-2">@{profileData?.username}</p>
                                {profileData?.profile?.proffession && (
                                    <p className="text-lg text-white/70 mb-4">{profileData.profile.proffession}</p>
                                )}
                                {profileData?.profile?.bio && (
                                    <p className="text-white/90 mb-6 max-w-2xl">{profileData.profile.bio}</p>
                                )}

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6 mb-6 justify-center lg:justify-start">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{profileData?.followers_count || 0}</div>
                                        <div className="text-white/70">Followers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{profileData?.followings_count || 0}</div>
                                        <div className="text-white/70">Following</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <button
                                        onClick={isFollowing ? handleUnfollow : handleFollow}
                                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                            isFollowing
                                                ? 'bg-white text-indigo-600 hover:bg-gray-100'
                                                : 'bg-white text-indigo-600 hover:bg-gray-100'
                                        }`}
                                        disabled={loadingFollow}
                                    >
                                        {loadingFollow ? (
                                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                        ) : null}
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-white">
                            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
                            <p>The profile you're looking for doesn't exist.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Blog Posts Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-indigo-700/30 backdrop-blur-sm rounded-lg border border-indigo-500/20 p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Recent Posts</h2>
                            {!blogData ? (
                                <div className="flex justify-center py-8">
                                    <FontAwesomeIcon icon={faSpinner} spin className="text-white/70 text-2xl" />
                                </div>
                            ) : blogData.length > 0 ? (
                                <div className="space-y-4">
                                    {blogData.slice(0, 3).map(blog => (
                                        <Link key={blog.id} to={`/blog/${blog.id}`} className="block group">
                                            <div className="flex gap-3 p-3 rounded-lg hover:bg-indigo-600/30 transition-colors">
                                                <img
                                                    src={blog.feature_image ? getFileUrl(blog.feature_image) : defaultimg}
                                                    alt={blog.title}
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-white group-hover:text-white/90 line-clamp-2 text-sm">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-white/70 text-xs mt-1">
                                                        {blog.created_at ? formatDate(blog.created_at) : 'Recently'}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/70 text-center py-8">No posts yet</p>
                            )}
                        </div>
                    </div>
                    {/* Artworks Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-indigo-700/30 backdrop-blur-sm rounded-lg border border-indigo-500/20 p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Artworks</h2>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <FontAwesomeIcon icon={faSpinner} spin className="text-white/70 text-2xl" />
                                </div>
                            ) : filteredImages && filteredImages.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredImages.map(artwork => (
                                        <ArtworksGallery key={artwork.id} artwork={artwork} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/70 text-center py-8">No artworks yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BackToTopButton />
            {/* <WallsHero />
            <DisplayWalls /> */}
            <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
                <Footer />
            </div>
        </div>


    )
}

export default PublicProfile