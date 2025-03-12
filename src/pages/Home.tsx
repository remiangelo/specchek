import { useNavigate } from 'react-router-dom';
import { CpuChipIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Button } from '@nextui-org/react';

// Shimmering background component
const ShimmerButton = ({ children, ...props }: any) => {
  return (
    <button
      className="relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
};

// Gradient moving background
const GradientBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 opacity-50 animate-gradient-x" />
      <div className="absolute -top-[10%] left-[20%] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute top-[40%] -right-[5%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  );
};

const Home = () => {
  console.log('Home component rendered');
  const navigate = useNavigate();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-12 overflow-hidden">
      <GradientBackground />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-3 relative">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutalist-accent to-brutalist-secondary">
            SPEC
          </span>
          <span>CHEK</span>
          <motion.span 
            className="absolute -top-5 -right-5 text-xs bg-brutalist-accent text-white px-2 py-1 rounded-md"
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            v1.0
          </motion.span>
        </h1>
        <motion.p 
          className="text-xl max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Find out what hardware your browser can detect with our real-time system scanner.
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="brutal-card w-full max-w-2xl mb-12 p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
      >
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-brutalist-accent/10 rounded-full blur-xl" />
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-brutalist-secondary/10 rounded-full blur-xl" />
        
        <motion.h2 
          className="text-2xl font-bold mb-4 relative inline-block"
          whileHover={{ scale: 1.02 }}
        >
          How it works
          <motion.div 
            className="absolute -bottom-1 left-0 h-1 bg-brutalist-accent"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.h2>
        
        <motion.ol 
          className="list-decimal pl-6 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.li className="text-lg" variants={itemVariants}>
            Click the "Scan My Hardware" button to analyze your system
          </motion.li>
          <motion.li className="text-lg" variants={itemVariants}>
            We'll use browser APIs to detect your GPU, CPU cores, memory, and more
          </motion.li>
          <motion.li className="text-lg" variants={itemVariants}>
            View your real hardware information in a clean, easy-to-read format
          </motion.li>
        </motion.ol>
        
        <motion.div 
          className="mt-6 p-4 bg-yellow-50 brutal-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Due to browser security restrictions, some hardware details (like exact CPU model) may be limited. 
            We use WebGL and other browser APIs to gather as much information as possible.
          </p>
        </motion.div>
        
        <div className="mt-8 flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShimmerButton onClick={() => navigate('/results')}>
              <span className="flex items-center justify-center gap-2">
                <CpuChipIcon className="h-6 w-6" />
                Scan My Hardware
              </span>
            </ShimmerButton>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          className="brutal-btn flex items-center bg-brutalist-secondary/20 backdrop-blur-sm"
          onClick={() => navigate('/games')}
          variant="flat"
          endContent={<ArrowRightIcon className="h-5 w-5 ml-2" />}
        >
          Browse Game Library
        </Button>
      </motion.div>
      
      <motion.div
        className="absolute bottom-0 w-full h-1"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{ originX: 0 }}
      >
        <div className="h-full bg-gradient-to-r from-brutalist-accent via-brutalist-secondary to-brutalist-accent" />
      </motion.div>
    </div>
  );
};

export default Home; 