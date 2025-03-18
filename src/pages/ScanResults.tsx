import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CpuChipIcon, 
  ServerIcon, 
  ComputerDesktopIcon, 
  CircleStackIcon,
  CodeBracketIcon,
  CursorArrowRippleIcon
} from '@heroicons/react/24/outline';
import { Button, Progress, Badge, Chip, Tooltip } from '@nextui-org/react';
import { useSystemInfo } from '../hooks/useSystemInfo';

// Define types for component props
interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface CardHeaderProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
}

interface TierBadgeProps {
  tier: string;
}

interface PerformanceCategoryBadgeProps {
  category: string;
}

interface PerformanceMeterProps {
  score: number;
  label: string;
  color?: string;
}

// Animated card component
const AnimatedCard = ({ children, delay = 0, className = "" }: AnimatedCardProps) => (
  <motion.div
    className={`card relative overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: delay,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{
      y: -5,
      transition: { duration: 0.2 }
    }}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-70" />
    <div className="relative z-10">{children}</div>
    <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />
  </motion.div>
);

// Card header component
const CardHeader = ({ icon: Icon, title }: CardHeaderProps) => (
  <motion.div 
    className="flex items-center mb-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30" />
      <div className="relative">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-500" />
      </div>
    </div>
    <h3 className="text-xl font-bold ml-2">{title}</h3>
  </motion.div>
);

// Performance meter component
const PerformanceMeter = ({ score = 0, label, color = "blue" }: PerformanceMeterProps) => {
  const getColorClass = (): string => {
    switch(color) {
      case "red": return "from-red-500 to-orange-500";
      case "green": return "from-green-500 to-emerald-500";
      case "purple": return "from-purple-500 to-pink-500";
      default: return "from-blue-500 to-purple-500";
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>{label}</span>
        <span className="font-semibold">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full bg-gradient-to-r ${getColorClass()}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.2, duration: 1 }}
        />
      </div>
    </div>
  );
};

// Tier badge component
const TierBadge = ({ tier }: TierBadgeProps) => {
  const getColor = (): "success" | "primary" | "warning" | "danger" | "default" => {
    switch(tier?.toLowerCase()) {
      case "ultra": return "success";
      case "high": return "primary";
      case "medium": return "warning";
      case "low": return "danger";
      default: return "default";
    }
  };
  
  return (
    <Chip 
      color={getColor()} 
      variant="flat"
      size="sm"
      className="ml-2"
    >
      {tier}
    </Chip>
  );
};

// Scanning animation
const ScanningAnimation = () => (
  <div className="relative w-40 h-40 mx-auto mb-8">
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-blue-500/30"
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-2 rounded-full border-4 border-purple-500/30"
      animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <CpuChipIcon className="h-16 w-16 text-blue-600 dark:text-blue-500" />
    </motion.div>
  </div>
);

// Performance category badge
const PerformanceCategoryBadge = ({ category }: PerformanceCategoryBadgeProps) => {
  const getColor = (): "success" | "primary" | "warning" | "danger" | "default" => {
    switch(category) {
      case "ultra": return "success";
      case "highend": return "primary";
      case "mainstream": return "warning";
      case "entry": return "danger";
      default: return "default";
    }
  };
  
  const getLabel = () => {
    switch(category) {
      case "ultra": return "Ultra Gaming PC";
      case "highend": return "High-End Gaming";
      case "mainstream": return "Mainstream Gaming";
      case "entry": return "Entry-Level Gaming";
      default: return "Unknown";
    }
  };
  
  return (
    <Badge 
      content={getLabel()} 
      color={getColor()}
      placement="top-right"
      size="lg"
      className="transform -translate-y-1"
    >
      <div className="h-8 w-8"></div>
    </Badge>
  );
};

const ScanResults = () => {
  console.log('ScanResults component rendered');
  const navigate = useNavigate();
  const { 
    specs, 
    isScanning, 
    error, 
    scanHardware,
    isScanningEnabled,
    toggleScanning,
    performanceCategory 
  } = useSystemInfo();

  // Trigger hardware scan when component mounts
  useEffect(() => {
    console.log('ScanResults useEffect - triggering scan');
    scanHardware();
  }, [scanHardware]);

  // Show loading state
  if (isScanning) {
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
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
              indicator: "bg-gradient-to-r from-blue-600 to-purple-600",
            }}
            aria-label="Loading..."
            isIndeterminate
          />
          <p className="text-xl mt-4">Please wait while we analyze your system</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 animate-pulse">Accessing WebGL and browser APIs...</p>
        </motion.div>
      </motion.div>
    );
  }

  // Show error state
  if (error || !specs) {
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
          className="card p-6 mb-8 max-w-2xl mx-auto"
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
              onClick={() => scanHardware()}
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
        className="relative"
      >
        <h1 className="text-4xl font-bold mb-2 text-center">
          Your System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Results</span>
        </h1>
        <div className="flex justify-center">
          <PerformanceCategoryBadge category={performanceCategory} />
        </div>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4 mt-4">
          Hardware detected by SpecChek
        </p>
      </motion.div>
      
      {/* Performance Summary */}
      <motion.div 
        className="card p-6 mb-8 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Performance Overview
          <motion.div 
            className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-blue-200 dark:border-blue-900">
                <motion.div 
                  className="font-bold text-3xl text-blue-600 dark:text-blue-500"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {specs.performanceScore?.overall || 0}
                </motion.div>
              </div>
              <motion.div 
                className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                {specs.performanceScore?.overall && specs.performanceScore.overall > 80 ? "A" : 
                  specs.performanceScore?.overall && specs.performanceScore.overall > 60 ? "B" :
                  specs.performanceScore?.overall && specs.performanceScore.overall > 40 ? "C" : "D"}
              </motion.div>
            </div>
            <span className="font-semibold">Overall Score</span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <PerformanceMeter 
              score={specs.performanceScore?.gaming || 0} 
              label="Gaming Performance" 
              color="purple"
            />
            <PerformanceMeter 
              score={specs.performanceScore?.productivity || 0} 
              label="Productivity" 
              color="green"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <p className="text-sm mb-2">Estimated Performance Profile:</p>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm"
            >
              {specs.performanceScore?.gaming && specs.performanceScore.gaming > 80 ? 
                "Capable of running AAA games at high settings/resolution" : 
                specs.performanceScore?.gaming && specs.performanceScore.gaming > 60 ?
                "Suitable for most modern games at medium-high settings" :
                specs.performanceScore?.gaming && specs.performanceScore.gaming > 40 ?
                "Can handle most games at medium settings" :
                "Best suited for casual and less demanding games"}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Hardware Specifications */}
      <motion.div 
        className="card p-6 mb-8 max-w-3xl mx-auto"
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
            className="absolute -bottom-1 left-0 h-1 bg-blue-600"
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
                  className="absolute inset-0 bg-blue-600/5 dark:bg-blue-500/10 rounded"
                />
                <p className="relative z-10">Logical Cores: {specs.cpu.cores}</p>
              </div>
              {specs.cpu.estimatedPerformance !== undefined && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Estimated CPU Performance:</p>
                  <PerformanceMeter score={specs.cpu.estimatedPerformance} label="" />
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Note: CPU model name cannot be detected in browser environment
              </p>
            </div>
          </AnimatedCard>

          {/* GPU */}
          <AnimatedCard delay={0.3}>
            <CardHeader icon={ServerIcon} title="GPU" />
            <div className="font-mono space-y-2">
              <p>
                <strong>Vendor:</strong> {specs.gpu.vendor}
              </p>
              <p>
                <strong>Renderer:</strong> {specs.gpu.renderer}
                {specs.gpu.tier && <TierBadge tier={specs.gpu.tier} />}
              </p>
              {specs.gpu.estimatedPerformance !== undefined && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Estimated GPU Performance:</p>
                  <PerformanceMeter 
                    score={specs.gpu.estimatedPerformance} 
                    label="" 
                    color="purple"
                  />
                </div>
              )}
            </div>
          </AnimatedCard>

          {/* Browser & Features */}
          <AnimatedCard delay={0.4}>
            <CardHeader icon={CodeBracketIcon} title="Browser Capabilities" />
            <div className="font-mono space-y-2">
              <p>
                <strong>Browser:</strong> {specs.browser.name} {specs.browser.version}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Tooltip content="WebGL Support">
                  <Chip 
                    size="sm" 
                    color={specs.browser.features.webGL ? "success" : "danger"}
                    variant="flat"
                  >
                    WebGL
                  </Chip>
                </Tooltip>
                <Tooltip content="WebGL 2.0 Support">
                  <Chip 
                    size="sm" 
                    color={specs.browser.features.webGL2 ? "success" : "danger"}
                    variant="flat"
                  >
                    WebGL 2
                  </Chip>
                </Tooltip>
                <Tooltip content="WebGPU Support (Experimental)">
                  <Chip 
                    size="sm" 
                    color={specs.browser.features.webGPU ? "success" : "danger"}
                    variant="flat"
                  >
                    WebGPU
                  </Chip>
                </Tooltip>
                <Tooltip content="WebAssembly Support">
                  <Chip 
                    size="sm" 
                    color={specs.browser.features.webAssembly ? "success" : "danger"}
                    variant="flat"
                  >
                    WebAssembly
                  </Chip>
                </Tooltip>
              </div>
            </div>
          </AnimatedCard>

          {/* System Info */}
          <AnimatedCard delay={0.5}>
            <CardHeader icon={ComputerDesktopIcon} title="System" />
            <div className="font-mono space-y-2">
              <p><strong>OS:</strong> {specs.os.name} {specs.os.version}</p>
              <p><strong>Platform:</strong> {specs.os.platform}</p>
              <div className="mt-3">
                <strong>Display:</strong>
                <p className="mt-1">
                  {specs.screen.width} x {specs.screen.height} @ {specs.screen.pixelRatio}x
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {specs.screen.colorDepth}-bit color depth
                </p>
              </div>
            </div>
          </AnimatedCard>

          {/* Memory */}
          <AnimatedCard delay={0.6}>
            <CardHeader icon={CircleStackIcon} title="Memory" />
            <div className="font-mono space-y-2">
              <p><strong>Available Memory:</strong> {specs.memory.total}</p>
              {specs.memory.estimatedPerformance !== undefined && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Memory Performance:</p>
                  <PerformanceMeter 
                    score={specs.memory.estimatedPerformance} 
                    label="" 
                    color="green"
                  />
                </div>
              )}
            </div>
          </AnimatedCard>
        </motion.div>
      </motion.div>

      {/* Game Compatibility */}
      <motion.div
        className="mt-8 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Game Compatibility
          <motion.div 
            className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.9, duration: 0.6 }}
          />
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
          <AnimatedCard delay={0.9} className="h-full">
            <CardHeader icon={CursorArrowRippleIcon} title="Recommended Games" />
            <p className="mb-3">Based on your hardware score, these game types should run smoothly:</p>
            <ul className="space-y-2 list-disc pl-5">
              {specs.performanceScore?.gaming && specs.performanceScore.gaming >= 75 ? (
                <>
                  <li>Modern AAA titles at high/ultra settings</li>
                  <li>VR games and applications</li>
                  <li>Competitive games at high framerates</li>
                  <li>Streaming while gaming</li>
                </>
              ) : specs.performanceScore?.gaming && specs.performanceScore.gaming >= 60 ? (
                <>
                  <li>Most modern games at medium-high settings</li>
                  <li>Some VR applications with adjusted settings</li>
                  <li>Competitive games at stable framerates</li>
                  <li>Light streaming capabilities</li>
                </>
              ) : specs.performanceScore?.gaming && specs.performanceScore.gaming >= 40 ? (
                <>
                  <li>Modern games at medium-low settings</li>
                  <li>Older AAA titles (3+ years) at medium settings</li>
                  <li>Most indie and less demanding games</li>
                  <li>Basic competitive games</li>
                </>
              ) : (
                <>
                  <li>Indie and casual games</li>
                  <li>Older titles (5+ years) at low settings</li>
                  <li>Browser-based games</li>
                  <li>2D and pixel art games</li>
                </>
              )}
            </ul>
          </AnimatedCard>
          
          <AnimatedCard delay={1.0} className="h-full">
            <CardHeader icon={CursorArrowRippleIcon} title="Potential Limitations" />
            <p className="mb-3">You might experience issues with:</p>
            <ul className="space-y-2 list-disc pl-5">
              {specs.performanceScore?.gaming && specs.performanceScore.gaming >= 75 ? (
                <>
                  <li>Extremely demanding ray-tracing at 4K</li>
                  <li>Next-gen titles at maximum settings</li>
                  <li>Heavy modded games with graphical enhancements</li>
                </>
              ) : specs.performanceScore?.gaming && specs.performanceScore.gaming >= 60 ? (
                <>
                  <li>Latest AAA games at high/ultra settings</li>
                  <li>Ray-tracing features at high resolutions</li>
                  <li>Demanding VR titles at high settings</li>
                </>
              ) : specs.performanceScore?.gaming && specs.performanceScore.gaming >= 40 ? (
                <>
                  <li>Modern AAA games at high settings</li>
                  <li>Most VR applications</li>
                  <li>Games with ray-tracing features</li>
                </>
              ) : (
                <>
                  <li>Most modern AAA titles</li>
                  <li>Competitive games requiring high framerates</li>
                  <li>Any games with VR or ray-tracing</li>
                </>
              )}
            </ul>
          </AnimatedCard>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4 mt-8 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <Button 
          color="primary" 
          variant="shadow" 
          onClick={() => navigate('/games')}
          size="lg"
        >
          Explore Game Library
        </Button>
        <Button 
          variant="bordered" 
          onClick={() => scanHardware()}
          size="lg"
        >
          Rescan System
        </Button>
        <Button
          variant="light"
          onClick={() => toggleScanning()}
          size="lg"
        >
          {isScanningEnabled ? "Disable" : "Enable"} Hardware Scanning
        </Button>
      </motion.div>
    </div>
  );
};

export default ScanResults;