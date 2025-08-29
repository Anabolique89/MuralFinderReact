import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetArtworksQuery } from '@store/api/muralFinderApi';
import { useArtworks, useAuth } from '@hooks/redux';
import { setFeedArtworks } from '@store/slices/artworkSlice';
import { addNotification } from '@store/slices/uiSlice';

// Import original components and assets - KEEP EVERYTHING EXACTLY AS ORIGINAL
import styles from '@styles';
import { google, Interlinked, discount } from '@assets';
import { stats } from '../constants';
import GetStarted from '@components/GetStarted';
import Business from '@components/Business';
import Billing from '@components/Billing';
import Adverts from '@components/Adverts';
import Carousel from '@components/Carousel';
import DragDropImageUploader from '@components/DragDropImageUploader';
import CardDeal from '@components/CardDeal';
import Testimonials from '@components/Testimonials';
import CTA from '@components/CTA';
import BackToTopButton from '@components/BackToTopButton';
import Footer from '@components/Footer';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { feedArtworks } = useArtworks();

  // Interactive state
  const [discountVisible, setDiscountVisible] = useState(true);

  // API Queries for Redux integration
  const { data: artworksData, isLoading } = useGetArtworksQuery({ page: 1, pageSize: 20 });

  // Update Redux state when data changes
  useEffect(() => {
    if (artworksData?.data) {
      dispatch(setFeedArtworks(artworksData.data));
    }
  }, [artworksData, dispatch]);



  // Interactive functions
  const handleExploreClick = () => {
    navigate('/ArtworkFeed');
    dispatch(addNotification({
      type: 'info',
      message: 'Exploring amazing street art!',
      duration: 3000
    }));
  };

  const handleSignupClick = () => {
    navigate('/IndexSignup');
    dispatch(addNotification({
      type: 'success',
      message: 'Join our creative community!',
      duration: 3000
    }));
  };

  const handleDiscountClose = () => {
    setDiscountVisible(false);
    dispatch(addNotification({
      type: 'info',
      message: 'Discount offer dismissed',
      duration: 2000
    }));
  };

  // Modern Interactive Hero Component with Smooth Micro-interactions
  const Hero = () => (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY} animate-fade-in`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
        {/* Modern Closeable Discount Banner */}
        {discountVisible && (
          <div className="flex flex-row items-center justify-between py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <div className="flex items-center">
              <img src={discount} alt="discount" className="w-[32px] h-[32px] transition-transform duration-300 hover:rotate-12" />
              <p className={`${styles.paragraph} ml-2`}>
                <span className="text-white font-bold">20%</span> Discount For{" "}
                <span className="text-white font-bold">1 Month</span> Account
              </p>
            </div>
            <button
              onClick={handleDiscountClose}
              className="text-white hover:text-red-300 ml-4 text-xl font-bold cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Close discount offer"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-raleway font-bold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px] animate-slide-in-left">
            Welcome To<br className="sm:block hidden" /> {" "}
            <span className="text-gradient font-blowBrush hover:animate-pulse transition-all duration-300 cursor-default">ArtZoro App</span> <br/> {" "}
            <span className="hover:text-gradient transition-all duration-500 cursor-default">MuralFinder.</span>
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0 transform transition-all duration-300 hover:scale-105">
            <GetStarted />
          </div>
        </div>

        <p className={`${styles.paragraph} max-w-[470px] mt-5 animate-slide-in-left animation-delay-200 opacity-90 hover:opacity-100 transition-opacity duration-300`}>
          A platform that connects the urban art community worldwide and allows artists to explore new terrain and expand their creative talents easily all
          the while meeting new people and sharing new experiences with fellow artists.
        </p>

        {/* Modern Action Buttons with Micro-interactions */}
        <div className="flex flex-row justify-start items-center mt-6 space-x-4 animate-slide-in-left animation-delay-400">
          {/* Google Play Button with Modern Hover */}
          <img
            src={google}
            alt="googleplay"
            className="w-[100px] h-auto object-contain cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            onClick={() => {
              dispatch(addNotification({
                type: 'info',
                message: 'Google Play Store coming soon!',
                duration: 3000
              }));
            }}
          />

          {/* Modern Signup Button */}
          {!isAuthenticated && (
            <button
              onClick={handleSignupClick}
              className={`py-2 px-6 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 transform ${styles}`}
            >
              Join Now
            </button>
          )}

          {/* Modern Explore Button */}
          <button
            onClick={handleExploreClick}
            className="py-2 px-6 border-2 border-blue-gradient text-white font-raleway font-bold text-[16px] outline-none uppercase rounded-lg transition-all duration-300 hover:bg-blue-gradient hover:text-primary hover:scale-105 hover:shadow-lg active:scale-95 transform"
          >
            Explore Art
          </button>
        </div>

        {/* Modern Loading State */}
        {isLoading && (
          <div className="flex items-center mt-4 text-white animate-fade-in">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span className="font-raleway text-sm animate-pulse">Loading amazing artworks...</span>
          </div>
        )}

        {/* Modern Live Artwork Count */}
        {artworksData?.pagination?.total && (
          <div className="mt-4 text-white font-raleway animate-fade-in hover:scale-105 transition-transform duration-300 cursor-pointer"
               onClick={() => dispatch(addNotification({ type: 'success', message: 'Live data updated!', duration: 2000 }))}>
            <span className="text-gradient font-bold text-lg animate-pulse">{artworksData.pagination.total}+</span>
            <span className="ml-2">artworks available</span>
          </div>
        )}
      </div>

      {/* Modern Image Section with Subtle Interactions */}
      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative group animate-slide-in-right`}>
        <img
          src={Interlinked}
          alt="interlinked"
          className="w-[100%] h-auto relative z-[5] p-8 md:px-20 sm:px-26 ss:px-20 cursor-pointer transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
          onClick={() => {
            dispatch(addNotification({
              type: 'success',
              message: 'Welcome to the art community!',
              duration: 3000
            }));
          }}
        />

        {/* Modern Gradient Backgrounds with Subtle Animation */}
        <div className="absolute z-[0] w-[40%] h-[35%] bottom-0 rounded-full pink__gradient transition-all duration-700 group-hover:scale-110"/>
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-8 white__gradient transition-all duration-700 group-hover:scale-105 opacity-20 group-hover:opacity-30"/>
        <div className="absolute z-[0] w-[50%] h-[50%] bottom-6 blue__gradient transition-all duration-700 group-hover:scale-110"/>

        {/* Modern Floating Accent Elements */}
        <div className="absolute top-10 right-10 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-20 left-10 w-2 h-2 bg-pink-400 rounded-full opacity-40 animate-pulse"></div>
      </div>
    </section>
  );

  // Modern Interactive Stats Component with Smooth Animations
  const Stats = () => (
    <section className={`${styles.flexCenter} flex-row flex-wrap sm:mb-20 mb-6 animate-fade-in-up animation-delay-600`}>
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="flex-1 flex justify-start items-center flex-row m-3 p-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg cursor-pointer group transform"
          style={{ animationDelay: `${800 + index * 100}ms` }}
          onClick={() => {
            dispatch(addNotification({
              type: 'info',
              message: `${stat.value} ${stat.title} and counting!`,
              duration: 3000
            }));
          }}
        >
          <h4 className="font-raleway font-bold xs:text-[40px] text-[30px] xs:leading-[53px] leading-[43px] text-white group-hover:text-gradient transition-all duration-300">
            {stat.value}
          </h4>
          <p className="font-raleway font-semibold xs:text-[20px] text-[15px] xs:leading-[26px] leading-[21px] text-gradient uppercase ml-3 group-hover:text-white transition-all duration-300">
            {stat.title}
          </p>

          {/* Modern Hover Indicator */}
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            {stat.title.toLowerCase().includes('user') && '👥'}
            {stat.title.toLowerCase().includes('artwork') && '🎨'}
            {stat.title.toLowerCase().includes('transaction') && '💰'}
            {stat.title.toLowerCase().includes('company') && '🏢'}
            {!stat.title.toLowerCase().includes('user') &&
             !stat.title.toLowerCase().includes('artwork') &&
             !stat.title.toLowerCase().includes('transaction') &&
             !stat.title.toLowerCase().includes('company') && '📊'}
          </div>
        </div>
      ))}

      {/* Modern Live artwork count from API */}
      {artworksData?.pagination?.total && (
        <div
          className="flex-1 flex justify-start items-center flex-row m-3 p-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg cursor-pointer group transform animate-pulse hover:animate-none"
          onClick={() => {
            dispatch(addNotification({
              type: 'success',
              message: 'Live data from our amazing community!',
              duration: 3000
            }));
          }}
        >
          <h4 className="font-raleway font-bold xs:text-[40px] text-[30px] xs:leading-[53px] leading-[43px] text-white group-hover:text-gradient transition-all duration-300">
            {artworksData.pagination.total}+
          </h4>
          <p className="font-raleway font-semibold xs:text-[20px] text-[15px] xs:leading-[26px] leading-[21px] text-gradient uppercase ml-3 group-hover:text-white transition-all duration-300">
            Live Artworks
          </p>
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            🔥
          </div>
        </div>
      )}
    </section>
  );

  // Modern Interactive Structure with Smooth Animations
  return (
    <>
      {/* Modern Hero Section with Subtle Background */}
      <div className={`bg-indigo-600 ${styles.flexStart} relative overflow-hidden`}>
        {/* Subtle Modern Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className={`${styles.boxWidth} relative z-10`}>
          <Hero />
        </div>
      </div>

      {/* Modern Main Content Section */}
      <div className={`bg-indigo-600 ${styles.paddingX} ${styles.flexCenter} relative`}>
        <div className={`${styles.boxWidth}`}>
          <Stats />

          {/* Modern Business Section */}
          <div className="transform transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-1000">
            <Business />
          </div>

          {/* Modern Billing Section */}
          <div className="transform transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-1200">
            <Billing />
          </div>

          {/* Modern Adverts Section */}
          <div className="transform transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-1400">
            <Adverts />
          </div>

          {/* Modern Interactive Carousel Section */}
          <div className="2xl:container 2xl:mx-auto 2xl:px-0 py-3 px-2 animate-fade-in-up animation-delay-1600">
            <div className="mb-4 text-center">
              <h2 className="font-raleway font-bold text-white text-2xl mb-2 hover:text-gradient transition-colors duration-300 cursor-default">
                🎨 Featured Artworks
              </h2>
              <p className="font-raleway text-dimWhite text-sm opacity-80 hover:opacity-100 transition-opacity duration-300">
                Discover amazing street art from our community
              </p>
            </div>

            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <Carousel />
            </div>

            {/* Modern See All Button */}
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleExploreClick}
                className={`py-3 px-8 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 transform ${styles} relative overflow-hidden group`}
              >
                <span className="relative z-10">See All Artworks</span>
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>

            {/* Modern Live Artwork Count */}
            {feedArtworks.length > 0 && (
              <div className="text-center mt-4 text-white font-raleway animate-fade-in hover:scale-105 transition-transform duration-300 cursor-pointer"
                   onClick={() => dispatch(addNotification({ type: 'info', message: `${feedArtworks.length} artworks ready to explore!`, duration: 3000 }))}>
                <span className="text-gradient font-bold animate-pulse">{feedArtworks.length}</span>
                <span className="ml-2">artworks loaded and ready</span>
              </div>
            )}
          </div>

          {/* Modern Upload Section */}
          <div className="transform transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-1800 my-8">
            <div className="text-center mb-4">
              <h2 className="font-raleway font-bold text-white text-2xl mb-2 hover:text-gradient transition-colors duration-300 cursor-default">
                📤 Share Your Art
              </h2>
              <p className="font-raleway text-dimWhite text-sm opacity-80 hover:opacity-100 transition-opacity duration-300">
                Upload and share your street art discoveries
              </p>
            </div>
            <DragDropImageUploader />
          </div>

          {/* Modern Card Deal Section */}
          <div className="transform transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-2000">
            <CardDeal />
          </div>

          {/* Modern Testimonials Section */}
          <div className="transform transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-2200">
            <Testimonials />
          </div>

          {/* Modern CTA Section */}
          <div className="transform transition-all duration-500 hover:scale-[1.01] animate-fade-in-up animation-delay-2400">
            <CTA />
          </div>

          <BackToTopButton />

          {/* Enhanced Floating Action Buttons with Original Colors */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
            {!isAuthenticated && (
              <div className="relative group">
                <button
                  onClick={handleSignupClick}
                  className="w-14 h-14 bg-blue-gradient rounded-full flex items-center justify-center text-primary font-raleway font-bold text-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in hover:rotate-180"
                  title="Join Community"
                >
                  <span className="transition-transform duration-300 group-hover:scale-125">+</span>
                </button>
                <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-lg text-sm font-raleway opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Join the Community!
                </div>
              </div>
            )}

            <div className="relative group">
              <button
                onClick={() => {
                  dispatch(addNotification({
                    type: 'info',
                    message: 'Need help? Contact our support team!',
                    duration: 3000
                  }));
                }}
                className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-raleway font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-12"
                title="Help & Support"
              >
                <span className="transition-transform duration-300 group-hover:scale-125">?</span>
              </button>
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-lg text-sm font-raleway opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Need Help?
              </div>
            </div>

            {/* Explore Button with Original Colors */}
            <div className="relative group">
              <button
                onClick={handleExploreClick}
                className="w-12 h-12 bg-blue-gradient rounded-full flex items-center justify-center text-primary font-raleway font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:-rotate-12"
                title="Explore Art"
              >
                <span className="text-lg transition-transform duration-300 group-hover:scale-125">🎨</span>
              </button>
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-lg text-sm font-raleway opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Explore Art
              </div>
            </div>
          </div>

          {/* Animated Background Elements with Original Colors */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-2 h-2 bg-secondary rounded-full opacity-60 animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-secondary rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-40 left-20 w-3 h-3 bg-secondary rounded-full opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-60 left-1/3 w-1 h-1 bg-secondary rounded-full opacity-50 animate-ping" style={{animationDelay: '3s'}}></div>
            <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-secondary rounded-full opacity-40 animate-pulse" style={{animationDelay: '4s'}}></div>
            <div className="absolute top-1/2 right-10 w-1 h-1 bg-secondary rounded-full opacity-30 animate-bounce" style={{animationDelay: '5s'}}></div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
