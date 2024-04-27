import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BlogService from '../services/BlogService';
import { faEye, faThumbsUp, faComment, faUser } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import { cleanHTML, trimContent } from '../utils/blogUtils';

const CommunityBlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await BlogService.getAllBlogPosts();
        setBlogPosts(response);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  

  return (
    <div className="bg-indigo-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">From the blog</h2>
          <p className="mt-2 text-lg leading-8 text-white">
            Explore our latest blog posts covering a variety of topics.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {loading ? (
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-white" />
              <p className="mt-4 text-white">Loading...</p>
            </div>
          ) : (
            blogPosts.map(blogPost => (
              <div key={blogPost.id} to={`/blog/${blogPost.id}`} className="flex flex-col items-start justify-between bg-white rounded-md shadow-md p-6 hover:bg-gray-100 transition duration-300">

                {blogPost.feature_image ? (
                  <img
                    src={`https://api.muralfinder.net/${blogPost.feature_image}`}
                    alt={blogPost.title}
                    className="w-full h-48 mb-4 rounded-md"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-32 mb-4 rounded-md"></div>
                )}
                <div>
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                    <Link to={`/blog/${blogPost.id}`} className="hover:text-blue-500">{blogPost.title}</Link>
                  </h3>
                  <p className="mt-2 text-gray-600">
                    <p>
                      <div dangerouslySetInnerHTML={{ __html: cleanHTML(trimContent(blogPost.content, 100)) }} />
                    </p>
                  </p>
                </div>
                <div className="flex items-center mt-4">
                  <div className="flex items-center mr-4 text-gray-600">
                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                    <span>{blogPost.views}</span>
                  </div>
                  <div className="flex items-center mr-4 text-gray-600">
                    <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                    <span>{blogPost.likes_count}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faComment} className="mr-1" />
                    <span>{blogPost.comments_count}</span>
                  </div>
                </div>

                <div className="flex items-center mt-4 text-gray-600">
                  <a href={`/profile/${blogPost.user.id}`}> {/* Profile link */}
                    <FontAwesomeIcon icon={faUser} className="h-8 w-8 rounded-full mr-2 bg-gray-200 p-1" />
                  </a>
                  <div>
                    <p className="font-semibold">{blogPost.user.username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                    <p>{blogPost.user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                  </div>
                </div>
              </div>

            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityBlogSection;
