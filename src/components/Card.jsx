import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="bg-indigo-600 rounded-lg shadow-md p-4">
      {children}
    </div>
  );
};

export default Card;
