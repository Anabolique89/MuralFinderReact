import React, { useState } from 'react';
import LocationPicker from './LocationPicker';

const AddWall = () => {
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState('');

    const handleLocationSelect = (selectedLocation) => {
        setLocation(selectedLocation);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = () => {
        // You can perform your submission logic here, such as sending the data to the server
        console.log('Location:', location);
        console.log('Description:', description);
    };

    return (
        <div className="w-full md:w-3/4 mx-auto mt-8 p-5 bg-white rounded-lg shadow-lg">
             <h2 className="text-2xl font-bold mb-4">Add a New Wall</h2>
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea id="description" value={description} onChange={handleDescriptionChange} className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"></textarea>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Location:</label>
                <LocationPicker onSelectLocation={handleLocationSelect} />
            </div>
            <button onClick={handleSubmit} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Submit</button>
        </div>
    );
};

export default AddWall;
