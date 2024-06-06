import styles from '../style';
import { FaComments } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEllipsisV, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import AuthService from '../services/AuthService';
import { Link } from 'react-router-dom';

const ArtworksGallery = ({ image }) => {

  console.log(image)
  const isAuthenticated = AuthService.isAuthenticated()
  const userImage = image.user?.profile?.profile_image_url || ''; // Check if user profile image exists
  const defaultImage = 'https://example.com/default-image.jpg'; // Default image URL from CDN
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    alert("You want to edit me?")
  };

  const handleDelete = () => {
    alert("You want to delete me?")
  };

  return (
    <div className='max-w-xs rounded-xl overflow-hidden shadow-lg w-50 relative bg-indigo-800 p-2'>
      <div className='w-full'>
        <img
          className='w-full h-48 object-cover p-2'
          src={image.image_path ? `https://api.muralfinder.net${image.image_path}` : defaultImage}
          alt={image.title || 'Artwork'}
        />
        <div className='px-6 py-2'>
          <div className='flex items-center mb-2'>
            {userImage ? (
              <img src={`https://api.muralfinder.net${userImage}`} alt={image.user?.username} className='w-8 h-8 rounded-full mr-2' />
            ) : (
              <FontAwesomeIcon icon={faUser} className="h-5 w-5 rounded-full mr-2 bg-gray-200 p-1" />
            )}
            <div className='font-raleway font-bold text-purple-400 text-sm mb-2'>
              {image.user?.username || 'Unknown'}
            </div>
          </div>
          <div className='font-bold text-white text-xl mb-2'>
            <Link to={`/artworks/${image.id}`}>
            {image.title}
            </Link>
          </div>
          <ul className='flex'>
            <li className='flex '><FcLike /> <span className='ml-2 mr-2'><strong> {image.likes_count}</strong></span></li>
            <li className='flex'><FaComments /><span className='ml-2'><strong>{image.comments_count}</strong></span></li>
          </ul>
          {isAuthenticated && (
            <div>
              <FontAwesomeIcon
                icon={faEllipsisV}
                className="cursor-pointer absolute bottom-5 right-5 mt-2 mr-2 text-white"
                onClick={toggleMenu}
              />
              {showMenu && (
                <div className='absolute right-0 bottom-10 bg-white shadow-lg rounded-lg p-2'>
                  <div className='text-gray-700 hover:bg-gray-200 rounded-lg p-1 cursor-pointer' onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPencil} className="mr-1" />
                    Edit
                  </div>
                  <div className='text-red-500 hover:bg-gray-200 rounded-lg p-1 cursor-pointer' onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Delete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtworksGallery;
