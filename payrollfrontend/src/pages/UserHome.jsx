import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function UserHome() {
  const [summaryData, setSummaryData] = useState({
    totalWorkingDays: 0,
    totalPresentDays: 0,
    totalLeaves: 0,
    totalOvertimeHours: 0
  });
  const [employeeName, setEmployeeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Get employee ID from token
        const decoded = jwtDecode(token);
        const email = decoded.sub || decoded.email || decoded.username;
        
        // First fetch employee details to get the name
        const employeeRes = await axios.get(
          `http://localhost:9090/employee/by-email/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setEmployeeName(employeeRes.data.empName);
        
        const employeeId = employeeRes.data.id;
        const currentDate = new Date();
        
        // Then fetch summary data from time tracking system
        const summaryRes = await axios.get(
          `http://localhost:9090/attendance/summary/${employeeId}?month=${currentDate.getMonth()+1}&year=${currentDate.getFullYear()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setSummaryData(summaryRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{
          background: '#fee2e2',
          color: '#b91c1c',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {error}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        border: '1px solid #e2e8f0'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <FiBriefcase size={28} color="#3b82f6" />
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Welcome, {employeeName || 'Employee'}!
        </h1>
      </div>

      {/* Rest of the component remains the same */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FiTrendingUp /> Monthly Summary
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          {/* Working Days */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FiCalendar color="#3b82f6" />
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Working Days</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{summaryData.totalWorkingDays}</div>
          </div>

          {/* Present Days */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FiCheckCircle color="#10b981" />
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Present Days</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{summaryData.totalPresentDays}</div>
          </div>

          {/* Leaves Taken */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FiCalendar color="#ef4444" />
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Leaves Taken</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{summaryData.totalLeaves}</div>
          </div>

          {/* Overtime Hours */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FiClock color="#f59e0b" />
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Overtime (hrs)</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{summaryData.totalOvertimeHours}</div>
          </div>
        </div>
      </div>

      {/* Summary Message */}
      <p style={{ color: '#64748b' }}>
        You've worked <strong>{summaryData.totalPresentDays}</strong> out of <strong>{summaryData.totalWorkingDays}</strong> days this month.
        {summaryData.totalOvertimeHours > 0 && (
          <span> You've logged <strong>{summaryData.totalOvertimeHours} hours</strong> of overtime.</span>
        )}
      </p>
    </motion.div>
  );
}