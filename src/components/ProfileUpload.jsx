import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const ProfileImageUpload = ({ imageUrl }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file); // Save the file itself
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result); // Save the preview data
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteButtonClick = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsLoading(true);

        try {
            const user = AuthService.getUser()
            const imageData = new FormData();
            imageData.append('image', selectedFile);
            const response = await AuthService.uploadProfileImage(user.id, imageData);
            setMessage(response);
            setTimeout(() => {
                setMessage(null);
            }, 5000); // Hide the message after 5 seconds
        } catch (error) {
            setMessage(error);
            setTimeout(() => {
                setMessage(null);
            }, 5000); // Hide the message after 5 seconds
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
            <img
                className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                src={(imageUrl ? `https://api.muralfinder.net/${imageUrl}` : preview) || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"}
                alt="Bordered avatar"
            />

            <div className="flex flex-col space-y-4 w-[200px] sm:ml-8">
                <input name="file" type="file" className="file" onChange={handleFileChange} />
                {selectedFile && (
                    <>
                        <button type="button" onClick={handleDeleteButtonClick} className="py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full">Delete</button>
                        <button type="button" onClick={handleUpload} className="py-2 px-4 bg-indigo-500 font-raleway font-bold text-[18px] text-white outline-none uppercase rounded-full">{isLoading ? 'Uploading...' : 'Upload'}</button>
                    </>
                )}
                {message && (
                    <div className="bg-red-200 text-red-700 px-4 py-2 rounded-md">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileImageUpload;
