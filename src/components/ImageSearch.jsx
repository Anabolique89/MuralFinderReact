import React, { useState } from 'react';
import styles from '../style';

const ImageSearch = ({ searchText, page, pageSize, onPageChange, onPageSizeChange }) => {
    const [text, setText] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        searchText(text);
    };

    return (
        <div className='max-w-4xl mx-auto my-10 px-4'>
            <form onSubmit={onSubmit} className="w-full">
                <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                    <input 
                        onChange={e => setText(e.target.value)} 
                        className="appearance-none bg-transparent border-none w-full text-gray-700 py-3 px-6 leading-tight focus:outline-none" 
                        type="text" 
                        placeholder="Search Image Term..." 
                    />
                    <button 
                        className={`py-3 px-6 bg-blue-gradient font-raleway font-bold text-[18px] text-white outline-none uppercase transition-all duration-300 hover:opacity-90`} 
                        type="submit"
                    >
                        Search
                    </button>
                </div>
            </form>
            <div className="flex justify-between mt-6">
                <div className="relative">
                    <select 
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 transition-all duration-300"
                        onChange={(e) => onPageSizeChange(e.target.value)} 
                        value={pageSize}
                    >
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="30">30 per page</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>
                <div className="flex items-center">
                    <span className="mr-2 text-white">Page:</span>
                    <input 
                        type="number" 
                        min="1" 
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg leading-tight focus:outline-none focus:border-blue-500 transition-all duration-300 w-20"
                        placeholder="Page" 
                        value={page} 
                        onChange={(e) => onPageChange(parseInt(e.target.value))} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageSearch;