import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import DragDropImageUploader from '../../components/DragDropImageUploader';

const AddArtwork = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Add New Artwork</h1>
          <p className="text-gray-600 font-raleway mt-1">Upload and create a new artwork entry</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <DragDropImageUploader />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddArtwork;
