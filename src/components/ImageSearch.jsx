import React, { useState } from 'react';
import styles from '../style';

const ImageSearch = ({ searchText, page, pageSize, onPageChange, onPageSizeChange }) => {
    const [text, setText] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        searchText(text);
    };

    return (
        <div className='max-w-sm rounded overflow-hidden my-10 mx-auto'>
            <form onSubmit={onSubmit} className="w-full max-w-sm">
                <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
                    <input onChange={e => setText(e.target.value)} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Search Image Term..." />
                    <button className={`py-2 px-4 bg-blue-gradient font-raleway font-bold text-[18px] text-primary outline-none uppercase rounded-full ${styles}`} type="submit">
                        Search
                    </button>
                </div>
            </form>
            <div className="flex justify-between mt-4">
                <select className="appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" onChange={(e) => onPageSizeChange(e.target.value)} value={pageSize}>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="30">30 per page</option>
                </select>
                <input type="number" min="1" className="appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" placeholder="Page" value={page} onChange={(e) => onPageChange(parseInt(e.target.value))} />
            </div>
        </div>
    );
};

export default ImageSearch;
