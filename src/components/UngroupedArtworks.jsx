import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComments, faEllipsisVertical, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import SampleImage from '../assets/brickWall.jpg';

const artworks = [
    {
        id: 1,
        title: "Beautiful Landscape",
        description: "A stunning landscape showcasing mountains and valleys.",
        image: SampleImage,
        username: "Artist1",
        likes: 120,
        comments: 45,
    },
    {
        id: 2,
        title: "Abstract Art",
        description: "A mesmerizing abstract painting with bold colors.",
        image: SampleImage,
        username: "Artist2",
        likes: 85,
        comments: 20,
    },
    {
        id: 3,
        title: "City Skyline",
        description: "A city skyline under a golden sunset.",
        image: SampleImage,
        username: "Artist3",
        likes: 200,
        comments: 60,
    },
];

const UngroupedArtworks = () => {
    return (
        <section className="h-[770px] overflow-scroll">
            <div className="mx-auto px-4 py-8 max-w-4xl">
                {artworks.map((artwork) => (
                    <div key={artwork.id} className="backdrop-filter backdrop-blur-lg shadow-2xl rounded-lg mb-6 tracking-wide">
                        {/* Image */}
                        <div className="md:flex-shrink-0">
                            <img
                                src={artwork.image}
                                alt={artwork.title}
                                className="w-full h-100 rounded-lg rounded-b-none"
                            />
                        </div>
                        {/* Author */}
                        <div className="flex items-center justify-end mt-2 mr-3">
                            <FontAwesomeIcon icon={faEllipsisVertical} className="text-purple-950 mr-2 ml-4" />
                        </div>
                        <div className="author flex items-center px-2">
                            <Link to={`/profile/${artwork.id}`} className="flex items-center ml-4">
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5 rounded-full mr-2 bg-gray-200 p-1" />
                                <div className='font-bold text-purple-400 text-sm'>
                                    {artwork.username}
                                </div>
                            </Link>
                        </div>
                        {/* Artwork Content */}
                        <div className="px-4 py-2 mt-2">
                            <h2 className="text-xl font-semibold text-white px-2">
                                {artwork.title}
                            </h2>
                            <p className="text-sm px-2 pb-2 mr-1">
                                {artwork.description}
                            </p>
                            {/* Likes and Comments */}
                            <div className="flex items-center justify-start mt-2 mx-2">
                                <FontAwesomeIcon icon={faHeart} className="text-purple-950 mr-2" />
                                <span>{artwork.likes}</span>
                                <FontAwesomeIcon icon={faComments} className="text-purple-950 mr-2 ml-4" />
                                <span>{artwork.comments}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default UngroupedArtworks;
