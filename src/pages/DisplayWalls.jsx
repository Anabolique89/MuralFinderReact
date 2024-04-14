import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import MapForWall from './MapForWall';
import WallService from '../services/WallService';

const DisplayWalls = () => {
  const [walls, setWalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWallsFromDatabase();
  }, []);

  const fetchWallsFromDatabase = async () => {
    try {
      const response = await WallService.getAllWalls();
      if (response.success) {
        console.log(response.data.data)
        setWalls(response.data.data);
      } else {
        console.error('Error fetching walls:', response.message);
      }
    } catch (error) {
      console.error('Error fetching walls:', error);
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <section className='bg-indigo-700 w-full overflow-hidden'>
      {isLoading ? (
        <div className='flex justify-center items-center h-screen'>
          <FontAwesomeIcon icon={faSpinner} spin size='4px' />
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center'>
          {walls.map(wall => (
            <div key={wall.id} className='m-4'>
              <h2>{wall.location_text}</h2>
              <p>{wall.location_text}</p>
              <MapForWall lat={wall.latitude} long={wall.longitude} />
            </div>
          ))}
        </div>
      )}
      <div className='flex justify-center'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          View Full Map
        </button>
      </div>
    </section>
  );
};

export default DisplayWalls;
