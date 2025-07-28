import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiFileText, FiShield, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 15px rgba(59, 130, 246, 0.3)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
      style={{
        height: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Navbar */}
      <motion.nav 
        variants={itemVariants}
        style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'clamp(1rem, 3vw, 2rem) clamp(1.5rem, 5vw, 4rem)',
          background: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <motion.div 
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          whileHover={{ scale: 1.03 }}
        >
          
          <span style={{
            fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            PAYROLL SYSTEM
          </span>
        </motion.div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link to="/login" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'white',
              color: '#3b82f6',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              border: '2px solid #3b82f6',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'
            }}>
              <FiLogIn style={{ fontSize: '1.25rem' }} />
              Login
            </Link>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Link to="/register" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              color: 'white',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
            }}>
              <FiUserPlus style={{ fontSize: '1.25rem' }} />
              Register
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main 
        variants={containerVariants}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflowX: 'hidden',
          paddingBottom: '2rem'
        }}
      >
        {/* Hero Section */}
        <motion.section 
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)',
            textAlign: 'center'
          }}
        >
          <div style={{ maxWidth: 'min(800px, 90vw)', width: '100%' }}>
            <motion.h1 
              variants={itemVariants}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '800',
                lineHeight: '1.2',
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                color: '#1e293b'
              }}
            >
              Modern Payroll Management <motion.span 
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
              >
                Simplified
              </motion.span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#64748b',
                marginBottom: 'clamp(2rem, 4vw, 2.5rem)',
                lineHeight: '1.6'
              }}
            >
              Streamline your payroll processes with our all-in-one solution. Automate calculations, generate payslips, and manage employee data with ease.
            </motion.p>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          variants={containerVariants}
          style={{
            background: 'white',
            padding: 'clamp(2rem, 5vw, 4rem)'
          }}
        >
          <div style={{
            maxWidth: 'min(1200px, 95vw)',
            margin: '0 auto'
          }}>
            <motion.h2 
              variants={itemVariants}
              style={{
                textAlign: 'center',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: '700',
                marginBottom: 'clamp(2rem, 4vw, 3rem)',
                color: '#1e293b'
              }}
            >
              Powerful Features
            </motion.h2>

            <motion.div 
              variants={containerVariants}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2rem)'
              }}
            >
              {/* Feature Cards */}
              {[
                { icon: <FiUsers color="#3b82f6" />, title: "Employee Management", desc: "Easily manage employee records, departments, and positions." },
                { icon: <FiDollarSign color="#10b981" />, title: "Pay Calculation", desc: "Automate salary calculations with support for bonuses and deductions." },
                { icon: <FiFileText color="#f59e0b" />, title: "Payslip Generation", desc: "Generate professional payslips with customizable templates." },
                { icon: <FiShield color="#8b5cf6" />, title: "Tax Compliance", desc: "Stay compliant with automatic tax calculations and reporting." },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: 'clamp(1.5rem, 3vw, 2rem)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <div style={{
                    width: 'clamp(3rem, 6vw, 3.75rem)',
                    height: 'clamp(3rem, 6vw, 3.75rem)',
                    borderRadius: '12px',
                    background: '#e0f2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.5rem' }}>{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </motion.main>
    </motion.div>
  );
};

export default Home;
