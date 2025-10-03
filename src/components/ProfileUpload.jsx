import React, { useState, useEffect } from 'react';
import AuthService from "../services/AuthService";
import { getFileUrl } from '../utils/apiConfig';

const ProfileImageUpload = ({ imageUrl, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('error'); // 'error' or 'success'

    useEffect(() => {
        if (imageUrl && !preview) {
            setPreview(getFileUrl(imageUrl));
        }
    }, [imageUrl, preview]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setMessage('Please select an image file');
                setMessageType('error');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage('Image size should be less than 5MB');
                setMessageType('error');
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setMessage(null);
        }
    };

    const handleDeleteButtonClick = () => {
        setSelectedFile(null);
        setPreview(getFileUrl(imageUrl) || null);
        setMessage(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select an image first');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const user = AuthService.getUser();
            
            if (!user || !user.id) {
                throw new Error('User not authenticated. Please log in again.');
            }

            const imageData = new FormData();
            imageData.append('image', selectedFile);

            console.log('Uploading image for user:', user.id);
            
            const response = await AuthService.uploadProfileImage(user.id, imageData);
            
            console.log('Upload response:', response);

            // Show success message
            setMessage(typeof response === 'string' ? response : 'Profile image updated successfully!');
            setMessageType('success');

            // Clear selected file
            setSelectedFile(null);

            // Refresh profile data
            const updatedProfile = await AuthService.getProfile();
            
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedProfile));

            // Update preview with new image
            if (updatedProfile?.profile?.profile_image_url) {
                setPreview(getFileUrl(updatedProfile.profile.profile_image_url));
            }

            // Call parent callback if provided
            if (onUploadSuccess) {
                onUploadSuccess(updatedProfile);
            }

            // Hide success message after 5 seconds
            setTimeout(() => {
                setMessage(null);
            }, 5000);

        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message 
                || error.message 
                || 'Failed to upload image. Please try again.';
            
            setMessage(errorMessage);
            setMessageType('error');

            setTimeout(() => {
                setMessage(null);
            }, 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
            <img
                className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                src={preview || `https://api.muralfinder.net/${imageUrl}` || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}
                alt="Profile"
            />

            <div className="flex flex-col space-y-2 w-[200px] sm:ml-8">
                <input 
                    name="file" 
                    type="file" 
                    accept="image/*"
                    className="file" 
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
                
                {selectedFile && (
                    <>
                        <button 
                            type="button" 
                            onClick={handleDeleteButtonClick} 
                            disabled={isLoading}
                            className="py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full disabled:opacity-50"
                        >
                            Delete
                        </button>
                        <button 
                            type="button" 
                            onClick={handleUpload} 
                            disabled={isLoading}
                            className="py-2 px-4 bg-indigo-600 font-raleway font-bold text-[18px] text-white outline-none uppercase rounded-full disabled:opacity-50"
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </>
                )}
                
                {message && (
                    <div className={`px-4 py-2 rounded-md ${
                        messageType === 'success' 
                            ? 'bg-green-200 text-green-700' 
                            : 'bg-red-200 text-red-700'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileImageUpload;