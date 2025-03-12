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
      className="bg-white brutal-border mt-4 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      {/* Decorative Elements */}
      <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-brutalist-accent/10 rounded-full blur-xl" />
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-brutalist-secondary/10 rounded-full blur-xl" />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-4 md:mb-0"
            variants={itemVariants}
          >
            <span className="text-xl font-mono font-bold text-brutalist-dark relative group">
              SPEC
              <span className="text-brutalist-accent group-hover:animate-pulse transition-all duration-300">
                CHEK
              </span>
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 bg-brutalist-accent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
            <p className="text-sm text-brutalist-gray mt-1">
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
                className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors mb-2 md:mb-0 relative group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                {link.text}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-brutalist-accent/0 group-hover:bg-brutalist-accent/100"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-6 pt-4 text-center text-sm text-brutalist-gray relative"
          variants={itemVariants}
        >
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brutalist-dark/20 to-transparent" />
          <p>&copy; {currentYear} SpecChek. All rights reserved.</p>
        </motion.div>
        
        <motion.div
          className="mt-4 flex justify-center space-x-6"
          variants={itemVariants}
        >
          <Link to="/" className="text-brutalist-gray hover:text-brutalist-accent transition-colors">
            Home
          </Link>
          <Link to="/results" className="text-brutalist-gray hover:text-brutalist-accent transition-colors">
            Scan Results
          </Link>
          <Link to="/games" className="text-brutalist-gray hover:text-brutalist-accent transition-colors">
            Game Library
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 