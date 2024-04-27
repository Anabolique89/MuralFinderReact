import React, { useState, useEffect } from 'react';
import styles from '../style';
import { Footer } from '../components';
import AuthService from '../services/AuthService';
import ProfileImageUpload from '../components/ProfileUpload';


const ProfileSettings = () => {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profession: '',
        bio: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userId = AuthService.getUser()?.id;
                if (!userId) {
                    throw new Error('User ID not found');
                }
                const profile = await AuthService.getProfile(userId);
                console.log(profile)
                setProfileData(profile);
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            }
        };
        fetchProfileData();
        console.log(profileData)
    }, []);

    return (
        <section>
            <div className="bg-indigo-700 w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-purple-950 top-12">
                        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
                        <a href="#" className="flex items-center px-3 py-2.5 font-bold bg-white  text-purple-950 border rounded-full">Profile Settings</a>
                        <a href="#" className="flex items-center px-3 py-2.5 font-semibold  hover:text-purple-950 hover:border hover:rounded-full">Blog Posts</a>
                        <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-purple-950 hover:border hover:rounded-full">Notifications</a>
                        <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-purple-950 hover:border hover:rounded-full">Delete Account</a>
                    </div>
                </aside>
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 font-Raleway text-2xl font-bold sm:text-xl pt-4 pb-6">Profile Picture</h2>
                            <div className="grid max-w-2xl mx-auto mt-8">
                                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                <ProfileImageUpload imageUrl={profileData.profile.profile_image_url} />
                                </div>
                                <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                    <div className="mb-2 sm:mb-6">
                                        <label htmlFor="profession" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Profile Title</label>
                                        <input type="text" id="profession" className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 " placeholder="Profile Title" value={profileData.username} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Profile Text</label>
                                        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 " placeholder="Profile Text..." value={profileData.bio} onChange={handleInputChange}></textarea>
                                    </div>
                                    <hr className="mt-4 mb-8" />
                                    <h2 className="font-Raleway text-2xl font-bold sm:text-xl pt-4 pb-6">Password</h2>
                                    <div className="flex items-center">
                                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                                            <label htmlFor="login-password">
                                                <span className="text-sm text-gray-500">Current Password</span>
                                                <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                                    <input type="password" id="login-password" className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="***********" />
                                                </div>
                                            </label>
                                            <label htmlFor="login-password">
                                                <span className="text-sm text-gray-500">New Password</span>
                                                <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                                    <input type="password" id="login-password" className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="***********" />
                                                </div>
                                            </label>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    </div>
                                    <p className="mt-2">Can't remember your current password. <a className="text-sm font-semibold text-blue-600 underline decoration-2" href="#">Recover Account</a></p>
                                    <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">Save Password</button>
                                    <hr className="mt-4 mb-8" />
                                    <div className="flex justify-end">
                                        <button type="submit" className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <section className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="font-Raleway text-2xl font-bold sm:text-xl pt-6 pb-6">Profile Info</h2>
                            <div className="grid max-w-2xl mx-auto mt-0">
                                <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                        <div className="w-full">
                                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your first name</label>
                                            <input type="text" id="first_name" className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 " placeholder="Your first name" value={profileData.firstName} onChange={handleInputChange} required />
                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your last name</label>
                                            <input type="text" id="last_name" className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 " placeholder="Your last name" value={profileData.lastName} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-2 sm:mb-6">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Your email</label>
                                        <input type="email" id="email" className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 " placeholder="your.email@mail.com" value={profileData.email} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-2 sm:mb-6">
                                        <label htmlFor="profession" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Profile Description</label>
                                        <input type="text" id="profession" className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 " placeholder="Profile Description" value={profileData.profession} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Bio</label>
                                        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 " placeholder="Write your bio here..." value={profileData.bio} onChange={handleInputChange}></textarea>
                                    </div>
                                    <hr className="mt-4 mb-8" />
                                    <div className="mb-10">
                                        <h2 className="font-Raleway text-2xl font-bold sm:text-xl pt-4 pb-6">Delete Account</h2>
                                        <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Proceed with caution
                                        </p>
                                        <p className="mt-2">Make sure you have taken backup of your account in case you ever need to get access to your data. We will completely wipe your data. There is no way to access your account after this action.</p>
                                        <button className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">Continue with deletion</button>
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
                <Footer />
            </div>
        </section>
    );
}

export default ProfileSettings;
