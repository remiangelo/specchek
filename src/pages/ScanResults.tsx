import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CpuChipIcon, DevicePhoneMobileIcon, ServerIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useSystemInfo } from '../hooks/useSystemInfo';

const ScanResults = () => {
  console.log('ScanResults component rendered');
  const navigate = useNavigate();
  const { systemSpecs, isLoading, error, scanSystem } = useSystemInfo();

  // Trigger hardware scan when component mounts
  useEffect(() => {
    console.log('ScanResults useEffect - triggering scan');
    scanSystem();
  }, [scanSystem]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Scanning Your Hardware...</h1>
        <div className="animate-pulse flex flex-col items-center">
          <CpuChipIcon className="h-16 w-16 text-brutalist-accent mb-4" />
          <p className="text-xl">Please wait while we analyze your system</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !systemSpecs) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold mb-8 text-red-500">Scan Failed</h1>
        <div className="brutal-card p-6 mb-8">
          <p className="text-xl mb-4">We couldn't scan your hardware properly.</p>
          <p className="mb-8">This could be due to browser security restrictions or privacy settings.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => scanSystem()} 
              className="brutal-btn-accent"
            >
              Try Again
            </button>
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
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your System Results
      </h1>
      
      <div className="brutal-card p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Hardware Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPU */}
          <div className="brutal-border p-4 bg-white">
            <div className="flex items-center mb-4">
              <CpuChipIcon className="h-6 w-6 mr-2 text-brutalist-accent" />
              <h3 className="text-xl font-bold">CPU</h3>
            </div>
            <div className="font-mono space-y-2">
              <p>Logical Cores: {systemSpecs.cpu.cores}</p>
              <p className="text-sm text-gray-500">
                Note: CPU model name cannot be detected in browser environment
              </p>
            </div>
          </div>
          
          {/* GPU */}
          <div className="brutal-border p-4 bg-white">
            <div className="flex items-center mb-4">
              <DevicePhoneMobileIcon className="h-6 w-6 mr-2 text-brutalist-accent" />
              <h3 className="text-xl font-bold">GPU</h3>
            </div>
            <div className="font-mono space-y-2">
              <p>Vendor: {systemSpecs.gpu.vendor}</p>
              <p>Renderer: {systemSpecs.gpu.renderer}</p>
            </div>
          </div>

          {/* Memory */}
          <div className="brutal-border p-4 bg-white">
            <div className="flex items-center mb-4">
              <ServerIcon className="h-6 w-6 mr-2 text-brutalist-accent" />
              <h3 className="text-xl font-bold">Memory</h3>
            </div>
            <div className="font-mono space-y-2">
              <p>Total RAM: {systemSpecs.memory.total}</p>
              <p className="text-sm text-gray-500">
                Note: Memory information is limited in browser environment
              </p>
            </div>
          </div>

          {/* OS & Browser */}
          <div className="brutal-border p-4 bg-white">
            <div className="flex items-center mb-4">
              <ComputerDesktopIcon className="h-6 w-6 mr-2 text-brutalist-accent" />
              <h3 className="text-xl font-bold">System</h3>
            </div>
            <div className="font-mono space-y-2">
              <p>OS: {systemSpecs.os.name} {systemSpecs.os.version}</p>
              <p>Platform: {systemSpecs.os.platform}</p>
              <p>Browser: {systemSpecs.browser.name} {systemSpecs.browser.version}</p>
            </div>
          </div>

          {/* Screen */}
          <div className="brutal-border p-4 bg-white md:col-span-2">
            <div className="flex items-center mb-4">
              <ComputerDesktopIcon className="h-6 w-6 mr-2 text-brutalist-accent" />
              <h3 className="text-xl font-bold">Display</h3>
            </div>
            <div className="font-mono space-y-2">
              <p>Resolution: {systemSpecs.screen.width}x{systemSpecs.screen.height}</p>
              <p>Color Depth: {systemSpecs.screen.colorDepth} bit</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-500">Note: Due to browser security restrictions, hardware information is limited.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => scanSystem()} 
              className="brutal-btn-accent"
            >
              Rescan System
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="brutal-btn-secondary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResults; 