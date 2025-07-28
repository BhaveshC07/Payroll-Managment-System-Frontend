import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PayslipComponent from './PayslipComponent';
import { FiCalendar, FiSearch, FiDollarSign, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmpPayslipGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    month: '',
    year: ''
  });
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [payslipData, setPayslipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get employee ID from token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const email = decoded.sub || decoded.email || decoded.username;
      
      // Fetch employee profile to get the ID
      const fetchEmployeeId = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9090/employee/by-email/${email}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.data && response.data.id) {
            setEmployeeId(response.data.id);
            setEmployeeDetails(response.data);
          } else {
            throw new Error('Employee ID not found in response');
          }
        } catch (err) {
          console.error('Error fetching employee profile:', err);
          setError('Failed to fetch employee information');
        }
      };

      fetchEmployeeId();
    } catch (err) {
      console.error('Error decoding token:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) return;
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:9090/payslip/generate',
        {
          employeeId: employeeId,
          month: parseInt(formData.month),
          year: parseInt(formData.year)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setPayslipData(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate payslip. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <FiDollarSign size={28} color="#3b82f6" />
          <span style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>Payslip Generator</span>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        )}

        {employeeDetails && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              {employeeDetails.empName?.charAt(0) || 'E'}
            </div>
            <div>
              <div style={{ fontWeight: '600', color: '#1e293b' }}>{employeeDetails.empName}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {employeeDetails.department} • {employeeDetails.jobTitle}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#334155'
              }}>
                Month
              </label>
              <div style={{ position: 'relative' }}>
                <FiCalendar style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '1rem',
                    appearance: 'none'
                  }}
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#334155'
              }}>
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="2000"
                max="2100"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || !employeeId}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: !employeeId ? 0.7 : 1
            }}
          >
            {loading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FiSearch /> Generate Payslip
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {payslipData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PayslipComponent payslipData={payslipData} employeeDetails={employeeDetails} />
        </motion.div>
      )}
    </div>
  );
};

export default EmpPayslipGenerator;