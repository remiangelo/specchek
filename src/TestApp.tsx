import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">SpecChek Test</h1>
      <p className="mb-4">This is a test component to verify React rendering.</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Test Button
      </button>
    </div>
  );
};

export default TestApp; 