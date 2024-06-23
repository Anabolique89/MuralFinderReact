import React, { useState, useEffect } from 'react';
import styles from "../style";
import { Navbar, Stats, Testimonials, Hero, ArtworksGallery, ImageSearch, DragDropImageUploader, SingleArtwork, Carousel } from "../components";
// import { ToastContainer } from 'react-toastify';
import ArtworkService from '../services/ArtworkService';
import Footer from '../components/Footer';
import EditArtworkUploader from './EditArtworkUploader';

const ArtworkFeed = () => {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredImages, setFilteredImages] = useState([]);
    // console.log(filteredImages)
  

//filter categories

// const [filter, setFilter] = useState('all');
// const [projects, setProjects] = useState([]);
// useEffect(() => {  
// setProjects(portfolio);}, []);
// useEffect(() => {  
// setProjects([]);  
// const filtered = portfolio.map(p => ({ ...p, filtered: p.category.includes(filter) }));  
// setProjects(filtered);}, [filter]);

    useEffect(() => {
      setIsLoading(true);
      ArtworkService.loadArtworks()
        .then(data => {
          setImages(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    }, []);
  
    const searchText = async (text) => {
      setIsLoading(true);
      try {
        const filtered = await ArtworkService.searchArtworksOnBackend(text, page, pageSize);
        setFilteredImages(filtered);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
  
    // Add functions to handle pagination
    const handlePageChange = (newPage) => {
      setPage(newPage);
    };
  
    const handlePageSizeChange = (newPageSize) => {
      setPageSize(newPageSize);
      setPage(1); // Reset page when page size changes
    };


  return (
    <div className="bg-indigo-700 w-full overflow-hidden">
    

<h2 className={`${styles.heading2} ${styles.flexCenter} py-8`}>Artworks Feed</h2>
    {/* filters */}
    <div className="portfolio__labels">     
       <a href="/#">All</a>      
       <a href="/#">StreetArt</a>      
       <a href="/#">Graffiti</a>      
       <a href="/#">TraditionalArt</a>      
       <a href="/#">Photography</a>  
       <a href="/#">DigitalArt</a>      
       <a href="/#">PerformanceArt</a>  
       </div>

    {/* after applied categories to artwork, use this code instead */}

    {/* <div className="portfolio__labels">  
    <a href="/#" active={filter === 'all'} onClick={() => setFilter('all')}>All</a> 
     <a href="/#" active={filter === 'StreetArt'} onClick={() => setFilter('StreetArt')}>StreetArt</a>  
     <a href="/#" active={filter === 'Graffiti'} onClick={() => setFilter('Graffiti')}>Graffiti</a>  
     <a href="/#" active={filter === 'TraditionalArt'} onClick={() => setFilter('TraditionalArt')}>TraditionalArt</a>  
     <a href="/#" active={filter === 'Photography'} onClick={() => setFilter('Photography')}>Photography</a>
     <a href="/#" active={filter === 'DigitalArt'} onClick={() => setFilter('DigitalArt')}>DigitalArt</a>  
     <a href="/#" active={filter === 'PerformanceArt'} onClick={() => setFilter('PerformanceArt')}>PerformanceArt</a>
     </div> */}

                  <ImageSearch
                    searchText={searchText}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />


                  {!isLoading && images.length === 0 && <h1 className='text-5xl text-center mx-auto mt-32'>No Images Found</h1>}
                  {isLoading ? (
                    <h1 className='text-6xl text-center mx-auto mt-32'>Loading...</h1>
                  ) : (
                    <div className='container mx-auto py-2'>
                     <div className="grid grid-cols-1 gap-2 xs:grid-cols-1 ss:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {(filteredImages.length > 0 ? filteredImages : images).map(image => (
                          <ArtworksGallery key={image.id} image={image} />
                        ))}
                      </div>
                    </div>

                  )}
                  <DragDropImageUploader />

                  <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
                  <Footer />
                  </div>
    </div>



    
  )
}

export default ArtworkFeed