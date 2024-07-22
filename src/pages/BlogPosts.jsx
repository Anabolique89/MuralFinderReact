import React, { useState, useEffect } from 'react';
// import { blogEndpoints } from '../config/endpoints';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify'; 
import { CommunityBlogSection } from '../components';



const BlogPosts = () => {

  useEffect(() => {

    const cleanHTML = (content) => {
      return DOMPurify.sanitize(content); 
    };
    

  }, []);

  const trimContent = (content) => {
    return content.length > 100 ? `${content.substring(0, 20)}...` : content;
  };

  return (
    <div>
   <CommunityBlogSection />
    </div>
  );
};

export default BlogPosts;
