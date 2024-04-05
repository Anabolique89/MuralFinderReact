import React from 'react';
import styles from '../style';
import AuthService from '../services/AuthService';

const DragDropImageUploader = () => {
  const isAuthenticated = AuthService.isAuthenticated();
  return (
    <div className="flex flex-col w-full border border-gray-600 rounded-md mt-3">
      <div className="w-full p-4 text-center text-white ">
        <h2 className="font-bold text-lg mb-2">Have an artwork you'd like to show to the world?</h2>

      </div>
      <div className="flex flex-col md:flex-row">
        {isAuthenticated ? (
          <>
            <section className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-gray-300">
              <div className="flex justify-center items-center h-full text-center">
                <div className="w-full p-2 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-400 focus:outline-none cta-block">
                  <p className="font-raleway font-normal text-[18px] leading-[32px] text-white my-5 p-4">Drag & Drop Artwork Upload</p>
                  <div className="drag-area p-2">
                    <span className="max-w-[470px] m-4 select">Drop image here</span><br />
                    Drag & drop image here or <span className="select">Browse</span>
                    <input name="file" type="file" className="" />
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full md:w-1/2 px-4">
              <div className="flex flex-col justify-center items-center mt-5">
                <input name="title" type="text" placeholder="Artwork Title..." className="input-text w-full p-4 rounded mb-4 border border-gray-300" required />
                <textarea name="description" type="text" placeholder="Artwork Description..." className="input-text w-full p-4 rounded border border-gray-300" />
                <button type="submit" className="my-7 py-2 px-4 text-white w-full p-4 rounded border border-blue-300">Submit</button>
              </div>
            </section>
          </>
        ) : (
          <div className="w-full p-4 text-center text-white">
            <p>Login to add your artworks.</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropImageUploader;
