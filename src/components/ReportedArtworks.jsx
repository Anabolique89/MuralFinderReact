import styles from '../style';
import { FaComments, FaHeart } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Sidebar from './dashboard/Sidebar';
import MobileSidebar from './dashboard/MobileSidebar';
import { useState } from 'react';
import { MdMenu } from 'react-icons/md';
import Title from './dashboard/Title';





const reportedArtworks = [
    {
        id: 1,
        name: 'Earthen Bottle',
        price: '$48',
        imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.'
    },
    {
        id: 2,
        name: 'Nomad Tumbler',
        price: '$35',
        imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-02.jpg',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.'
    },
    {
        id: 3,
        name: 'Productivity Planner',
        price: '$29',
        imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-03.jpg',
        imageAlt: 'Person using a pen to cross a task off a productivity paper'
    },
    {
        id: 4,
        name: 'Scented Candles',
        price: '$22',
        imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-04.jpg',
        imageAlt: 'Set of assorted scented candles in elegant containers'
    },
    {
        id: 5,
        name: 'candles',
        price: '$22',
        imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-04.jpg',
        imageAlt: 'Set of assorted scented candles in elegant containers'
    }
];


const ReportedArtworks = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const defaultImage = 'http://via.placeholder.com/640x360';
    // const userImage = artwork?.user?.profile_image_url || artwork?.user?.profile?.profile_image_url || '';

    return (

        <>
            <div className='w-full flex flex-col md:flex-row flex-1'>
                <ToastContainer />
                <div className='w-1/5 bg-indigo-600 sticky top-0 hidden md:block'>
                    <Sidebar />
                </div>
                <MobileSidebar
                    isSidebarOpen={isSidebarOpen}
                    closeSidebar={() => setIsSidebarOpen(false)}
                />

                <div className='flex-1 flex flex-col py-4 px-2 md:px-6'>
                    <header className='w-full flex justify-between items-center p-4 bg-white shadow-md md:hidden'>
                        <button onClick={() => setIsSidebarOpen(true)} className='text-2xl'>
                            <MdMenu />
                        </button>
                    </header>



                    <div className='w-full md:px-1 px-0 mb-6'>
                        <div className=' text-white'>
                            <Title title='Reported  Artworks' />
                        </div>

                        <div className="">
                            <div className=" py-8">

                                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                    {reportedArtworks.map(product => (
                                        <a key={product.id} href="#" className="group">
                                            <img
                                                src={product.imageSrc}
                                                alt={product.imageAlt}
                                                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                                            />
                                            <h3 className="mt-4 text-sm text-white">{product.name}</h3>
                                            {/* <p className="mt-1 text-lg font-medium text-gray-900">{product.price}</p> */}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>

    );
};

export default ReportedArtworks;
