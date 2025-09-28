import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from '@styles';
import { ArtZoroLogoWhite } from '@assets';
import { footerLinks } from '../constants';
import { addNotification } from '@store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';

const WebFooter = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      dispatch(addNotification({
        type: 'success',
        message: 'Thank you for subscribing to our newsletter!',
        duration: 3000
      }));
      setEmail('');
    }
  };

  const handleSocialClick = (platform) => {
    dispatch(addNotification({
      type: 'info',
      message: `Opening ${platform}...`,
      duration: 2000
    }));
  };

  return (
    <section className={`${styles.flexCenter} ${styles.paddingY} flex-col relative overflow-hidden`}>
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
        {/* Brand Section */}
        <div className='flex-1 flex flex-col justify-start mr-10 mb-8 md:mb-0'>
          <Link to="/" className="hover:scale-105 transition-transform duration-300 inline-block">
            <img src={ArtZoroLogoWhite} alt="ArtZoro" className='w-[80px] h-[72px] object-contain' />
          </Link>
          <p className={`${styles.paragraph} mt-4 max-w-[310px] hover:text-white transition-colors duration-300`}>
            Explore new terrain and expand your creativity with ease. Join the global street art community.
          </p>

          {/* Newsletter Signup */}
          <div className="mt-6">
            <h4 className="font-raleway font-bold text-white text-[16px] mb-3">
              Stay Updated
            </h4>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 outline-none focus:border-blue-400 transition-colors duration-300"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-gradient text-primary font-raleway font-bold rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Social Media */}
          <div className="mt-6">
            <h4 className="font-raleway font-bold text-white text-[16px] mb-3">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => handleSocialClick(platform)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-gradient hover:scale-110 transition-all duration-300"
                  title={platform}
                >
                  <span className="text-white text-sm font-bold">
                    {platform.charAt(0)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className='flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10'>
          {footerLinks.map((footerLink) => (
            <div key={uuidv4()} className='flex flex-col ss:my-0 my-4 min-w-[150px]'>
              <h4 className='font-raleway font-bold text-[18px] leading-[27px] text-white mb-4 hover:text-gradient transition-colors duration-300 cursor-default'>
                {footerLink.title}
              </h4>
              <ul className="space-y-2">
                {footerLink.links.map((link) => (
                  <li key={uuidv4()}>
                    <Link
                      to={link.link}
                      className="font-raleway font-normal text-[16px] leading-[24px] text-dimWhite hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer block"
                      onClick={() => {
                        dispatch(addNotification({
                          type: 'info',
                          message: `Navigating to ${link.name}`,
                          duration: 2000
                        }));
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className='flex flex-col items-start w-full relative z-10'>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          <p className="font-raleway font-normal text-dimWhite text-[14px] leading-[24.8px] max-w-4xl">
            <span className="font-raleway font-bold text-orange-400 text-[16px] leading-[32.8px] hover:text-orange-300 transition-colors duration-300">
              Disclaimer! <br />
            </span>
            All graffiti & street art spots in this legal wall directory are contributed by users.
            Information you find here may be incorrect or outdated.
            Always verify the legality of graffiti walls with local authorities before painting.
            We do not take responsibility for any illegal activities performed based on the information on this site.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
            <Link
              to="/terms"
              className="text-dimWhite hover:text-white text-sm transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              className="text-dimWhite hover:text-white text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full text-center mt-6 pt-4 border-t border-white/10">
          <p className="text-dimWhite text-sm">
            © 2024 ArtZoro MuralFinder. All rights reserved. Made with ❤️ for the street art community.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
};

export default WebFooter;
