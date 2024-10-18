import { useEffect, useState } from 'react';
import { Stories } from '../components';
import styles from '../style';
import AuthService from '../services/AuthService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { defaultimg } from '../assets';
import DashboardService from '../services/DashboardService';
import UsersData from '../components/UsersData';
import UngroupedArtworks from '../components/UngroupedArtworks';
// import { UserTable } from './Dashboard';


const Feed = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    users: [],
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = AuthService.getUser();
        const data = await AuthService.getProfile(user.id);

        if (data.length > 1) {
          setProfileData(data[0])
        } else {
          setProfileData(data);

        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };



    fetchProfileData();

  }, [profileData]);


  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await DashboardService.getDashboardData();
        setStatistics(data);
      } catch (error) {
        console.error('There was an error fetching the statistics!', error);
      }
    };

    loadStatistics();
    console.log(statistics, 'statistics')
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-200 text-4xl mr-2" style={{ fontSize: '2rem' }} />
        <span className="text-gray-200 text-xl">...</span>
      </div>

    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Render error message
  }
  return (
    <>


      <div className='container mx-auto py-8'>
        <div className='grid grid-cols-4 sm:grid-cols-12 gap-6 px-4'>
          <div className='col-span-4 sm:col-span-3 hidden sm:block'>
            <div className="bg-white profile-content p-6 ">
              <div className="flex flex-col items-center object-cover">
                <img
                  src={(profileData.profile.profile_image_url ? `https://api.muralfinder.net/${profileData.profile.profile_image_url}` : defaultimg)}
                  className="object-cover w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 profile-info-img"
                  alt="Bordered avatar"
                />
                <h1 className="text-xl username-name">{profileData.username}</h1>
                <p className={`${styles.paragraph} mt-0 text-center`}><br />{profileData.profile.bio}</p>
                <p className={`${styles.paragraph} mt-0`}><br />{profileData.profile.proffession}</p>
                <p className={`${styles.paragraph} mt-0`}><br />{profileData.profile.location}</p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                  {/* <a href="#" className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] text-primary outline-none uppercase rounded-full ${styles}`}>FOLLOW</a> */}
                </div>
              </div>
              <hr className="my-6 border-t border-gray-300"></hr>
              <div className="flex flex-col">
                <span className="text-white uppercase font-bold tracking-wider mb-2">Details</span>
                <ul>
                  <li className={`${styles.paragraph} mt-2 mb-2`}>FOLLOWERS <span className='followers'>{profileData.followers_count}</span></li>
                  <li className={`${styles.paragraph}  mb-2`}>FOLLOWING <span className='following'>{profileData.followings_count}</span></li>
                  {/* <li className={`${styles.paragraph}  mb-4`}>REVIEWS <span className='reviews'>5</span></li> */}
                </ul>
                {/* social media icons */}
                <div className="flex justify-center items-center gap-6 my-6">

                  <a className="text-purple-950 hover:text-orange-600" aria-label="Visit TrendyMinds Facebook" href=""
                    target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-6">
                      <path fill="currentColor"
                        d="m279.14 288 14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z">
                      </path>
                    </svg>
                  </a>
                  <a className="text-purple-950 hover:text-orange-600" aria-label="Visit TrendyMinds Instagram" href=""
                    target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6">
                      <path fill="currentColor"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z">
                      </path>
                    </svg>
                  </a>
                  <a className="text-purple-950 hover:text-orange-600" aria-label="Visit TrendyMinds X" href=""
                    target="_blank">
                    <svg className="hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                      </path>
                    </svg>
                    <svg className='h-6' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
                      <path fill="currentColor" d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <a href="/ProfileSettings" className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[16px] sm:text-[14px] xs:text-[12px] text-primary outline-none uppercase rounded-full ${styles}`}>PROFILE SETTINGS</a>
              </div>
            </div>
          </div>
          <div className='col-span-4 sm:col-span-6'>
            < Stories />
            <UngroupedArtworks />


          </div>
          <div className='col-span-4 sm:col-span-3'>
            {/* <UserTable users={statistics.users} /> */}
            <UsersData />

          </div>
        </div>

      </div >

    </>
  )
}

export default Feed