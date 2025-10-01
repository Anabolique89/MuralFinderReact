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


const ProfileSettings = () => {
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        proffession: '',
        bio: '',
        location: '',
        facebook: '',
        instagram: '',
        twitter: '',


    });
    const [, setIsProfileUpdated] = useState(false);

        useEffect(() => {
            const fetchProfileData = async () => {
                try {
                    const userId = AuthService.getUser()?.id;
                    if (!userId) {
                        throw new Error('User ID not found');
                    }
                    const profile = await AuthService.getProfile(userId);
                    setProfileData(profile);
                } catch (error) {
                    console.error('Error fetching profile data:', error.message);
                }
            };
            fetchProfileData();
        }, []);

    return (
        <section className='font-raleway min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 pt-20'>
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-300 rounded-full blur-xl animate-ping"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col gap-8 px-4 md:px-16 lg:px-28 md:flex-row text-slate-800">
                <div className="flex items-center mb-4">
                    <a href="/Profile" className="flex items-center space-x-2 text-white hover:text-indigo-200 transition-colors duration-300">
                        <ChevronLeftIcon className='text-white text-2xl' />
                        <span className="font-medium">Back to Profile</span>
                    </a>
                </div>
                {/* <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-slate-800 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold font-raleway">Settings</h2>
                        <a href="#" className="flex items-center px-3 py-2.5 font-raleway font-bold bg-white  text-purple-950 border rounded-full">Profile Settings</a>
                        <a href="#" className="flex items-center px-3 py-2.5 font-raleway font-semibold  hover:text-purple-950 hover:border hover:rounded-full">Blog Posts</a>
                        <a href="#" className="flex items-center px-3 py-2.5 font-raleway font-semibold hover:text-purple-950 hover:border hover:rounded-full">Notifications</a>
                        <a href="#" className="flex items-center px-3 py-2.5 font-raleway font-semibold hover:text-purple-950 hover:border hover:rounded-full">Delete Account</a>
                    </div>
                </aside> */}
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-4xl sm:rounded-2xl font-raleway bg-white/10 backdrop-blur-md shadow-md border border-white/20">
                            <div className="text-center mb-8 pt-6">
                                <h2 className="text-3xl font-bold text-white font-raleway mb-2">
                                    Profile Picture
                                </h2>
                                <p className="text-white/80">Update your profile image</p>
                            </div>
                            
                            <div className="grid max-w-4xl mx-auto mt-2">
                                <div className="flex flex-col items-center space-y-8">
                                    {profileData && profileData.profile && (
                                        <div className="flex-shrink-0">
                                            <ProfileImageUpload imageUrl={profileData.profile.profile_image_url} />
                                        </div>
                                    )}
                                    
                                    <div className="w-full space-y-6">
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                                <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-xs">👤</span>
                                                </span>
                                                Profile Information
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                                                    <p className="text-sm text-white">
                                                        {profileData && profileData.profile && profileData.profile.bio || "No bio available"}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                                                    <p className="text-sm text-white">
                                                        {profileData && profileData.email || "No email available"}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                                                    <p className="text-sm text-white">
                                                        City, Country
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-12 pt-8 border-t border-white/20">
                                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                                            <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-white text-xs">🔒</span>
                                            </span>
                                            Password Settings
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        
                                        <div className="mt-6 flex items-center justify-between">
                                            <p className="text-sm text-white/70">
                                                Can&apos;t remember your current password? 
                                                <a className="text-blue-300 hover:text-blue-200 font-medium ml-1" href="#">
                                                    Recover Account
                                                </a>
                                            </p>
                                            
                                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
                                                Save Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <section className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className='flex justify-center items-center h-full'>
                            <div className="w-full px-6 pb-8 mt-8 sm:max-w-4xl sm:rounded-2xl bg-white/10 backdrop-blur-md shadow-md border border-white/20">
                                <div className="text-center mb-8 pt-6">
                                    <h2 className="text-3xl font-bold text-white font-raleway mb-2">
                                        Profile Information
                                    </h2>
                                    <p className="text-white/80">Update your personal details</p>
                                </div>
                                
                                <div className="max-w-4xl mx-auto">
                                    {profileData.profile ? (
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                            <ProfileUpdate profile={profileData.profile} onProfileUpdated={() => setIsProfileUpdated(true)} />
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
                </section>


            </div>
            <BackToTopButton />
            <div className={`${styles.paddingX} bg-gradient-to-r from-indigo-600 to-purple-600 w-full overflow-hidden`}>
                <Footer />
            </div>
        </section>
    );
}

export default ProfileSettings;
