import { useState, useEffect } from 'react';
import styles from '../style';
import { defaultimg, } from '../assets';
import AuthService from '../services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import BlogService from '../services/BlogService';
import { Link } from 'react-router-dom';


const Stories = () => {

    const [blogData, setBlogData] = useState(null);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        const fetchBlogsByUser = async () => {
            try {
                const user = AuthService.getUser();
                // console.log(user)
                const data = await BlogService.getBlogPostByUserId(user.id)
                setBlogData(data.data)
            } catch (error) {
                setError(error.message);
            }
        }

        fetchBlogsByUser();
    }, []);


    return (
        <div className='lg:max-w-full md:mx-w-[70] sm:max-w-full max-w-full w-full h-auto flex items-center gap-x-3.5 overflow-x-scroll scrollbar-thin'>


            <div className='highlights flex flex-column mb-4 mt-2 w-full overflow-x-auto scrollbar-thin scrollbar-webkit'>
                {!blogData ? (
                    // Display spinners while blog data is being fetched
                    <div className="flex justify-center ">
                        {[...Array(3)].map((_, index) => (
                            <FontAwesomeIcon key={index} icon={faSpinner} className="text-gray-400 animate-spin mr-4" />
                        ))}
                    </div>
                ) : (
                    // Display blog images once data is fetched
                    blogData.map(blog => (
                        <Link key={blog.id} to={`/blog/${blog.id}`} className="hover:text-orange-400 font-raleway font-semibold text-dimWhite text-[18px] leading-[30.8px] uppercase">
                            <img
                                key={blog.id}
                                src={blog.feature_image ? `https://api.muralfinder.net/${blog.feature_image}` : defaultimg}
                                alt={`Blog Image ${blog.id}`}
                                className='object-cover highlight sm:mr-2 md:mr-4 mr-6 z-[20]'
                            />
                        </Link>
                    ))
                )}
            </div>

        </div>
    )
}

export default Stories