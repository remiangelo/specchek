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
        Find out if your computer can run the latest games with our hardware scanner.
      </p>
      <div className="brutal-card w-full max-w-2xl mb-12 p-8">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li className="text-lg">Click the "Scan My PC" button to analyze your hardware</li>
          <li className="text-lg">We'll check your CPU, GPU, RAM, and storage</li>
          <li className="text-lg">Get results showing which games you can run</li>
        </ol>
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={() => navigate('/results')}
            className="brutal-btn-accent flex items-center justify-center w-64 py-4 text-lg"
          >
            <CpuChipIcon className="h-6 w-6 mr-2" />
            Scan My PC
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