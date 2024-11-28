import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ArtworkService from '../services/ArtworkService';
import { toast } from 'react-toastify';

const DropdownMenu = ({ artworkId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const popupRef = useRef(null);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    // Close the popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleDelete = useCallback(async (artworkId) => {
        setIsLoading(true);
        try {
            const deleteResponse = await ArtworkService.deleteArtwork(artworkId);
            console.log(deleteResponse, 'deleteArtwork')
            if (deleteResponse?.success) {
                toast.success(deleteResponse?.message || 'Artwork deleted successfully')
            } else {
                toast.error(deleteResponse || 'Failed deleting successfully')
            }

        } catch (error) {
            toast.error(error || 'Artwork deleted failed')
        } finally {
            setIsLoading(false);
        }
    }, []);
    return (
        <div className="relative flex items-center justify-end mt-2 mr-3">
            <span className="flex text-gray-700" onClick={togglePopup}>
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-purple-950 mr-2 ml-4 cursor-pointer" />
            </span>

            {isOpen && (
                <div
                    ref={popupRef}
                    className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                >
                    <ul>
                        <Link to={`/artwork/edit/${artworkId}`}>
                            <li
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                            >
                                Edit
                            </li>
                        </Link>

                        <li
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setIsOpen(false);
                                handleDelete(artworkId);
                            }}
                        >
                            Delete
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
