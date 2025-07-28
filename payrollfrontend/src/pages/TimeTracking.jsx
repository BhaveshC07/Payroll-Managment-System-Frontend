import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FiClock, FiCalendar, FiCheckCircle, FiXCircle, 
  FiUser, FiLogIn, FiLogOut, FiPlus, FiTrendingUp
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

const TimeTracking = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlySummary, setMonthlySummary] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    checkInTime: '09:00',
    checkOutTime: '17:00'
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year, label: year.toString() };
  });

  // Get employee ID from token
  useEffect(() => {
    const fetchEmployeeId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const email = decoded.sub || decoded.email || decoded.username;
        
        const response = await axios.get(`http://localhost:9090/employee/by-email/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.id) {
          setEmployeeId(response.data.id);
        } else {
          throw new Error('Employee ID not found');
        }
      } catch (err) {
        console.error('Error fetching employee profile:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
        setError('Failed to fetch employee information');
      }
    };

    fetchEmployeeId();
  }, [navigate]);

  // Fetch attendance data
  useEffect(() => {
    if (employeeId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [recordsResponse, summaryResponse] = await Promise.all([
            axios.get(
              `http://localhost:9090/attendance/${employeeId}/monthly?month=${selectedMonth}&year=${selectedYear}`,
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            ),
            axios.get(
              `http://localhost:9090/attendance/summary/${employeeId}?month=${selectedMonth}&year=${selectedYear}`,
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
          ]);
          
          setAttendanceRecords(recordsResponse.data);
          setMonthlySummary(summaryResponse.data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch attendance data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [employeeId, selectedMonth, selectedYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        employeeId,
        date: formData.date,
        checkInTime: formData.checkInTime + ':00',
        checkOutTime: formData.checkOutTime + ':00'
      };

      const response = await axios.post('http://localhost:9090/attendance', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess(response.data.message || 'Attendance recorded successfully');

      // Refresh data
      const [recordsResponse, summaryResponse] = await Promise.all([
        axios.get(
          `http://localhost:9090/attendance/${employeeId}/monthly?month=${selectedMonth}&year=${selectedYear}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        ),
        axios.get(
          `http://localhost:9090/attendance/summary/${employeeId}?month=${selectedMonth}&year=${selectedYear}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
      ]);

      setAttendanceRecords(recordsResponse.data);
      setMonthlySummary(summaryResponse.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording attendance');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      checkInTime: '09:00',
      checkOutTime: '17:00'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!employeeId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <FiClock size={28} color="#3b82f6" />
            <span style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Time Tracking</span>
          </div>
        </div>

        {/* Error/Success Messages */}
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

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#dcfce7',
              color: '#166534',
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
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {success}
          </motion.div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '1.5rem'
        }}>
          {/* Left Column - Form and Summary */}
          <div>
            {/* Attendance Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiPlus /> Record Attendance
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#334155'
                    }}>
                      Date
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FiCalendar style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#64748b'
                      }} />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: '#334155'
                      }}>
                        Check In
                      </label>
                      <div style={{ position: 'relative' }}>
                        <FiLogIn style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b'
                        }} />
                        <input
                          type="time"
                          name="checkInTime"
                          value={formData.checkInTime}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: '#334155'
                      }}>
                        Check Out
                      </label>
                      <div style={{ position: 'relative' }}>
                        <FiLogOut style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b'
                        }} />
                        <input
                          type="time"
                          name="checkOutTime"
                          value={formData.checkOutTime}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
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
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '0.5rem'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : <FiPlus />}
                    Submit Attendance
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Monthly Summary */}
            {monthlySummary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}
              >
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
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Working Days</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{monthlySummary.totalWorkingDays}</div>
                  </div>

                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Present Days</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{monthlySummary.totalPresentDays}</div>
                  </div>

                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Leaves Taken</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{monthlySummary.totalLeaves}</div>
                  </div>

                  <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Overtime (hrs)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{monthlySummary.totalOvertimeHours}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Attendance Records */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '1.5rem'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FiCalendar /> Attendance History
                </h3>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1rem',
                      appearance: 'none'
                    }}
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1rem',
                      appearance: 'none'
                    }}
                  >
                    {years.map(year => (
                      <option key={year.value} value={year.value}>{year.label}</option>
                    ))}
                  </select>
                </div>
              </div>

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
              ) : (
                <div style={{
                  overflowX: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left'
                  }}>
                    <thead>
                      <tr style={{
                        backgroundColor: '#f1f5f9',
                        borderBottom: '1px solid #e2e8f0'
                      }}>
                        <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Date</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Check In</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Check Out</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Total Hours</th>
                        <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.length > 0 ? (
                        attendanceRecords.map((record) => (
                          <tr key={record.id} style={{
                            borderBottom: '1px solid #e2e8f0'
                          }}>
                            <td style={{ padding: '1rem' }}>
                              {format(parseISO(record.date.toString()), 'dd MMM yyyy')}
                            </td>
                            <td style={{ padding: '1rem' }}>{record.checkInTime}</td>
                            <td style={{ padding: '1rem' }}>{record.checkOutTime}</td>
                            <td style={{ padding: '1rem' }}>{record.totalHours?.toFixed(2) || '--'}</td>
                            <td style={{ padding: '1rem' }}>
                              {record.status === 'PRESENT' ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: '#10b981'
                                }}>
                                  <FiCheckCircle /> Present
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: '#10b981'
                                }}>
                                  <FiCheckCircle /> Present
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            No attendance records found for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimeTracking;