import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import ArtworkService from '../services/ArtworkService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import styles from '../style';
import { BackToTopButton } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditArtworkUploader = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const isAuthenticated = AuthService.isAuthenticated();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const fetchedArtwork = await ArtworkService.getArtworkById(artworkId);
        setArtwork(fetchedArtwork.data);
        setTitle(fetchedArtwork.data.title);
        setDescription(fetchedArtwork.data.description);
        setCategory(fetchedArtwork.data?.category?.id || ''); // Set category ID
        if (fetchedArtwork.data.image_path) {
          setImages([{ 
            name: fetchedArtwork.data.title, 
            url: `https://api.muralfinder.net${fetchedArtwork.data.image_path}`, 
            file: null 
          }]);
        }
      } catch (error) {
        console.error('Error fetching artwork:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [artworkId]);

  const selectFiles = () => fileInputRef.current.click();

  const onFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0 && files[0].type.startsWith('image')) {
      const file = files[0];
      setImages([{ name: file.name, url: URL.createObjectURL(file), file }]);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image')) {
      setImages([{ name: file.name, url: URL.createObjectURL(file), file }]);
    }
  };

  const editArtwork = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category); // Append the selected category
      if (images[0]?.file) {
        formData.append('image', images[0].file);
      }

      // Log each entry in formData to verify content before sending
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Send formData to backend
      const response = await ArtworkService.editArtwork(artworkId, formData);
      if (response.status === 200) {
        toast.success('Artwork edited successfully!');
        setTimeout(() => navigate(-1), 2000);
      } else {
        throw new Error('Failed to update artwork');
      }
    } catch (error) {
      console.error('Error editing artwork:', error);
      toast.error('Failed to edit Artwork?. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = () => setImages([]);

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = 'copy';
  };

  const onDragLeave = () => setIsDragging(false);

  useEffect(() => {
    setLoading(true);
    ArtworkService.loadCategories()
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-200 text-4xl mr-2" style={{ fontSize: '2rem' }} />
        <span className="text-gray-200 text-xl">...</span>
      </div>
    );
  }

  if (!artwork) {
    return <div>Error loading artwork</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col w-4/5 m-auto rounded-md mt-3">
        <div className="3/4 p-4 text-center text-white">
          <h2 className="font-bold text-lg mb-2">Edit your artwork</h2>
        </div>
        <div className="flex flex-col md:flex-row p-5 bg-transparent">
          {isAuthenticated ? (
            <>
              <section className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-300">
                <div className="flex justify-center items-center h-full text-center">
                  <div className="w-full p-2 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-400 focus:outline-none cta-block">
                    <p className="font-raleway font-normal text-[18px] leading-[32px] text-white my-5 p-4">
                      Click or drag & drop to upload artwork
                    </p>
                    <div
                      className="drag-area p-2"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      {isDragging ? (
                        <span className="max-w-[470px] m-4 select">Drop image here</span>
                      ) : (
                        <>Click or drag & drop image here</>
                      )}
                      <input name="file" type="file" ref={fileInputRef} onChange={onFileSelect} className="file" />
                    </div>
                  </div>
                </div>
              </section>
              <section className="w-full md:w-1/2 px-4">
                <div className="flex flex-col justify-center items-center mt-5">
                  <input
                    name="title"
                    type="text"
                    placeholder="Artwork Title..."
                    className="w-full p-4 rounded-md mb-4 border border-gray-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <textarea
                    name="description"
                    type="text"
                    placeholder="Artwork Description..."
                    className="w-full p-4 rounded-md border border-gray-300"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full p-4 rounded-md border border-gray-300'>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button onClick={editArtwork} type="submit" className="my-7 py-2 px-4 text-white w-full p-4 rounded border border-blue-300">
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin size="1x" className="mr-2" /> : 'Submit'}
                  </button>
                </div>
              </section>
            </>
          ) : (
            <div className="w-full p-4 text-center text-white">
              <p>Login to edit your artworks.</p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
                <a href="/login">Login</a>
              </button>
            </div>
          )}
        </div>
        <div className={`${styles.flexCenter} flex-col mb-0 mt-2`}><Footer /></div>
        <BackToTopButton />
      </div>
    </>
  );
};
export default EditArtworkUploader;
