import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiHome, FiDollarSign, FiBriefcase, FiCalendar, FiMail, FiCreditCard, FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    id: '',
    empName: '',
    adharNo: '',
    gender: '',
    email: '',
    department: '',
    jobTitle: '',
    joiningDate: '',
    ctc: '',
    bankName: '',
    accNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9090/employee', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch employees. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (isEditMode) {
        await axios.put(
          `http://localhost:9090/employee/${currentEmployee.id}`,
          currentEmployee,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.post(
          'http://localhost:9090/employee',
          currentEmployee,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Operation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployee({
      id: employee.id,
      empName: employee.empName,
      adharNo: employee.adharNo,
      gender: employee.gender,
      email: employee.email,
      department: employee.department,
      jobTitle: employee.jobTitle,
      joiningDate: employee.joiningDate,
      ctc: employee.ctc,
      bankName: employee.bankName,
      accNo: employee.accNo
    });
    setIsEditMode(true);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (employee) => {
    setCurrentEmployee({
      id: employee.id,
      empName: employee.empName,
      adharNo: employee.adharNo,
      gender: employee.gender,
      email: employee.email,
      department: employee.department,
      jobTitle: employee.jobTitle,
      joiningDate: employee.joiningDate,
      ctc: employee.ctc,
      bankName: employee.bankName,
      accNo: employee.accNo
    });
    setIsViewMode(true);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:9090/employee/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        fetchEmployees();
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to delete employee. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setCurrentEmployee({
      id: '',
      empName: '',
      adharNo: '',
      gender: '',
      email: '',
      department: '',
      jobTitle: '',
      joiningDate: '',
      ctc: '',
      bankName: '',
      accNo: ''
    });
    setIsEditMode(false);
    setIsViewMode(false);
    setError('');
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        {/* Header and Add Employee Button */}
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
            <FiBriefcase size={28} color="#3b82f6" />
            <span style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Employee Management</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
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
              gap: '0.5rem'
            }}
          >
            <FiPlus /> Add Employee
          </motion.button>
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

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '1.5rem'
        }}>
          <FiSearch style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b'
          }} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Employee Table */}
        {loading && !isModalOpen ? (
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
          <>
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
                    <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Employee</th>
                    <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Department</th>
                    <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Job Title</th>
                    <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Joining Date</th>
                    <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>CTC</th>
                    <th style={{ padding: '1rem', fontWeight: '600', color: '#334155' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length > 0 ? (
                    currentEmployees.map((employee) => (
                      <tr key={employee.id} style={{
                        borderBottom: '1px solid #e2e8f0'
                      }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: '#e0f2fe',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0369a1'
                            }}>
                              <FiUser size={20} />
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: '#1e293b' }}>{employee.empName}</div>
                              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#475569' }}>{employee.department}</td>
                        <td style={{ padding: '1rem', color: '#475569' }}>{employee.jobTitle}</td>
                        <td style={{ padding: '1rem', color: '#475569' }}>
                          {new Date(employee.joiningDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', color: '#475569' }}>₹{employee.ctc}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleView(employee)}
                              style={{
                                padding: '0.5rem',
                                background: '#e0f7fa',
                                color: '#00acc1',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <FiEye size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(employee)}
                              style={{
                                padding: '0.5rem',
                                background: '#e0f2fe',
                                color: '#0369a1',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <FiEdit size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(employee.id)}
                              style={{
                                padding: '0.5rem',
                                background: '#fee2e2',
                                color: '#b91c1c',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <FiTrash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredEmployees.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.5rem',
                padding: '0 0.5rem'
              }}>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} employees
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      background: currentPage === 1 ? '#e2e8f0' : '#f1f5f9',
                      color: currentPage === 1 ? '#94a3b8' : '#334155',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <FiChevronLeft /> Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      background: currentPage === totalPages ? '#e2e8f0' : '#f1f5f9',
                      color: currentPage === totalPages ? '#94a3b8' : '#334155',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    Next <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* View Employee Modal */}
      {isModalOpen && isViewMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '600px',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Employee Details
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                &times;
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
                  {currentEmployee.empName?.charAt(0) || 'E'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {currentEmployee.empName}
                  </h3>
                  <p style={{ color: '#64748b' }}>ID: {currentEmployee.id}</p>
                  <p style={{ color: '#64748b' }}>{currentEmployee.jobTitle}</p>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <h4 style={{ color: '#64748b', marginBottom: '0.5rem' }}>Basic Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Employee ID</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.id || '--'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Gender</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.gender || '--'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Email</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.email || '--'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Joining Date</p>
                    <p style={{ fontWeight: '500' }}>
                      {currentEmployee.joiningDate ? new Date(currentEmployee.joiningDate).toLocaleDateString() : '--'}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <h4 style={{ color: '#64748b', marginBottom: '0.5rem' }}>Job Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Department</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.department || '--'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Job Title</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.jobTitle || '--'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>CTC</p>
                    <p style={{ fontWeight: '500' }}>₹{currentEmployee.ctc || '--'}</p>
                  </div>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <h4 style={{ color: '#64748b', marginBottom: '0.5rem' }}>Bank Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Bank Name</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.bankName || '--'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Account Number</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.accNo || '--'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Aadhar Number</p>
                    <p style={{ fontWeight: '500' }}>{currentEmployee.adharNo || '--'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Employee Modal */}
      {isModalOpen && !isViewMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '600px',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                {isEditMode ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#334155'
                  }}>
                    Full Name
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
                      name="empName"
                      value={currentEmployee.empName}
                      onChange={handleInputChange}
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
                    Aadhar Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiCreditCard style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }} />
                    <input
                      type="text"
                      name="adharNo"
                      value={currentEmployee.adharNo}
                      onChange={handleInputChange}
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
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={currentEmployee.gender}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1rem',
                      appearance: 'none'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#334155'
                  }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiMail style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }} />
                    <input
                      type="email"
                      name="email"
                      value={currentEmployee.email}
                      onChange={handleInputChange}
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
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={currentEmployee.department}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#334155'
                  }}>
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={currentEmployee.jobTitle}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#334155'
                  }}>
                    Joining Date
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
                      name="joiningDate"
                      value={currentEmployee.joiningDate}
                      onChange={handleInputChange}
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
                    CTC (₹)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiDollarSign style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }} />
                    <input
                      type="number"
                      name="ctc"
                      value={currentEmployee.ctc}
                      onChange={handleInputChange}
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
                    Bank Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiHome style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }} />
                    <input
                      type="text"
                      name="bankName"
                      value={currentEmployee.bankName}
                      onChange={handleInputChange}
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
                    Account Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiCreditCard style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b'
                    }} />
                    <input
                      type="text"
                      name="accNo"
                      value={currentEmployee.accNo}
                      onChange={handleInputChange}
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

              {error && (
                <div style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
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

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#f1f5f9',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
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
                    gap: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 22V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : isEditMode ? 'Update Employee' : 'Create Employee'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeDashboard;