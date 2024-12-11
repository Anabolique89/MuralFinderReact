import styles from '../style';
import { FaComments, FaEye, FaHeart, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Sidebar from './dashboard/Sidebar';
import MobileSidebar from './dashboard/MobileSidebar';
import { useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md';
import Title from './dashboard/Title';

import ReportService from '../services/ReportService';




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
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);




    const handleView = async (reportId) => {

        try {
            const reportById = await ReportService.getReportById(reportId); // Assuming deleteReport is a function in your service
            console.log(reportById)
        } catch (error) {
            console.error("Error deleting report:", error);
        }
        // console.log(reportId);
    };


    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await ReportService.getAllReports();
                setReports(response); // Assuming the reports are in response.data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setError("Error fetching reports");
                setLoading(false);
            }
        };

        fetchReports();
    }, []);
    // console.log(reports?.data?.data, 'reports')
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
                                <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="text-left bg-gray-100 text-gray-600">
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">User ID</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Reason</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    {loading ? "loading" : (<tbody>

                                        {reports?.data?.data.map((report, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{report?.id}</td>
                                                <td className="px-6 py-4">{report?.user_id}</td>
                                                <td className="px-6 py-4">{report?.reportable_type}</td>
                                                <td className="px-6 py-4">{report?.reason}</td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    {/* <FaTrash color='red' className='cursor-pointer' /> */}
                                                    <Link to={`/report/${report?.id}`} >
                                                        <FaEye className='cursor-pointer' onClick={() => handleView(report?.id)} />

                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>)}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>

    );
};

export default ReportedArtworks;
