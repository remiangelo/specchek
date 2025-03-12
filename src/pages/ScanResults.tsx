import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CpuChipIcon, DevicePhoneMobileIcon, ServerIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { Button, Progress } from '@nextui-org/react';
import { useSystemInfo } from '../hooks/useSystemInfo';

// Animated card component
const AnimatedCard = ({ children, delay = 0, className = "" }: any) => (
  <motion.div
    className={`brutal-border p-4 bg-white relative overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: delay,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{
      boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)",
      transition: { duration: 0.2 }
    }}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brutalist-accent to-brutalist-secondary opacity-70" />
    <div className="relative z-10">{children}</div>
    <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-brutalist-secondary/5 rounded-full blur-2xl" />
  </motion.div>
);

// Card header component
const CardHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <motion.div 
    className="flex items-center mb-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-brutalist-accent to-brutalist-secondary rounded-full blur opacity-30" />
      <div className="relative">
        <Icon className="h-6 w-6 text-brutalist-accent" />
      </div>
    </div>
    <h3 className="text-xl font-bold ml-2">{title}</h3>
  </motion.div>
);

// Scanning animation
const ScanningAnimation = () => (
  <div className="relative w-40 h-40 mx-auto mb-8">
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-brutalist-accent/30"
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-2 rounded-full border-4 border-brutalist-secondary/30"
      animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <CpuChipIcon className="h-16 w-16 text-brutalist-accent" />
    </motion.div>
  </div>
);

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
      <motion.div 
        className="py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h1 
          className="text-3xl font-bold mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutalist-accent to-brutalist-secondary">
            Scanning Your Hardware
          </span>
        </motion.h1>
        
        <ScanningAnimation />
        
        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Progress
            size="md"
            radius="sm"
            classNames={{
              base: "max-w-md mx-auto",
              track: "drop-shadow-md border border-default",
              indicator: "bg-gradient-to-r from-brutalist-accent to-brutalist-secondary",
            }}
            aria-label="Loading..."
            isIndeterminate
          />
          <p className="text-xl mt-4">Please wait while we analyze your system</p>
          <p className="text-sm text-gray-500 mt-2 animate-pulse">Accessing WebGL and browser APIs...</p>
        </motion.div>
      </motion.div>
    );
  }

  // Show error state
  if (error || !systemSpecs) {
    return (
      <motion.div 
        className="py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h1 
          className="text-3xl font-bold mb-8 text-red-500"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Scan Failed
        </motion.h1>
        <motion.div 
          className="brutal-card p-6 mb-8 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <motion.div
              className="w-24 h-24 mx-auto mb-4 text-red-500"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CpuChipIcon className="w-full h-full" />
            </motion.div>
            <p className="text-xl mb-4">We couldn't scan your hardware properly.</p>
            <p className="mb-8">This could be due to browser security restrictions or privacy settings.</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button 
              color="primary"
              variant="shadow"
              onClick={() => scanSystem()}
              startContent={<CpuChipIcon className="h-5 w-5" />}
            >
              Try Again
            </Button>
            <Button 
              variant="flat"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Staggered card animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-center">
          Your System <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutalist-accent to-brutalist-secondary">Results</span>
        </h1>
        <p className="text-center text-gray-600 mb-8">Hardware detected by your browser</p>
      </motion.div>
      
      <motion.div 
        className="brutal-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Hardware Specifications
          <motion.div 
            className="absolute -bottom-1 left-0 h-1 bg-brutalist-accent"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* CPU */}
          <AnimatedCard delay={0.2}>
            <CardHeader icon={CpuChipIcon} title="CPU" />
            <div className="font-mono space-y-2">
              <div className="relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute inset-0 bg-brutalist-accent/5 rounded"
                />
                <p className="relative z-10">Logical Cores: {systemSpecs.cpu.cores}</p>
              </div>
              <p className="text-sm text-gray-500">
                Note: CPU model name cannot be detected in browser environment
              </p>
            </div>
          </AnimatedCard>
          
          {/* GPU */}
          <AnimatedCard delay={0.3}>
            <CardHeader icon={DevicePhoneMobileIcon} title="GPU" />
            <div className="font-mono space-y-2">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Vendor: {systemSpecs.gpu.vendor}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Renderer: {systemSpecs.gpu.renderer}
              </motion.p>
            </div>
          </AnimatedCard>

          {/* Memory */}
          <AnimatedCard delay={0.4}>
            <CardHeader icon={ServerIcon} title="Memory" />
            <div className="font-mono space-y-2">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                Total RAM: {systemSpecs.memory.total}
              </motion.p>
              <p className="text-sm text-gray-500">
                Note: Memory information is limited in browser environment
              </p>
            </div>
          </AnimatedCard>

          {/* OS & Browser */}
          <AnimatedCard delay={0.5}>
            <CardHeader icon={ComputerDesktopIcon} title="System" />
            <div className="font-mono space-y-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p>OS: {systemSpecs.os.name} {systemSpecs.os.version}</p>
                <p>Platform: {systemSpecs.os.platform}</p>
                <p>Browser: {systemSpecs.browser.name} {systemSpecs.browser.version}</p>
              </motion.div>
            </div>
          </AnimatedCard>

          {/* Screen */}
          <AnimatedCard delay={0.6} className="md:col-span-2">
            <CardHeader icon={ComputerDesktopIcon} title="Display" />
            <div className="font-mono space-y-2">
              <div className="flex flex-col md:flex-row justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p>Resolution: {systemSpecs.screen.width}x{systemSpecs.screen.height}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <p>Color Depth: {systemSpecs.screen.colorDepth} bit</p>
                </motion.div>
              </div>
              <motion.div 
                className="mt-4 w-full h-3 bg-gray-100 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-brutalist-accent to-brutalist-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.1, duration: 1 }}
                />
              </motion.div>
            </div>
          </AnimatedCard>
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-gray-500">Note: Due to browser security restrictions, hardware information is limited.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              color="primary"
              variant="shadow"
              onClick={() => scanSystem()}
              startContent={<CpuChipIcon className="h-5 w-5" />}
            >
              Rescan System
            </Button>
            <Button 
              variant="flat"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScanResults; 