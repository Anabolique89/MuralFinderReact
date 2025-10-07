import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from './store/slices/authSlice';
import styles from '@styles';
import { Billing, Business, CardDeal, SearchBar, CTA, Navbar, Stats, Testimonials, Hero, DragDropImageUploader, SingleArtwork, Carousel,  MuiBottomNavigation, BackToTopButton, Adverts } from '@components';
import SearchPage from './pages/SearchPage';
import { ArtSupplies, Books, Materials, PosterPrints, Wallpapers } from '@components/ShopCategories';
import About from '@pages/public/About';
import Community from '@pages/public/Community';
import Profile from '@pages/user/Profile';
import PublicProfile from '@pages/user/PublicProfile';
import Map from '@pages/user/Map';
import Walls from '@pages/user/Walls';
import Onboarding1 from '@pages/auth/Onboarding1';
import Onboarding2 from '@pages/auth/Onboarding2';
import Onboarding3 from '@pages/auth/Onboarding3';
import Contact from '@pages/public/Contact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArtworkService from '@services/ArtworkService';
import SingleBlogPost from '@pages/blog/SingleBlogPost';
import ProfileSettings from '@pages/user/ProfileSettings';
import PrivacyPolicy from '@pages/legal/PrivacyPolicy';
import FAQS from '@pages/public/FAQS';
import TermsConditions from '@pages/legal/TermsConditions';
import ViewWall from '@pages/user/ViewWall';
import AddBlog from '@pages/blog/AddBlog';
import PrivateRoute from '@utils/PrivateRoute';
import Footer from '@components/Footer';
import EditBlog from '@pages/blog/EditBlog';
import EditArtworkUploader from '@pages/admin/EditArtworkUploader';
import ArtworkFeed from '@pages/user/ArtworkFeed';
import BlogPosts from '@pages/blog/BlogPosts';
import Feed from '@pages/user/Feed';
import Shop from '@pages/shop/Shop';
import AddWall from '@components/AddWall';
import ModernDashboard from '@pages/admin/ModernDashboard';
import ModernUsers from '@pages/admin/ModernUsers';
import ModernArtworks from '@pages/admin/ModernArtworks';
import ModernWalls from '@pages/admin/ModernWalls';
import ModernPosts from '@pages/admin/ModernPosts';
import ModernSettings from '@pages/admin/ModernSettings';
import Trash from '@pages/admin/Trash';
import AddUser from '@pages/admin/AddUser';
import AddArtwork from '@pages/admin/AddArtwork';
import AdminAddWall from '@pages/admin/AddWall';
import AddPost from '@pages/admin/AddPost';
import SubscriptionPlans from './pages/subscription/SubscriptionPlans';
import { ToastProvider } from './contexts/ToastContext';
import ArtworkDetails from '@pages/user/ArtworkDetails';
import Users from '@pages/admin/Users';
import EditUser from '@pages/admin/EditUser';
import EditWall from '@components/EditWall';
import UnsupportedAuth from '@components/Unsuported';

// Modern Pages - Updated Structure
import ModernHome from '@pages/ModernHome';
import ModernArtworkFeed from '@pages/user/ModernArtworkFeed';

// Auth Pages (organized)
import AuthLogin from '@pages/auth/Login';
import AuthSignup from '@pages/auth/Signup';

// User Pages (organized)
import UserProfile from '@pages/user/Profile';
import Product1Easel from '@pages/singleProduct/Product1Easel';
import AdminRoute from '@utils/AdminRoute';

// AI Pages
import DesignGenerator from '@pages/ai/DesignGenerator';



const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize authentication state from localStorage
    dispatch(loadUserFromStorage());
    
    ArtworkService.loadArtworks()
      .catch(err => {
        console.log(err);
      });
  }, [dispatch]); 

  // const showSearchBarRoutes = ['/', '/About']; // set the pages where the searchbar should be included.

  return (
    <ToastProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            backgroundColor: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
            fontFamily: 'Raleway, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            minWidth: '300px',
            maxWidth: '400px',
          }}
        />
      <Routes>
        {/* Admin Routes - No Navbar */}
        <Route path='/admin/dashboard' element={
          <AdminRoute>
            <ModernDashboard />
          </AdminRoute>
        }/>

        <Route path='/admin/users' element={
          <AdminRoute>
            <ModernUsers />
          </AdminRoute>
        }/>

        <Route path='/admin/artworks' element={
          <AdminRoute>
            <ModernArtworks />
          </AdminRoute>
        }/>

        <Route path='/admin/walls' element={
          <AdminRoute>
            <ModernWalls />
          </AdminRoute>
        }/>

        <Route path='/admin/posts' element={
          <AdminRoute>
            <ModernPosts />
          </AdminRoute>
        }/>

        <Route path='/admin/settings' element={
          <AdminRoute>
            <ModernSettings />
          </AdminRoute>
        }/>

        <Route path='/admin/trash' element={
          <AdminRoute>
            <Trash />
          </AdminRoute>
        }/>

        <Route path='/admin/users/add' element={
          <AdminRoute>
            <AddUser />
          </AdminRoute>
        }/>

        <Route path='/admin/artworks/add' element={
          <AdminRoute>
            <AddArtwork />
          </AdminRoute>
        }/>

        <Route path='/admin/walls/add' element={
          <AdminRoute>
            <AdminAddWall />
          </AdminRoute>
        }/>

        <Route path='/admin/posts/add' element={
          <AdminRoute>
            <AddPost />
          </AdminRoute>
        }/>

        {/* Main App Routes - With Navbar */}
        <Route path="*" element={
          <div className="bg-indigo-600 w-full overflow-hidden">
            <div className={`${styles.paddingX} ${styles.flexCenter}`}>
              <div className={`${styles.boxWidth}`}>
                <Navbar />
              </div>
            </div>
            <Routes>
          <Route path="/" element={<ModernHome />} />
          <Route path="/legacy-home" element={
            <>
              <div className={`bg-indigo-600 ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                  <Hero />
                </div>
              </div>
              <div className={`bg-indigo-600 ${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Stats />
                  <Business />
                  <Billing />
                  <Adverts />
                  <div className="2xl:container 2xl:mx-auto 2xl:px-0 py-3 px-2">
                    <Carousel />
                    <button type="button" className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full ${styles}`}><Link to={'/ArtworkFeed'} >See All</Link></button>
                  </div>

                  <DragDropImageUploader />

                  <CardDeal />
                  <Testimonials />

                  <CTA />

                  <BackToTopButton />
                  <Footer />
                </div>
              </div>
            </>
          } />
          <Route path="/About" element={<About />} />
          <Route path="/Community" element={<Community />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/Map" element={<Map />} />
          <Route path="/Walls" element={<Walls />} />
          <Route path="/Login" element={<AuthLogin />} />
          <Route path="/Signup" element={<AuthSignup />} />

          {/* Modern Routes */}
          <Route path="/modern-home" element={<ModernHome />} />
          <Route path="/modern-login" element={<AuthLogin />} />
          <Route path="/modern-signup" element={<AuthSignup />} />
          <Route path="/modern-profile" element={<UserProfile />} />
          <Route path="/modern-artworks" element={<ModernArtworkFeed />} />

          {/* Updated Routes - Using Modern Components */}
          <Route path="/artworks" element={<ModernArtworkFeed />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/upload" element={<DragDropImageUploader />} />
          
          {/* AI Generator Routes */}
          <Route path="/ai-generator" element={<DesignGenerator />} />
          <Route path="/forge-saga" element={<DesignGenerator />} />
          <Route path="/design-generator" element={<DesignGenerator />} />
          
          {/* Subscription Routes */}
          <Route path="/subscription" element={<SubscriptionPlans />} />
          <Route path="/plans" element={<SubscriptionPlans />} />
          <Route path="/pricing" element={<SubscriptionPlans />} />
          <Route path="/Onboarding2" element={<Onboarding2 />} />
          <Route path="/Onboarding3" element={<Onboarding3 />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/blog/:postId" element={<SingleBlogPost />} />
          <Route path="/ProfileSettings" element={<ProfileSettings />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsConditions" element={<TermsConditions />} />
          <Route path="/ArtworkDetails" element={<ArtworkDetails />} />
          <Route path="/Trash" element={<Trash />} />
          <Route path="/Users" element={<Users />} />
          <Route path="/FAQS" element={<FAQS />} />
          <Route path="/addWall" element={<AddWall />} />
          <Route path="/ArtworkFeed" element={<ArtworkFeed />} />
          <Route path="/BlogPosts" element={<BlogPosts />} />
          <Route path="/Feed" element={<Feed />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/Wallpapers" element={<Wallpapers />} />
          <Route path="/PosterPrints" element={<PosterPrints />} />
          <Route path="/Materials" element={<Materials />} />
          <Route path="/Books" element={<Books />} />
          <Route path="/Easel1" element={<Product1Easel/>} />
          <Route path="/ArtSupplies" element={<ArtSupplies />} />
          <Route path="/wall/:wallId" element={<ViewWall />} />
          <Route path="/artworks/:artworkId" element={<SingleArtwork />} />

          <Route path="/unsupported" element={<UnsupportedAuth />} />
          <Route path="/blog/create" element={
            <PrivateRoute>
              <AddBlog />
            </PrivateRoute>
          } />
          <Route path="/blog/edit/:blogId" element={
            <PrivateRoute>
              <EditBlog />
            </PrivateRoute>
          } />
          <Route path="/artwork/edit/:artworkId" element={
            <PrivateRoute>
              <EditArtworkUploader />
            </PrivateRoute>
          } />

          <Route path="/walls/edit/:wallId" element={
            <PrivateRoute>
              <EditWall />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/ProfileSettings" element={
            <PrivateRoute>
              <ProfileSettings />
            </PrivateRoute>
          } />

          <Route path="/edit-user/:id" element={
            <PrivateRoute>
              <EditUser />
            </PrivateRoute>
          } />

          {/* Legacy admin routes for backward compatibility */}
          <Route path='/dashboard' element={
            <AdminRoute>
              <ModernDashboard />
            </AdminRoute>
          }/>



            </Routes>
          </div>
        } />
      </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;