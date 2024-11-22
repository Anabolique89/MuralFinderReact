import styles from '../style';
import { FaComments, FaHeart } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Sidebar from './dashboard/Sidebar';
import MobileSidebar from './dashboard/MobileSidebar';
import { useState } from 'react';





const artwork = [
    {
        id: 1,
        title: "Sunset Serenity",
        image_path: "/images/artwork1.jpg",
        likes_count: 120,
        comments_count: 15,
        user: {
            id: 101,
            username: "artist_sam",
            profile_image_url: "/images/user1.jpg",
            first_name: "Sam",
            last_name: "Doe",
        },
    },
    {
        id: 2,
        title: "Ocean Waves",
        image_path: "/images/artwork2.jpg",
        likes_count: 85,
        comments_count: 8,
        user: {
            id: 102,
            username: "creative_kate",
            profile_image_url: "/images/user2.jpg",
            first_name: "Kate",
            last_name: "Smith",
        },
    },
    {
        id: 3,
        title: "Mountain Majesty",
        image_path: "/images/artwork3.jpg",
        likes_count: 200,
        comments_count: 25,
        user: {
            id: 103,
            username: "nature_lover",
            profile_image_url: "/images/user3.jpg",
            first_name: "Tom",
            last_name: "Brown",
        },
    },
    {
        id: 4,
        title: "Abstract Dreams",
        image_path: "/images/artwork4.jpg",
        likes_count: 45,
        comments_count: 5,
        user: {
            id: 104,
            username: "abstract_annie",
            profile_image_url: "/images/user4.jpg",
            first_name: "Annie",
            last_name: "Clark",
        },
    },
];


const ReportedArtworks = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const defaultImage = 'http://via.placeholder.com/640x360';
    const userImage = artwork?.user?.profile_image_url || artwork?.user?.profile?.profile_image_url || '';

    return (

        <section className='flex flex-col min-h-screen'>
            <ToastContainer />
            <div className='w-full flex flex-col md:flex-row flex-1'>

                <div className='w-1/5 bg-indigo-600 sticky top-0 hidden md:block'>
                    <Sidebar />
                </div>
                <MobileSidebar
                    isSidebarOpen={isSidebarOpen}
                    closeSidebar={() => setIsSidebarOpen(false)}
                />
                <div className=''>
                    <div className='flex flex-col'>
                        <Link to={`/artworks/${artwork?.id}`}>
                            <img
                                className='w-full h-48 object-cover p-2'
                                src={artwork?.image_path ? `https://api.muralfinder.net${artwork?.image_path}` : defaultImage}
                                alt={artwork?.title || 'Artwork'}
                            />
                        </Link>
                        <div className='px-1 py-4 flex justify-between'>
                            <div className='flex items-center'>
                                <div className='flex items-center'>
                                    <Link to={`/profile/${artwork?.user?.id}`} className="flex items-center">
                                        {userImage ? (
                                            <img
                                                src={`https://api.muralfinder.net${userImage}`}
                                                alt={artwork?.user?.username}
                                                className='w-8 h-8 rounded-full mr-2 object-cover'
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faUser} className="h-5 w-5 rounded-full mr-2 bg-gray-200 p-1" />
                                        )}
                                        <div className='font-raleway font-bold text-purple-400 text-sm mb-2'>
                                            {artwork?.user?.username || artwork?.user?.first_name || artwork?.user?.last_name}
                                        </div>
                                    </Link>
                                </div>
                                <div className='font-bold text-white text-xl mb-2'>
                                    <Link to={`/artworks/${artwork?.id}`}>
                                        {artwork?.title}
                                    </Link>
                                </div>
                                <ul className='flex'>
                                    <li className='flex items-center'>
                                        <FaHeart color='#fff' />
                                        <span className='ml-2 mr-2'>
                                            <strong>{artwork?.likes_count}</strong>
                                        </span>
                                    </li>
                                    <li className='flex'>
                                        <FaComments className='text-white' />
                                        <span className='ml-2'>
                                            <strong>{artwork?.comments_count}</strong>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className=" mt-2 mr-2 text-white flex space-x-4">

                                <FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-700" />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </section>

    );
};

export default ReportedArtworks;
