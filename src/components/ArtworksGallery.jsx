import styles from '../style';



const ArtworksGallery = ({ image }) => {
const tags = image.tags.split(',');
 
return(

    <div className='max-w-sm rounded overflow-hidden shadow-lg'>
      
     <img className='w-full' src={image.webformatURL} alt='random' />
     <div className='px-6 py-4'>
<div className='font-bold text-white text-xl mb-2'>
Artwork by {image.user}
</div>
<div className='font-raleway font-bold text-purple-500 text-xl mb-2'>
{image.type}
</div>
<ul>
  <li>
    <strong>Likes {image.likes}</strong>
  </li>
  <li>
    <strong>Comments {image.comments}</strong>
  </li>

</ul>
<div className='py-4'>
{tags.map((tag, index) =>(
  <span key={index} className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>
 #{tag} 
  </span>
))}

</div>
     </div>
    </div>
  )
}

export default ArtworksGallery