import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon, 
  ArrowPathIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Progress, Checkbox } from '@nextui-org/react';
import { useSystemInfo } from '../hooks/useSystemInfo';

const HardwareScan = () => {
  const navigate = useNavigate();
  const [autoNavigate, setAutoNavigate] = useState(true);
  
  const { 
    specs, 
    isScanning, 
    error, 
    scanHardware,
    isScanningEnabled,
    toggleScanning
  } = useSystemInfo();

  // Auto-navigate to results when scan is complete if the option is enabled
  useEffect(() => {
    if (specs && autoNavigate && !isScanning) {
      const timer = setTimeout(() => {
        navigate('/results');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [specs, autoNavigate, isScanning, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Hardware Scanner
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Analyze your computer's performance and see what games you can play
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column - Scan Controls */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 h-full">
            <CardBody className="gap-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 mb-4 text-blue-600 dark:text-blue-500">
                  {isScanning ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <ArrowPathIcon className="w-full h-full" />
                    </motion.div>
                  ) : (
                    <CpuChipIcon className="w-full h-full" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">Hardware Detection</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Click the button below to analyze your hardware and measure performance
                </p>
              </div>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-300 text-center mb-6">
                  <p className="font-semibold">Error: Could not scan hardware</p>
                  <p className="text-sm mt-1">This could be due to browser restrictions or privacy settings.</p>
                </div>
              )}

              {isScanning ? (
                <div className="space-y-4">
                  <p className="text-center">Scanning your hardware...</p>
                  <Progress
                    size="md"
                    radius="sm"
                    isIndeterminate
                    classNames={{
                      indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
                    }}
                    aria-label="Scanning..."
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse text-center">
                    Accessing WebGL, browser APIs, and running benchmarks...
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full py-6"
                    startContent={<CpuChipIcon className="w-5 h-5" />}
                    onClick={() => scanHardware()}
                    disabled={!isScanningEnabled}
                  >
                    {specs ? 'Scan Again' : 'Start Hardware Scan'}
                  </Button>

                  <Checkbox
                    isSelected={autoNavigate}
                    onValueChange={setAutoNavigate}
                    className="mt-4"
                  >
                    Automatically view results after scan
                  </Checkbox>

                  {specs && (
                    <Button
                      color="secondary"
                      className="w-full mt-2"
                      onClick={() => navigate('/results')}
                    >
                      View Detailed Results
                    </Button>
                  )}

                  <div className="flex items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Checkbox
                      isSelected={isScanningEnabled}
                      onValueChange={toggleScanning}
                    >
                      Hardware scanning enabled
                    </Checkbox>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Right Column - Information */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardBody className="gap-6">
              <h2 className="text-2xl font-bold">What We Analyze</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <CpuChipIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">CPU Performance</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We analyze your processor speed and capabilities using JavaScript benchmarks
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">GPU Capabilities</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We detect your graphics card model and estimate its gaming performance tier
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <ComputerDesktopIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">System Info</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We check your available memory, operating system, and display properties
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Performance Score</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We calculate an overall performance score and compare it with game requirements
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Privacy Note</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  All hardware detection is performed locally in your browser. No data is sent to our servers.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>

      {/* Quick Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mt-6">
          <div className="flex-1 max-w-xs mx-auto">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Scan Hardware</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Click the scan button to analyze your system's performance
            </p>
          </div>
          
          <div className="flex-1 max-w-xs mx-auto">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">View Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get detailed information about your CPU, GPU, and other components
            </p>
          </div>
          
          <div className="flex-1 max-w-xs mx-auto">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Check Compatibility</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              See which games your system can run based on your hardware score
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HardwareScan; 