import { useState, useEffect } from 'react';
import styles from '@styles';
import { defaultimg, swimBlue } from '@assets';
import AuthService from '@services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEdit, faUser } from '@fortawesome/free-solid-svg-icons';
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

    // Get current user from localStorage
    const currentUser = AuthService.getUser();

    useEffect(() => {
        fetchProfileData();
        fetchUserArtworks();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const data = await AuthService.getProfile();
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserArtworks = async () => {
        try {
            setArtworksLoading(true);
            if (currentUser?.username) {
                const artworksData = await ArtworkService.getUserArtworks(currentUser.username);
                setUserArtworks(artworksData || []);
            }
        } catch (error) {
            console.error('Error fetching user artworks:', error);
            setUserArtworks([]);
        } finally {
            setArtworksLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-indigo-600 flex items-center justify-center">
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl mb-4" />
                    <p className="text-white text-xl">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-indigo-600 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Helper function to get profile image
    const getProfileImage = () => {
        if (profileData?.profile_image_url) {
            return getFileUrl(profileData.profile_image_url);
        }
        if (currentUser?.profile?.profile_image_url) {
            return getFileUrl(currentUser.profile.profile_image_url);
        }
        return defaultimg;
    };

    return (
        <div className="bg-indigo-600 min-h-screen pt-20">
            {/* Profile Header */}
            <div className="max-w-7xl mx-auto py-8">
                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                    {/* Profile Sidebar */}
                    <div className="col-span-4 sm:col-span-3">
                        <div className="bg-white profile-content p-6 rounded-lg">
                            <div className="flex flex-col items-center object-cover">
                                <img
                                    src={getProfileImage()}
                                    className="object-cover w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 profile-info-img"
                                    alt="Bordered avatar"
                                />
                                <h1 className="text-xl username-name">{currentUser?.username || 'User'}</h1>
                                {profileData && (
                                    <>
                                        <p className={`${styles.paragraph} mt-0 text-center`}>
                                            {profileData.first_name} {profileData.last_name}
                                        </p>
                                        {profileData.bio && (
                                            <p className={`${styles.paragraph} mt-0 text-center`}>
                                                {profileData.bio}
                                            </p>
                                        )}
                                        {profileData.location && (
                                            <p className={`${styles.paragraph} mt-0`}>
                                                📍 {profileData.location}
                                            </p>
                                        )}
                                    </>
                                )}
                                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                    {/* Profile action buttons can go here */}
                                </div>
                            </div>
                            <hr className="my-6 border-t border-gray-300"></hr>
                            <div className="flex flex-col">
                                <span className="text-white uppercase font-bold tracking-wider mb-2">Details</span>
                                <ul>
                                    <li className={`${styles.paragraph} mt-2 mb-2`}>ARTWORKS <span className='followers'>{profileData?.artworks_count || userArtworks.length || 0}</span></li>
                                    <li className={`${styles.paragraph} mb-2`}>FOLLOWERS <span className='followers'>{profileData?.followers_count || 0}</span></li>
                                    <li className={`${styles.paragraph} mb-2`}>FOLLOWING <span className='following'>{profileData?.following_count || 0}</span></li>
                                </ul>
                                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                    <Link to="/ProfileSettings" className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] sm:text-[14px] xs:text-[12px] text-primary outline-none uppercase rounded-full ${styles}`}>PROFILE SETTINGS</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-4 sm:col-span-9">
                        <div className="bg-white p-6 profile-content z-[20] w-full">
                            <h2 className="text-purple-950 text-xl font-bold uppercase mt-6 mb-4 font-raleway">MY ARTWORKS</h2>

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
                                    <FontAwesomeIcon icon={faUser} className="text-purple-950 text-4xl mb-4" />
                                    <p className="text-purple-950 text-lg mb-4">No artworks yet</p>
                                    <p className={`${styles.paragraph} text-center`}>Start sharing your amazing artwork with the community!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-indigo-600 w-full overflow-hidden">
                <DragDropImageUploader />
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

export default Profile