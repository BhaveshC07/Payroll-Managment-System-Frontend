import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FiUser, FiSearch, FiCalendar, FiClock, FiCheckCircle, 
  FiXCircle, FiInfo 
} from 'react-icons/fi';
import { format, parseISO, eachDayOfInterval, isWeekend, isAfter, isBefore, endOfDay } from 'date-fns';

const AdminAttendance = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year, label: year.toString() };
  });

  const fetchEmployeeDetails = async () => {
    if (!employeeId) return null;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:9090/employee/${employeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployeeDetails(response.data);
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch employee details');
      }
      return null;
    }
  };

  const fetchAttendanceRecords = async () => {
    if (!employeeId) return;
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const employeeData = await fetchEmployeeDetails();
      if (!employeeData) return;

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:9090/attendance/${employeeId}/monthly?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceRecords(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch attendance records');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAttendanceRecords();
  };

  const getFilteredDates = () => {
    if (!employeeDetails || !employeeDetails.joiningDate) return [];
    
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(Math.min(
      new Date(selectedYear, selectedMonth, 0).getTime(),
      new Date().getTime() // Only go up to current date
    ));
    
    const joiningDate = parseISO(employeeDetails.joiningDate.toString());
    const adjustedStartDate = isAfter(startDate, joiningDate) ? startDate : joiningDate;
    
    if (isAfter(adjustedStartDate, endDate)) return [];
    
    return eachDayOfInterval({ 
      start: adjustedStartDate, 
      end: endDate 
    });
  };

  const getCombinedRecords = () => {
    const filteredDates = getFilteredDates();
    const recordsMap = new Map();
    
    attendanceRecords.forEach(record => {
      const dateKey = format(parseISO(record.date.toString()), 'yyyy-MM-dd');
      recordsMap.set(dateKey, record);
    });

    return filteredDates.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      return {
        date: dateKey,
        isWeekend: isWeekend(date),
        isFuture: isAfter(date, new Date()),
        record: recordsMap.get(dateKey) || null
      };
    });
  };

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
            <FiCalendar size={28} color="#3b82f6" />
            <span style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Attendance Management</span>
          </div>
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

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
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
            <FiSearch size={20} /> Search Criteria
          </h3>

          <form onSubmit={handleSearch}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#334155'
                }}>
                  Employee ID
                </label>
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
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
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
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
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
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
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
                  gap: '0.5rem',
                  height: '42px'
                }}
                disabled={loading}
              >
                {loading ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : <FiSearch />}
                Search
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Employee Details */}
        {hasSearched && employeeDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
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
              <FiUser size={20} /> Employee Details
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr 1fr 1fr',
              gap: '1.5rem',
              alignItems: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0369a1',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {employeeDetails.empName?.charAt(0) || 'E'}
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Name</div>
                <div style={{ fontWeight: '600' }}>{employeeDetails.empName}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Department</div>
                <div style={{ fontWeight: '500' }}>{employeeDetails.department || '--'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Position</div>
                <div style={{ fontWeight: '500' }}>{employeeDetails.jobTitle || '--'}</div>
              </div>

              <div style={{ gridColumn: '2 / span 1' }}>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Employee ID</div>
                <div style={{ fontWeight: '500' }}>{employeeDetails.id}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Join Date</div>
                <div style={{ fontWeight: '500' }}>
                  {employeeDetails.joiningDate ? format(parseISO(employeeDetails.joiningDate.toString()), 'dd MMM yyyy') : '--'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Attendance Records */}
        {hasSearched && employeeId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
                <FiClock size={20} /> Attendance Records for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
              </h3>
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
                      <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Day</th>
                      <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Status</th>
                      <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Check In</th>
                      <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Check Out</th>
                      <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Total Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCombinedRecords().length > 0 ? (
                      getCombinedRecords().map(({ date, isWeekend, isFuture, record }) => (
                        <tr key={date} style={{
                          borderBottom: '1px solid #e2e8f0',
                          ...(isFuture && { opacity: 0.6 })
                        }}>
                          <td style={{ padding: '1rem' }}>
                            {format(parseISO(date), 'dd MMM yyyy')}
                            {isFuture && (
                              <span style={{ 
                                marginLeft: '0.5rem',
                                fontSize: '0.75rem',
                                color: '#64748b'
                              }}>(Future)</span>
                            )}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {format(parseISO(date), 'EEEE')}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {isFuture ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#64748b'
                              }}>
                                <FiInfo /> Not Applicable
                              </span>
                            ) : isWeekend ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#64748b'
                              }}>
                                <FiInfo /> Weekend
                              </span>
                            ) : record ? (
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
                                color: '#ef4444'
                              }}>
                                <FiXCircle /> Absent
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {isFuture ? '--' : (record?.checkInTime || '--')}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {isFuture ? '--' : (record?.checkOutTime || '--')}
                          </td>
                          <td>
  {
    isFuture 
      ? '--' 
      : (record 
          ? (record.totalHours?.toFixed(2) || '--') 
          : '--'
        )
  }
</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          {employeeDetails ? 
                            `No working days between joining date (${format(parseISO(employeeDetails.joiningDate.toString()), 'dd MMM yyyy')})` : 
                            'No records found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminAttendance;