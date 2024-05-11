import styles from '../style';
import { FaComments } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";

const ArtworksGallery = ({ image }) => {
  // Since `tags` doesn't exist in the new API data, we'll comment this out.
  // const tags = image.tags ? image.tags.split(',') : [];

  return (
    <div className={`max-w-xs rounded-xl overflow-hidden shadow-lg ${styles.customCardWidth}`}>

      <div className='w-full'>
        {/* Adjusted to use `image_path` and added hostname if needed. Adjust `alt` to use `title` */}
        <img className='w-full h-48 object-cover' src={`https://api.muralfinder.net${image.image_path}`} alt={image.title || 'Artwork'} />
        <div className='px-6 py-4'>
           {/* Assuming you want to keep displaying user information */}
           <div className='font-raleway font-bold text-purple-500 text-xl mb-2'>
            {image.user?.username || 'Unknown'}
          </div>
          <div className='font-bold text-white text-xl mb-2'>
            {/* Adjust to show `title` */}
            {image.title}
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

export default ArtworksGallery;
