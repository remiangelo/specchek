import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, type: "spring", stiffness: 100 }
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.3, duration: 0.5, type: "spring" }
    }),
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  };

  // Menu items array for easy mapping
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/results", label: "Scan Results" },
    { path: "/games", label: "Game Library" }
  ];

  return (
    <NextUINavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white brutal-border mb-4 shadow-sm"
      maxWidth="full"
      height="4rem"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand>
          <motion.div
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={logoVariants}
          >
            <Link to="/" className="flex items-center">
              <span className="relative text-2xl font-mono font-bold text-brutalist-dark">
                SPEC
                <motion.span 
                  className="text-brutalist-accent" 
                  animate={{ 
                    color: ["#ff6b6b", "#4ecdc4", "#ff6b6b"],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  CHEK
                </motion.span>
                <motion.div 
                  className="absolute bottom-0 left-0 h-[2px] bg-brutalist-accent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </Link>
          </motion.div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={item.path} isActive={isActive(item.path)}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={navItemVariants}
            >
              <Link 
                to={item.path} 
                className={`font-mono relative px-2 py-1 ${
                  isActive(item.path) 
                    ? 'text-brutalist-accent font-bold' 
                    : 'text-brutalist-dark hover:text-brutalist-accent transition-colors'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-[2px] bg-brutalist-accent"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ width: "100%" }}
                  />
                )}
              </Link>
            </motion.div>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu className="pt-8 bg-white">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.path}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`font-mono text-lg block py-2 ${
                  isActive(item.path)
                    ? 'text-brutalist-accent font-bold'
                    : 'text-brutalist-dark'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </motion.div>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
};

export default Navbar; 