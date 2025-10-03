import { useState, useEffect } from 'react';
import styles from '../../style';
import AuthService from '../../services/AuthService';
import ProfileImageUpload from '../../components/ProfileUpload';
import ProfileUpdate from './ProfileUpdate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../components/Footer';
import { BackToTopButton } from '../../components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch profile data
    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            const user = AuthService.getUser();
            
            if (!user?.id) {
                toast.error('User not authenticated');
                return;
            }

            const profile = await AuthService.getProfile();
            setProfileData(profile);
            
            // Update localStorage to keep data in sync
            localStorage.setItem('user', JSON.stringify(profile));
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on mount and when refreshKey changes
    useEffect(() => {
        fetchProfileData();
    }, [refreshKey]);

    // Handle profile image upload success
    const handleImageUploadSuccess = (updatedProfile) => {
        setProfileData(updatedProfile);
        toast.success('Profile image updated successfully!');
        // Trigger refresh to ensure all data is in sync
        setRefreshKey(prev => prev + 1);
    };

    // Handle profile update success
    const handleProfileUpdateSuccess = () => {
        toast.success('Profile updated successfully!');
        setRefreshKey(prev => prev + 1);
    };

    if (isLoading) {
        return (
            <section className='font-raleway min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 pt-20 flex items-center justify-center'>
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl mb-4" />
                    <p className="text-white text-xl">Loading profile settings...</p>
                </div>
            </section>
        );
    }

    return (
        <section className='font-raleway min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 pt-20'>
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-300 rounded-full blur-xl animate-ping"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col gap-8 px-4 md:px-16 lg:px-28 text-slate-800">
                {/* Back Button */}
                <div className="flex items-center mb-4">
                    <a href="/Profile" className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors duration-300">
                        <ChevronLeftIcon className='text-white text-2xl' />
                        <span className="font-medium">Back to Profile</span>
                    </a>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Picture Section */}
                    <div className="w-full">
                        <div className="w-full px-6 pb-8 sm:rounded-2xl font-raleway bg-white/10 backdrop-blur-md shadow-md border border-white/20">
                            <div className="text-center mb-8 pt-6">
                                <h2 className="text-3xl font-bold text-white font-raleway mb-2">
                                    Profile Picture
                                </h2>
                                <p className="text-white/80">Update your profile image</p>
                            </div>
                            
                            <div className="max-w-4xl mx-auto">
                                <div className="flex flex-col items-center space-y-8">
                                    {profileData?.profile ? (
                                        <ProfileImageUpload 
                                            imageUrl={profileData.profile.profile_image_url}
                                            onUploadSuccess={handleImageUploadSuccess}
                                        />
                                    ) : (
                                        <div className="text-center py-8">
                                            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-3xl mb-4" />
                                            <p className="text-white/70">Loading profile image...</p>
                                        </div>
                                    )}
                                    
                                    {/* Profile Information Display */}
                                    <div className="w-full space-y-6">
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-xs">👤</span>
                                                </span>
                                                Current Profile Information
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                                                    <p className="text-sm text-white">
                                                        {profileData?.username || "Not set"}
                                                    </p>
                                                </div>

                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                                                    <p className="text-sm text-white">
                                                        {profileData?.email || "Not set"}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                                                    <p className="text-sm text-white">
                                                        {profileData?.profile?.bio || "No bio available"}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                                                    <p className="text-sm text-white">
                                                        {profileData?.profile?.location || "Not set"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Password Settings */}
                                <div className="mt-8 pt-8 border-t border-white/20">
                                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                                            <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-xs">🔒</span>
                                            </span>
                                            Password Settings
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:border-white/40 text-white placeholder-white/60" 
                                                    placeholder="Enter current password" 
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:border-white/40 text-white placeholder-white/60" 
                                                    placeholder="Enter new password" 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <p className="text-sm text-white/70 text-center sm:text-left">
                                                Can&apos;t remember your current password? 
                                                <a className="text-blue-300 hover:text-blue-200 font-medium ml-1" href="#">
                                                    Recover Account
                                                </a>
                                            </p>
                                            
                                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 whitespace-nowrap">
                                                Save Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Edit Section */}
                    <div className="w-full">
                        <div className="w-full px-6 pb-8 sm:rounded-2xl bg-white/10 backdrop-blur-md shadow-md border border-white/20">
                            <div className="text-center mb-8 pt-6">
                                <h2 className="text-3xl font-bold text-white font-raleway mb-2">
                                    Edit Profile Information
                                </h2>
                                <p className="text-white/80">Update your personal details</p>
                            </div>
                            
                            <div className="max-w-4xl mx-auto">
                                {profileData?.profile ? (
                                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                        <ProfileUpdate 
                                            profile={profileData.profile} 
                                            onProfileUpdated={handleProfileUpdateSuccess}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="text-center">
                                            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-3xl mb-4" />
                                            <p className="text-white/70">Loading profile information...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BackToTopButton />
            
            <div className={`${styles.paddingX} bg-gradient-to-r from-indigo-600 to-purple-600 w-full overflow-hidden mt-12`}>
                <Footer />
            </div>
        </section>
    );
}

export default ProfileSettings;