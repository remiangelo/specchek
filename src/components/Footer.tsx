import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren" 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const footerLinks = [
    { href: "#", text: "Privacy Policy" },
    { href: "#", text: "Terms of Service" },
    { href: "#", text: "Contact" },
  ];

  return (
    <motion.footer 
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mt-4 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      {/* Decorative Elements */}
      <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-4 md:mb-0"
            variants={itemVariants}
          >
            <span className="text-xl font-mono font-bold text-gray-900 dark:text-white relative group">
              SPEC
              <span className="text-blue-600 dark:text-blue-500 group-hover:animate-pulse transition-all duration-300">
                CHEK
              </span>
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 bg-blue-600 dark:bg-blue-500"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Check if your computer can run the games you want.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col md:flex-row md:space-x-6"
            variants={itemVariants}
          >
            {footerLinks.map((link, index) => (
              <motion.a 
                key={index}
                href={link.href}
                className="font-mono text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors mb-2 md:mb-0 relative group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                {link.text}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-blue-600/0 group-hover:bg-blue-600/100 dark:group-hover:bg-blue-500/100"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-6 pt-4 text-center text-sm text-gray-600 dark:text-gray-300 relative"
          variants={itemVariants}
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
          <p>&copy; {currentYear} SpecChek. All rights reserved.</p>
        </motion.div>
        
        <motion.div
          className="mt-4 flex justify-center space-x-6"
          variants={itemVariants}
        >
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            Home
          </Link>
          <Link to="/results" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            Scan Results
          </Link>
          <Link to="/games" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
            Game Library
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 