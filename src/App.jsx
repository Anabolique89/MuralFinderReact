import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from "./style";
import { Billing, Business, CardDeal, CTA, Footer, Navbar, Stats, Testimonials, Hero, ArtworksGallery, ImageSearch, DragDropImageUploader } from "./components";
import About from './pages/About';
import Community from './pages/Community';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Map from './pages/Map';
import Walls from './pages/Walls';
import IndexLogin from './pages/IndexLogin';
import IndexSignup from './pages/IndexSignup';
import Onboarding1 from './pages/Onboarding1';
import Onboarding2 from './pages/Onboarding2';
import Onboarding3 from './pages/Onboarding3';
import Contact from './pages/Contact';
import { ToastContainer } from 'react-toastify';
import ArtworkService from './services/ArtworkService';
import SingleBlogPost from './pages/SingleBlogPost';
import ProfileSettings from './pages/ProfileSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQS from './pages/FAQS';
import TermsConditions from './pages/TermsConditions';
import ViewWall from './pages/ViewWall';


const App = () => {

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredImages, setFilteredImages] = useState([]);
  console.log(filteredImages)

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
    const filtered = ArtworkService.searchArtworks(images, text);
    setFilteredImages(filtered);

    if (filtered.length === 0) {
      try {
        const backendResults = await ArtworkService.searchArtworksOnBackend(text);
        setFilteredImages(backendResults);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (

    <Router>
      <div className="bg-indigo-700 w-full overflow-hidden">

        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>
        <ToastContainer className='w-[20px] center-align'></ToastContainer>
        <Routes>
          <Route path="/" element={
            <>
              <div className={`bg-indigo-700 ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                  <Hero />
                </div>
              </div>
              <div className={`bg-indigo-700 ${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Stats />
                  <Business />
                  <Billing />
                  <h2 className={`${styles.heading2} ${styles.flexCenter} py-8`}>Artworks Feed</h2>
                  <ImageSearch searchText={searchText} />

                  {!isLoading && images.length === 0 && <h1 className='text-5xl text-center mx-auto mt-32'>No Images Found</h1>}
                  {isLoading ? (
                    <h1 className='text-6xl text-center mx-auto mt-32'>Loading...</h1>
                  ) : (
                    <div className='container mx-auto py-2'>
                      <div className="flex flex-wrap gap-2">
                        {(filteredImages.length > 0 ? filteredImages : images).map(image => (
                          <ArtworksGallery key={image.id} image={image} />
                        ))}

                      </div>
                    </div>
                  )}
                  <DragDropImageUploader />

                  <CardDeal />
                  <Testimonials />
                  <CTA />
                  <Footer />
                </div>
              </div>
            </>
          } />
          <Route path="/About" element={<About />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/Map" element={<Map />} />
          <Route path="/Walls" element={<Walls />} />
          <Route path="/Login" element={<IndexLogin />} />
          <Route path="/IndexSignup" element={<IndexSignup />} />
          <Route path="/Onboarding1" element={<Onboarding1 />} />
          <Route path="/Onboarding2" element={<Onboarding2 />} />
          <Route path="/Onboarding3" element={<Onboarding3 />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/blog/:postId" element={<SingleBlogPost />} />
          <Route path="/ProfileSettings" element={<ProfileSettings />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsConditions" element={<TermsConditions />} />
          <Route path="/FAQS" element={<FAQS />} />
          <Route path="/wall/:wallId" element={<ViewWall />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;