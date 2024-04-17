import styles from '../style';
import { FaComments } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";


const UserArtworks = ({ image }) => {

  // Since `tags` doesn't exist in the new API data, we'll comment this out.
  // const tags = image.tags ? image.tags.split(',') : [];

  return (
    <div className={`max-w-xs rounded overflow-hidden shadow-lg ${styles.customCardWidth}`}>

      <div className='w-full'>
        {/* Adjusted to use `image_path` and added hostname if needed. Adjust `alt` to use `title` */}
        <img className='w-full h-48 object-cover' src={`https://api.muralfinder.net${image.image_path}`} alt={image.title || 'Artwork'} />
        <div className='px-6 py-4'>
          <div className='font-bold text-white text-xl mb-2'>
            {/* Adjust to show `title` */}
            Artwork: {image.title}
          </div>
          {/* Assuming you want to keep displaying user information */}
          <div className='font-raleway font-bold text-purple-500 text-xl mb-2'>
            Artist: {image.user?.username || 'Unknown'}
          </div>
          <ul className='flex'>
            {/* Updated to use `likes_count` and `comments_count` */}
      
            <li className='flex'><FcLike /> <span className='ml-2 mr-2'><strong> {image.likes_count}</strong></span>
            </li>
            <li className='flex'><FaComments />
              <span className='ml-2'><strong>{image.comments_count}</strong></span>
            </li>
     
          </ul>
    
        </div>
      </div>
    </div>
  );

}

export default UserArtworks