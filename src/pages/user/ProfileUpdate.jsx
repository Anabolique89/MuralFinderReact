import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AuthService from '../../services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FaGlobe, FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaLinkedin, FaUser, FaBriefcase, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../style';
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const ProfileUpdate = ({ profile, onProfileUpdated }) => {

    const navigate = useNavigate()
    const [profileData, setProfileData] = useState({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        profession: profile?.profession || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        website: profile?.website || '',
        facebook: profile?.facebook || '',
        instagram: profile?.instagram || '',
        twitter: profile?.twitter || '',
        tiktok: profile?.tiktok || '',
        linkedin: profile?.linkedin || '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    // Update profile data when profile prop changes
    useEffect(() => {
        if (profile) {
            setProfileData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                profession: profile.profession || '',
                bio: profile.bio || '',
                location: profile.location || '',
                website: profile.website || '',
                facebook: profile.facebook || '',
                instagram: profile.instagram || '',
                twitter: profile.twitter || '',
                tiktok: profile.tiktok || '',
                linkedin: profile.linkedin || '',
            });
        }
    }, [profile]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setProfileData((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const handleSaveProfile = useCallback(async () => {
        try {
            await AuthService.updateProfile(profileData);
            console.log('Profile updated successfully');
            toast.success('Profile updated successfully!');
            onProfileUpdated();
        } catch (error) {
            console.error('Error updating profile:', error.message);
            toast.error('Error updating profile!');
        }
    }, [profileData, onProfileUpdated]);

    const handleDeleteAccount = async () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete your account? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsDeletingAccount(true);

                try {
                    const userId = AuthService.getUser()?.id;
                    if (!userId) {
                        throw new Error('User ID not found');
                    }

                    // Call AuthService to delete account
                    await AuthService.deleteAccount(userId);
                    console.log('Account deleted successfully');

                    // Log the user out
                    localStorage.clear();
                    // Redirect or handle logout state as needed

                    Swal.fire(
                        'Deleted!',
                        'Your account has been deleted.',
                        'success'
                    );

                    navigate('/login')
                } catch (error) {
                    console.error('Error deleting account:', error);
                    Swal.fire(
                        'Error!',
                        'There was an error deleting your account.',
                        'error'
                    );
                } finally {
                    setIsDeletingAccount(false);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                        <p className="text-gray-600">Update your personal information and social media links</p>
                    </div>

                    {/* Profile Form */}
                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                    <div className="w-full">
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <FaUser className="text-indigo-500" />
                            <span>Your first name</span>
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                            placeholder="Your first name"
                            value={profileData.first_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <FaUser className="text-indigo-500" />
                            <span>Your last name</span>
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                            placeholder="Your last name"
                            value={profileData.last_name}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="mb-2 sm:mb-6">
                    <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaFileAlt className="text-green-500" />
                        <span>Short text about you (Bio)</span>
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Profile Description"
                        value={profileData.bio}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                <div className="mb-2 sm:mb-6">
                    <label htmlFor="profession" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaBriefcase className="text-purple-500" />
                        <span>What&apos;s your profession</span>
                    </label>
                    <input
                        type="text"
                        id="profession"
                        name="profession"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Your profession"
                        value={profileData.profession}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-2 sm:mb-6">
                    <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span>Location</span>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Your Location"
                        value={profileData.location}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-2 sm:mb-6">
                    <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaGlobe className="text-blue-500" />
                        <span>Website</span>
                    </label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="https://yourwebsite.com"
                        value={profileData.website}
                        onChange={handleInputChange}
                    />
                </div>

                {/* social media links */}
                <div className="mb-2 sm:mb-6">
                    <label htmlFor="facebook" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaFacebook className="text-blue-600" />
                        <span>Facebook</span>
                    </label>
                    <input
                        type="text"
                        id="facebook"
                        name="facebook"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Your Facebook Profile Link"
                        value={profileData.facebook}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-2 sm:mb-6">
                    <label htmlFor="instagram" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaInstagram className="text-pink-500" />
                        <span>Instagram</span>
                    </label>
                    <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Your Instagram Profile Link"
                        value={profileData.instagram}
                        onChange={handleInputChange}
                    />
                </div>


                <div className="mb-2 sm:mb-6">
                    <label htmlFor="twitter" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaTwitter className="text-blue-400" />
                        <span>X (Twitter)</span>
                    </label>
                    <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Your X Profile Link"
                        value={profileData.twitter}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-2 sm:mb-6">
                    <label htmlFor="tiktok" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaTiktok className="text-black" />
                        <span>TikTok</span>
                    </label>
                    <input
                        type="text"
                        id="tiktok"
                        name="tiktok"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Your TikTok Profile Link"
                        value={profileData.tiktok}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-2 sm:mb-6">
                    <label htmlFor="linkedin" className="block mb-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <FaLinkedin className="text-blue-700" />
                        <span>LinkedIn</span>
                    </label>
                    <input
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors duration-200"
                        placeholder="Your LinkedIn Profile Link"
                        value={profileData.linkedin}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-raleway font-semibold text-[16px] rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${submitting ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => {
                            setSubmitting(true);
                            handleSaveProfile().then(() => {
                                setSubmitting(false);
                            });
                        }}
                    >
                        {submitting ? (
                            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-lg" />
                        ) : (
                            'Save'
                        )}
                    </button>
                </div>
                </div>

                {/* Delete Account Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h3>
                                <p className="text-red-700 text-sm mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">What happens when you delete your account:</h4>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• All your artworks and posts will be permanently removed</li>
                                        <li>• Your profile and personal information will be deleted</li>
                                        <li>• You will lose access to all your data and content</li>
                                        <li>• This action cannot be undone</li>
                                    </ul>
                                </div>
                                <button
                                    className={`px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${isDeletingAccount ? 'cursor-not-allowed opacity-50' : ''}`}
                                    onClick={handleDeleteAccount}
                                    disabled={isDeletingAccount}
                                >
                                    {isDeletingAccount ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
                                            <span>Deleting Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Delete My Account</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
    );
};

ProfileUpdate.propTypes = {
    profile: PropTypes.object,
    onProfileUpdated: PropTypes.func.isRequired,
};

export default ProfileUpdate;
