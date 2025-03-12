import { useNavigate } from 'react-router-dom';
import { CpuChipIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Home = () => {
  console.log('Home component rendered');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold mb-6">
        SPEC<span className="text-brutalist-accent">CHEK</span>
      </h1>
      <p className="text-xl max-w-2xl mx-auto mb-8 text-center">
        Find out what hardware your browser can detect with our real-time system scanner.
      </p>
      <div className="brutal-card w-full max-w-2xl mb-12 p-8">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li className="text-lg">Click the "Scan My Hardware" button to analyze your system</li>
          <li className="text-lg">We'll use browser APIs to detect your GPU, CPU cores, memory, and more</li>
          <li className="text-lg">View your real hardware information in a clean, easy-to-read format</li>
        </ol>
        <div className="mt-6 p-4 bg-yellow-50 brutal-border">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Due to browser security restrictions, some hardware details (like exact CPU model) may be limited. 
            We use WebGL and other browser APIs to gather as much information as possible.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={() => navigate('/results')}
            className="brutal-btn-accent flex items-center justify-center w-64 py-4 text-lg"
          >
            <CpuChipIcon className="h-6 w-6 mr-2" />
            Scan My Hardware
          </button>
        </div>
      </div>
      <button
        onClick={() => navigate('/games')}
        className="brutal-btn flex items-center"
      >
        Browse Game Library
        <ArrowRightIcon className="h-5 w-5 ml-2" />
      </button>
    </div>
  );
};

export default Home; 