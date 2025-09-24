import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faMapMarkerAlt, faEye, faHeart, faShare, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import MapForWall from './MapForWall';
import WallService from '@services/WallService';
import styles from '@styles';

const DisplayWalls = () => {
    const [walls, setWalls] = useState([]);
    const [filteredWalls, setFilteredWalls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    useEffect(() => {
        fetchWallsFromDatabase();
    }, []);

    useEffect(() => {
        filterWalls();
    }, [walls, searchTerm, selectedFilter]);

    const fetchWallsFromDatabase = async () => {
        try {
            const response = await WallService.getAllWalls();
            if (response.success) {
                setWalls(response.data.data);
            } else {
                console.error('Error fetching walls:', response.message || response.data);
            }
        } catch (error) {
            console.error('Error fetching walls:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filterWalls = () => {
        let filtered = walls;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(wall =>
                wall.location_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                wall.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                wall.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (selectedFilter !== 'all') {
            filtered = filtered.filter(wall => wall.status === selectedFilter);
        }

        setFilteredWalls(filtered);
    };

    return (
        <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 w-full overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-300 rounded-full blur-xl animate-ping"></div>
            </div>

            <div className="relative z-10">
                {/* Header Section */}
                <div className="text-center py-12 px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-raleway mb-4 animate-slide-in-up">
                        Discover Amazing Walls
                    </h2>
                    <p className="text-xl text-white/80 font-raleway max-w-2xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                        Explore street art locations and find the perfect canvas for your next masterpiece
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="max-w-6xl mx-auto px-4 mb-8 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search Bar */}
                            <div className="flex-1 relative">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60"
                                />
                                <input
                                    type="text"
                                    placeholder="Search walls by location, name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 z-10"
                                />
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="pl-12 pr-8 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                                >
                                    <option value="all" className="bg-indigo-800">All Walls</option>
                                    <option value="verified" className="bg-indigo-800">Verified</option>
                                    <option value="pending" className="bg-indigo-800">Pending</option>
                                </select>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        viewMode === 'grid'
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        viewMode === 'list'
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-white mb-4" />
                            <p className="text-white text-xl font-raleway">Loading amazing walls...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="max-w-6xl mx-auto px-4 mb-6">
                            <p className="text-white/80 font-raleway">
                                Found {filteredWalls.length} wall{filteredWalls.length !== 1 ? 's' : ''}
                                {searchTerm && ` matching "${searchTerm}"`}
                            </p>
                        </div>

                        {/* Walls Grid/List */}
                        <div className="max-w-6xl mx-auto px-4 pb-12">
                            {filteredWalls.length > 0 ? (
                                <div className={`${
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'space-y-6'
                                }`}>
                                    {filteredWalls.map((wall, index) => (
                                        <div
                                            key={wall.id}
                                            className="group animate-slide-in-up"
                                            style={{animationDelay: `${index * 0.1}s`}}
                                        >
                                            <Link to={`/wall/${wall.id}`} className="block">
                                                <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                                                    {/* Wall Map/Image */}
                                                    <div className="relative h-64 overflow-hidden">
                                                        <MapForWall
                                                            lat={wall.latitude}
                                                            long={wall.longitude}
                                                            title={wall.location_text}
                                                            image={wall.image_path}
                                                            style={{ height: '100%', width: '100%' }}
                                                        />

                                                        {/* Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <div className="absolute bottom-4 left-4 right-4">
                                                                <div className="flex items-center justify-between text-white">
                                                                    <div className="flex items-center space-x-3">
                                                                        <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                                                            <FontAwesomeIcon icon={faEye} />
                                                                        </button>
                                                                        <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                                                            <FontAwesomeIcon icon={faHeart} />
                                                                        </button>
                                                                        <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                                                            <FontAwesomeIcon icon={faShare} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Wall Info */}
                                                    <div className="p-6">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h3 className="text-xl font-bold text-white font-raleway group-hover:text-blue-300 transition-colors">
                                                                {wall.name || wall.location_text || 'Unnamed Wall'}
                                                            </h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium font-raleway ${
                                                                wall.status === 'verified'
                                                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                                    : wall.status === 'pending'
                                                                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                                    : 'bg-gray-500/20 text-white border border-gray-500/30'
                                                            }`}>
                                                                {wall.status || 'Unknown'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center text-white/80 mb-3">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-white/70" />
                                                            <span className="font-raleway text-sm text-white">
                                                                {wall.location_text || 'Location not specified'}
                                                            </span>
                                                        </div>

                                                        {wall.description && (
                                                            <p className="text-white/90 font-raleway text-sm line-clamp-2">
                                                                {wall.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="text-6xl mb-6">🏢</div>
                                    <h3 className="text-2xl font-bold text-white font-raleway mb-4">
                                        No walls found
                                    </h3>
                                    <p className="text-white/70 font-raleway mb-8 max-w-md mx-auto">
                                        {searchTerm || selectedFilter !== 'all'
                                            ? 'Try adjusting your search or filters to find more walls.'
                                            : 'Be the first to add a wall to our community!'}
                                    </p>
                                    <Link
                                        to="/add-wall"
                                        className="inline-flex items-center px-6 py-3 bg-blue-gradient text-primary font-raleway font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
                                    >
                                        Add New Wall
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* View Full Map Button */}
                        <div className="text-center pb-12">
                            <Link
                                to="/Map"
                                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-raleway font-bold rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                                View Full Interactive Map
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default DisplayWalls;
