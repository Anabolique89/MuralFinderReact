import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import AddWall from '../../components/AddWall';

const AdminAddWall = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Add New Wall</h1>
          <p className="text-gray-600 font-raleway mt-1">Register a new wall location</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <AddWall />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddWall;
