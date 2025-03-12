import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CpuChipIcon } from '@heroicons/react/24/outline';

const ScanResults = () => {
  console.log('ScanResults component rendered');
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your System Results
      </h1>
      
      <div className="brutal-card p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Mock System Specs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="brutal-border p-4 bg-white">
            <div className="flex items-center mb-4">
              <CpuChipIcon className="h-6 w-6 mr-2 text-brutalist-accent" />
              <h3 className="text-xl font-bold">CPU</h3>
            </div>
            <p className="font-mono">Intel Core i7-10700K</p>
          </div>
          
          <div className="brutal-border p-4 bg-white">
            <div className="flex items-center mb-4">
              <CpuChipIcon className="h-6 w-6 mr-2 text-brutalist-accent" />
              <h3 className="text-xl font-bold">GPU</h3>
            </div>
            <p className="font-mono">NVIDIA GeForce RTX 3070</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="brutal-btn-secondary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResults; 