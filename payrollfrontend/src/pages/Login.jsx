import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = ({ setAuthenticated }) => {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.userName || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:9090/SpringSecurity/login',
        {
          userName: formData.userName,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      const token = response.data;
      localStorage.setItem('token', token);
      setAuthenticated(true);
      
      // Decode token to get role
      const decoded = jwtDecode(token);
      const role = decoded.role?.toUpperCase();

      // Redirect based on role
      if (role === 'OWNER') {
        navigate('/ownerdashboard');
      } else if (role === 'USER') {
        navigate('/userdashboard');
      } else {
        navigate('/login'); // Fallback for other roles
      }

    } catch (err) {
      const errorMessage = err.response?.data || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        padding: '2rem'
      }}
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '450px',
          padding: '3rem',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
           
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>Welcome back</h1>
          <p style={{ color: '#64748b' }}>Sign in to access your account</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label htmlFor="userName" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#334155'
            }}>Username</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '3px solid #e2e8f0',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',   // ✅ Add this
                  color: '#0f172a', 
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                  }
                }}
                required
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#334155'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '3px solid #e2e8f0',
                  fontSize: '1rem',
                  backgroundColor: '#ffffff',   // ✅ Add this
                  color: '#0f172a', 
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#3b82f6',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
                  }
                }}
                required
              />
              {showPassword ? (
                <FiEyeOff
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FiEye
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              '&:hover': {
                background: '#2563eb'
              },
              '&:disabled': {
                background: '#cbd5e1',
                cursor: 'not-allowed'
              }
            }}
          >
            {loading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Signing in...
              </>
            ) : 'Sign in'}
          </motion.button>
        </form>
        
        <p style={{ color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#3b82f6',
            fontWeight: '600',
            textDecoration: 'none'
          }}>Sign up</Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;