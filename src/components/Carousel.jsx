import { useState, useRef, useEffect } from 'react';
import styles from '../style';
import ArtworkService from '../services/ArtworkService';


// Data
import data from '../data.json';

const Carousel = () => {
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useRef(null);

  const defaultImage = 'https://example.com/default-image.jpg';


  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredImages, setFilteredImages] = useState([]);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction) => {
    if (direction === 'prev') {
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null) {
      return (
        carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, []);

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

  return (
    <section>
  <h2 className={`${styles.heading2} ${styles.flexCenter} py-8`}>Artworks Feed</h2>
   
    <div className="carousel my-12 mx-auto">
      <h2 className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Category Name
      </h2>
      <div className="relative overflow-hidden">
        <div className="flex justify-between absolute top left w-full h-full">
          <button
            onClick={movePrev}
            className="hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('prev')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-20 -ml-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="sr-only">Prev</span>
          </button>
          <button
            onClick={moveNext}
            className="hover:bg-blue-900/75 text-white w-10 h-full text-center opacity-75 hover:opacity-100 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
            disabled={isDisabled('next')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-20 -ml-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="sr-only">Next</span>
          </button>
        </div>
        <div
          ref={carousel}
          className="carousel-container relative flex gap-1 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"
        >

{isLoading ? (
                    <h1 className='text-6xl text-center mx-auto mt-32'>Loading...</h1>
                  ) : (
                  images.map(image => (

          
        //   {data.resources.map((resource, index) => {
            // return (
              <div
                key={image.id}
                className="carousel-item text-center relative w-64 h-64 snap-start"
              >
                <a
                  href={`/artworks/${image.id}`}
                  className="h-full w-full aspect-square block bg-origin-padding bg-left-top bg-cover bg-no-repeat z-0"
                  style={{ backgroundImage: `https://api.muralfinder.net${image.image_path}` }}
                >
                  <img
                   src={image.image_path ? `https://api.muralfinder.net${image.image_path}` : defaultImage}
                   alt={image.title || 'Artwork'}
                    className="w-full aspect-square"
                  />
                </a>
                <a
                  href={`/artworks/${image.id}`}
                  className="h-full w-full aspect-square block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-blue-800/75 z-10"
                >
                  <h3 className="text-white py-6 px-3 mx-auto text-xl">
                    {image.title}
                  </h3>
                </a>
              </div>
           
          ))
          
          )};
        </div>
      </div>
    </div>
    </section>
  );
};

export default Carousel;