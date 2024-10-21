import { useState, useEffect } from "react";
import { getInitials } from "../utils/index.js";
import DashboardService from "../services/DashboardService.js";
import AuthService from "../services/AuthService.js";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import MobileSidebar from "./dashboard/MobileSidebar.jsx";
import Spinner from "./Spinner.jsx";
import BackToTopButton from "./BackToTopButton.jsx";
import clsx from "clsx";

const UsersData = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userStatistics, setUserStatistics] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalUsers, setTotalUsers] = useState(10);

    useEffect(() => {
        const fetchUserStatistics = async () => {
            setLoading(true);
            try {
                const data = await DashboardService.getUsersStatisticsData();
                setUserStatistics(data.userStatistics);
                setFilteredUsers(data.userStatistics);
                setTotalUsers(data.totalUsers);
            } catch (error) {
                console.error('Error fetching user statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStatistics();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, userStatistics]);

    const filterUsers = () => {
        let filtered = userStatistics;
        if (searchQuery) {
            filtered = filtered.filter(user =>
                (user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : user.username)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        }
        setFilteredUsers(filtered);
    };

    const deleteHandler = async (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this account? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await AuthService.deleteAccount(userId);
                    toast.success("User account deleted successfully");
                } catch (error) {
                    console.error('Error deleting account:', error);
                    toast.error("Error occurred while deleting account: " + error.message);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const TableHeader = () => (
        <thead className='border-b border-gray-300'>
            <tr className='text-black text-left'>
                <th className='py-2'>Username</th>
                <th className='py-2'>Role</th>
            </tr>
        </thead>
    );

    const TableRow = ({ user }) => (
        <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
            <td className='p-2'>
                <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-purple-700'>
                        <span className='text-xs md:text-sm text-center'>
                            {user.profile ? getInitials(`${user.profile.first_name} ${user.profile.last_name}`) : getInitials(user.username)}
                        </span>
                    </div>
                    {user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : user.username}
                </div>
            </td>
            <td className='p-2'>
                <span>{user.role}</span>
            </td>

        </tr>
    );

    const Card = ({ label, count, bg, icon }) => (
        <div className='w-full h-32 backdrop-filter backdrop-blur-lg p-5 shadow-md rounded-md flex items-center justify-between mt-10 bg-white border-solid border-2 border-indigo-600'>
            <div className='flex flex-col justify-between'>
                <p className='text-black text-base font-semibold'>{label}</p>
                <span className='text-2xl font-regular text-gray-800'>{count}</span>
                <span className='text-sm text-gray-400'>{"110 last month"}</span>
            </div>
            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
                {icon}
            </div>
        </div>
    );

    return (
        <>
            <div className='w-full flex flex-col md:flex-row flex-1 '>

                <MobileSidebar
                    isSidebarOpen={isSidebarOpen}
                    closeSidebar={() => setIsSidebarOpen(false)}
                />


                <div className='w-full md:px-1 px-0 mb-6'>

                    <div className='flex items-center justify-between mb-4 w-5/6 m-auto'>
                        <input
                            type="text"
                            placeholder="Search by username"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2"
                        />
                    </div>
                    <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded w-5/6 m-auto' >
                        <div className='overflow-x-auto'>
                            {loading ? (
                                <Spinner />
                            ) : (
                                <table className='w-full mb-5'>
                                    <TableHeader />
                                    <tbody>
                                        {filteredUsers.map((user, index) => (
                                            <TableRow key={index} user={user} />
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                    <BackToTopButton />
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default UsersData;
