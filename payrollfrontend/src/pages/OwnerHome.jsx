import { motion } from 'framer-motion';
import { FiUser, FiCheckCircle, FiUsers, FiSun } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isWeekend } from 'date-fns';

export default function OwnerHome() {
  const [presentCount, setPresentCount] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const today = new Date();
        const todayFormatted = format(today, 'yyyy-MM-dd');
        
        // Check if today is weekend
        setIsHoliday(isWeekend(today));

        // Fetch total employees
        const employeesRes = await axios.get('http://localhost:9090/employee', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalEmployees(employeesRes.data.length);

        // Only fetch attendance if it's not a holiday
        if (!isHoliday) {
          const attendanceRes = await axios.get(
            `http://localhost:9090/attendance/today?date=${todayFormatted}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPresentCount(attendanceRes.data.length);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isHoliday]);

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
        <FiUser size={28} color="#3b82f6" />
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Welcome, Owner!
        </h1>
      </div>

      {/* Error Message */}
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

      {/* Loading State */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      ) : isHoliday ? (
        // Holiday View
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: '#fef3c7',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid #fcd34d'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fde68a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706'
            }}>
              <FiSun size={32} />
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#92400e'
            }}>
              Today is a Holiday!
            </h2>
            <p style={{ color: '#92400e' }}>
              Enjoy your weekend. Office will reopen on {format(new Date().getDay() === 6 ? 'Monday' : 'Monday')}.
            </p>
          </div>
        </motion.div>
      ) : (
        // Normal Workday View
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            {/* Total Employees Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0369a1'
                }}>
                  <FiUsers size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Total Employees</h3>
                  <p style={{ color: '#64748b' }}>All active team members</p>
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center' }}>{totalEmployees}</div>
            </motion.div>

            {/* Present Today Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a'
                }}>
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>Present Today</h3>
                  <p style={{ color: '#64748b' }}>{format(new Date(), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', color: '#16a34a' }}>
                {presentCount}
              </div>
            </motion.div>
          </div>

          {/* Summary Message */}
          <p style={{ 
            color: '#64748b', 
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <strong>{presentCount}</strong> out of <strong>{totalEmployees}</strong> employees are present today.
          </p>
        </>
      )}
    </motion.div>
  );
}