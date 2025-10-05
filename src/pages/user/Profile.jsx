import { useState, useEffect, useRef } from 'react';
import styles from '@styles';
import { defaultimg } from '@assets';
import AuthService from '@services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import { DragDropImageUploader, ArtworksGallery, WallsIntro, BackToTopButton } from '../../components';
import ArtworkService from '../../services/ArtworkService';
import { toast } from 'react-toastify';
import { getFileUrl } from '../../utils/apiConfig';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [userArtworks, setUserArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [artworksLoading, setArtworksLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Track if we're currently interacting with upload component
    const isUploadingRef = useRef(false);
    const lastFetchTimeRef = useRef(0);

    // Fetch profile data
    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const data = await AuthService.getProfile();
            console.log('Profile data fetched:', data);
            setProfileData(data);
            
            // Update localStorage to keep data in sync
            localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user artworks with callback option
    const fetchUserArtworks = async (silent = false) => {
        try {
            if (!silent) {
                setArtworksLoading(true);
            }
            const user = AuthService.getUser();
            
            if (user?.username) {
                const artworksData = await ArtworkService.getUserArtworks(user.username);
                setUserArtworks(artworksData || []);
            }
        } catch (error) {
            console.error('Error fetching user artworks:', error);
            setUserArtworks([]);
        } finally {
            if (!silent) {
                setArtworksLoading(false);
            }
        }
    };

    // Initial load
    useEffect(() => {
        fetchProfileData();
        fetchUserArtworks();
    }, []);

    // Improved focus handler with debouncing and upload check
    useEffect(() => {
        const handleFocus = () => {
            // Check sessionStorage flag first
            const uploadInProgress = sessionStorage.getItem('uploadInProgress');
            if (uploadInProgress === 'true') {
                console.log('Skipping refresh - upload in progress (sessionStorage)');
                return;
            }

            // Don't refresh if we're uploading (ref check as backup)
            if (isUploadingRef.current) {
                console.log('Skipping refresh - upload in progress (ref)');
                return;
            }

            // Debounce: only refresh if it's been more than 2 seconds since last fetch
            const now = Date.now();
            if (now - lastFetchTimeRef.current < 2000) {
                console.log('Skipping refresh - too soon');
                return;
            }

            console.log('Window focused - refreshing profile data');
            lastFetchTimeRef.current = now;
            fetchProfileData();
        };

        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Listen for successful artwork uploads to refresh the gallery
    useEffect(() => {
        const handleArtworkUploaded = () => {
            console.log('Artwork uploaded - refreshing artworks');
            // Refresh artworks silently (without showing loading spinner)
            fetchUserArtworks(true);
        };

        // Listen for custom event from DragDropImageUploader
        window.addEventListener('artworkUploaded', handleArtworkUploaded);
        
        return () => {
            window.removeEventListener('artworkUploaded', handleArtworkUploaded);
        };
    }, []);

    // Helper function to get profile image with proper fallback chain
    const getProfileImage = () => {
        if (profileData?.profile?.profile_image_url) {
            return getFileUrl(profileData.profile.profile_image_url);
        }
        if (profileData?.profile_image_url) {
            return getFileUrl(profileData.profile_image_url);
        }
        return defaultimg;
    };

    // Helper function to get profile field with proper fallback
    const getProfileField = (field) => {
        const value = profileData?.profile?.[field] || profileData?.[field] || '';
        return value;
    };

    // Helper function to check if social media links exist
    const hasSocialLinks = () => {
        return getProfileField('facebook') || getProfileField('instagram') || getProfileField('twitter');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-indigo-600 flex items-center justify-center pt-20">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl mb-4" />
                    <p className="text-white text-xl">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-indigo-600 flex items-center justify-center pt-20">
                <div className="text-center">
                    <p className="text-white text-xl mb-4">{error}</p>
                    <button
                        onClick={fetchProfileData}
                        className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-semibold transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-indigo-600 min-h-screen pt-20">
            {/* Profile Header */}
            <div className="max-w-7xl mx-auto py-8">
                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                    {/* Profile Sidebar */}
                    <div className="col-span-4 sm:col-span-3">
                        <div className="bg-white profile-content p-6 rounded-lg shadow-lg">
                            <div className="flex flex-col items-center">
                                {/* Profile Image */}
                                <img
                                    src={getProfileImage()}
                                    className="object-cover w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 profile-info-img ring-4 ring-indigo-200"
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultimg;
                                    }}
                                />
                                
                                {/* Username */}
                                <h1 className="text-xl font-bold username-name text-center">
                                    {profileData?.username || 'User'}
                                </h1>
                                
                                {/* Name */}
                                {(getProfileField('first_name') || getProfileField('last_name')) && (
                                    <p className={`${styles.paragraph} mt-1 text-center text-gray-600`}>
                                        {getProfileField('first_name')} {getProfileField('last_name')}
                                    </p>
                                )}
                                
                                {/* Profession */}
                                {getProfileField('proffession') && (
                                    <p className="text-sm text-gray-500 mt-1 text-center">
                                        {getProfileField('proffession')}
                                    </p>
                                )}
                                
                                {/* Bio */}
                                {getProfileField('bio') && (
                                    <p className={`${styles.paragraph} mt-3 text-center text-gray-700`}>
                                        {getProfileField('bio')}
                                    </p>
                                )}
                                
                                {/* Location */}
                                {getProfileField('location') && (
                                    <p className={`${styles.paragraph} mt-2 text-gray-600`}>
                                        📍 {getProfileField('location')}
                                    </p>
                                )}

                                {/* Social Media Links */}
                                {hasSocialLinks() && (
                                    <div className="mt-4 flex gap-4 justify-center">
                                        {getProfileField('facebook') && (
                                            <a
                                                href={getProfileField('facebook').startsWith('http') 
                                                    ? getProfileField('facebook') 
                                                    : `https://${getProfileField('facebook')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
                                            </a>
                                        )}
                                        {getProfileField('instagram') && (
                                            <a
                                                href={getProfileField('instagram').startsWith('http') 
                                                    ? getProfileField('instagram') 
                                                    : `https://${getProfileField('instagram')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-pink-600 hover:text-pink-700 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                                            </a>
                                        )}
                                        {getProfileField('twitter') && (
                                            <a
                                                href={getProfileField('twitter').startsWith('http') 
                                                    ? getProfileField('twitter') 
                                                    : `https://${getProfileField('twitter')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sky-500 hover:text-sky-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <hr className="my-6 border-t border-gray-300" />
                            
                            {/* Stats Section */}
                            <div className="flex flex-col">
                                <span className="text-purple-950 uppercase font-bold tracking-wider mb-3">
                                    Details
                                </span>
                                <ul className="space-y-2">
                                    <li className={`${styles.paragraph} flex justify-between items-center`}>
                                        <span>ARTWORKS</span>
                                        <span className='followers font-bold text-indigo-600'>
                                            {profileData?.artworks_count || userArtworks.length || 0}
                                        </span>
                                    </li>
                                    <li className={`${styles.paragraph} flex justify-between items-center`}>
                                        <span>FOLLOWERS</span>
                                        <span className='followers font-bold text-indigo-600'>
                                            {profileData?.followers_count || 0}
                                        </span>
                                    </li>
                                    <li className={`${styles.paragraph} flex justify-between items-center`}>
                                        <span>FOLLOWING</span>
                                        <span className='following font-bold text-indigo-600'>
                                            {profileData?.following_count || 0}
                                        </span>
                                    </li>
                                </ul>
                                
                                {/* Profile Settings Button */}
                                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                    <Link 
                                        to="/ProfileSettings" 
                                        className="py-2 px-6 bg-blue-gradient font-raleway font-bold text-[16px] sm:text-[14px] xs:text-[12px] text-white outline-none uppercase rounded-full hover:opacity-90 transition-all shadow-md"
                                    >
                                        PROFILE SETTINGS
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Artworks */}
                    <div className="col-span-4 sm:col-span-9">
                        <div className="bg-white p-6 profile-content z-[20] w-full rounded-lg shadow-lg">
                            <h2 className="text-purple-950 text-xl font-bold uppercase mt-2 mb-6 font-raleway">
                                MY ARTWORKS
                            </h2>

                            {artworksLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <FontAwesomeIcon icon={faSpinner} spin className="text-purple-950 text-2xl mr-3" />
                                    <span className="text-purple-950">Loading artworks...</span>
                                </div>
                            ) : userArtworks.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {userArtworks.map((artwork) => (
                                        <ArtworksGallery key={artwork.id} artwork={artwork} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faUser} className="text-purple-950 text-4xl mb-4 opacity-50" />
                                    <p className="text-purple-950 text-lg mb-2 font-semibold">No artworks yet</p>
                                    <p className={`${styles.paragraph} text-center text-gray-600`}>
                                        Start sharing your amazing artwork with the community!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-indigo-600 w-full overflow-hidden">
                <DragDropImageUploader 
                    onUploadStart={() => { isUploadingRef.current = true; }}
                    onUploadEnd={() => { 
                        isUploadingRef.current = false;
                        // Refresh artworks after successful upload
                        fetchUserArtworks(true);
                    }}
                />
            </div>

            {/* Walls Section */}
            <div className="max-w-7xl mx-auto">
                <WallsIntro />
            </div>

            {/* Back to Top */}
            <BackToTopButton />

            {/* Footer */}
            <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
                <div className="max-w-7xl mx-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Profile;