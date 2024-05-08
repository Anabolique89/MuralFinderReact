import React, { useState } from 'react';
import styles from '../style';
import AuthService from '../services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ProfileUpdate = ({ profile }) => {
    const [profileData, setProfileData] = useState({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        proffession: profile?.proffession || '',
        bio: profile?.bio || '',
    });

    const [submitting, setSubmitting] = useState(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            const userId = AuthService.getUser()?.id;
            if (!userId) {
                throw new Error('User ID not found');
            }
            await AuthService.updateProfile(userId, profileData);
            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };

    return (
        <div className="grid max-w-2xl mx-auto mt-0">
            <div className="items-center mt-8 sm:mt-14 font-Raleway text-white">

                
                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                    <div className="w-full">
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-slate-800 dark:text-white">
                            Your first name
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className="bg-indigo-50 border border-indigo-300 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                            placeholder="Your first name"
                            value={profileData.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-slate-800 dark:text-white">
                            Your last name
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            className="bg-indigo-50 border border-indigo-300 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                            placeholder="Your last name"
                            value={profileData.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="mb-2 sm:mb-6">
                    <label htmlFor="profession" className="block mb-2 text-sm font-medium text-slate-800 dark:text-white">
                        Profile Description
                    </label>
                    <input
                        type="text"
                        id="proffession"
                        name="proffession"
                        className="bg-indigo-50 border border-indigo-300 text-slate-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Profile Description"
                        value={profileData.proffession}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="bio" className="block mb-2 text-sm font-medium text-slate-800 dark:text-white">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        className="block p-2.5 w-full text-sm text-slate-800 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 "
                        placeholder="Write your bio here..."
                        value={profileData.bio}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <hr className="mt-4 mb-8" />
                <div className="mb-10">
                    <h2 className="text-2xl font-bold font-Raleway sm:text-xl pt-4 pb-6">Delete Account</h2>
                    <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600 font-Raleway ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Proceed with caution
                    </p>
                    <p className="mt-2">
                        Make sure you have taken backup of your account in case you ever need to get access to your data. We will
                        completely wipe your data. There is no way to access your account after this action.
                    </p>
                    <button className="ml-auto text-sm font-raleway font-semibold text-rose-400 underline decoration-2 mb-4">
                        Continue with deletion
                    </button>
                    <hr className="mt-4 mb-8" />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full ${styles} ${submitting ? 'cursor-not-allowed' : ''}`}
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
        </div>
    );
};

export default ProfileUpdate;
