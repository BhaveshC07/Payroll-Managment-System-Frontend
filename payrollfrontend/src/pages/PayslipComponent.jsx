import React from 'react';
import { FiUser, FiDollarSign, FiPercent, FiCreditCard, FiClock, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { usePDF } from 'react-to-pdf';

const PayslipComponent = ({ payslipData }) => {
  // Robust date handling with fallbacks
  const getDateInfo = () => {
    const now = new Date();
    const defaultMonth = now.getMonth() + 1; // 1-12
    const defaultYear = now.getFullYear();

    // Validate month (1-12)
    const month = typeof payslipData?.month === 'number' 
      ? Math.max(1, Math.min(12, payslipData.month))
      : defaultMonth;

    // Validate year
    const year = typeof payslipData?.year === 'number' && payslipData.year > 2000
      ? payslipData.year
      : defaultYear;

    // Get month name
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    return { month, year, monthName };
  };

  const { monthName, month, year } = getDateInfo();
  const totalDeductions = payslipData.pf + payslipData.insurance + payslipData.taxAmount;
  
  // PDF generation
  const { toPDF, targetRef } = usePDF({
    filename: `Payslip_${payslipData.empName}_${monthName}_${year}.pdf`,
    page: { margin: 10 }
  });

  const formatCurrency = (value) => `₹${value.toFixed(2)}`;

  return (
    <div style={{ 
      background: 'white', 
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* PDF Download Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => toPDF()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}
      >
        <FiDownload size={18} />
        Download Payslip
      </motion.button>

      {/* Payslip Card */}
      <motion.div 
        ref={targetRef}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '800px',
          padding: '3rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  }}>
    
    <span style={{
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#1d4ed8', // Solid color for PDF
      '@media screen': { // Gradient for web
        background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }
    }}>
      EMPLOYEE PAYSLEEP
    </span>
  </div>
  <h1 style={{ 
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem'
  }}>
    For {monthName} {year}
  </h1>
</div>

        {/* Employee Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            padding: '1.5rem',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Employee Name</div>
            <div style={{ fontWeight: '500', color: '#1e293b' }}>{payslipData.empName}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Employee ID</div>
            <div style={{ fontWeight: '500', color: '#1e293b' }}>{payslipData.employeeId}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Department</div>
            <div style={{ fontWeight: '500', color: '#1e293b' }}>{payslipData.department}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Job Title</div>
            <div style={{ fontWeight: '500', color: '#1e293b' }}>{payslipData.jobTitle}</div>
          </div>
        </motion.div>

        {/* Earnings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiDollarSign color="#3b82f6" /> Earnings
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem', textAlign: 'left', color: '#475569' }}>Basic Salary</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500', color: '#475569' }}>
                  {formatCurrency(payslipData.totalWorkHoursPay)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', textAlign: 'left', color: '#475569' }}>Overtime Pay</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500', color: '#475569' }}>
                  {formatCurrency(payslipData.overtimePay)}
                </td>
              </tr>
              <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#1e40af' }}>Gross Salary</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#1e40af' }}>
                  {formatCurrency(payslipData.grossSalary)}
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Deductions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiPercent color="#3b82f6" /> Deductions
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem', textAlign: 'left', color: '#475569' }}>Tax Deduction</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500', color: '#475569' }}>
                  {formatCurrency(payslipData.taxAmount)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', textAlign: 'left', color: '#475569' }}>Provident Fund (PF)</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500', color: '#475569' }}>
                  {formatCurrency(payslipData.pf)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', textAlign: 'left', color: '#475569' }}>Insurance</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500', color: '#475569' }}>
                  {formatCurrency(payslipData.insurance)}
                </td>
              </tr>
              <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#1e40af' }}>Total Deductions</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#1e40af' }}>
                  {formatCurrency(totalDeductions)}
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Salary Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ 
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiCreditCard color="#3b82f6" /> Salary Summary
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Gross Salary</span>
            <span style={{ fontWeight: '500', color: '#475569' }}>{formatCurrency(payslipData.grossSalary)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Total Deductions</span>
            <span style={{ fontWeight: '500', color: '#dc2626' }}>- {formatCurrency(totalDeductions)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem', 
            paddingTop: '0.5rem', 
            borderTop: '1px solid #e2e8f0' 
          }}>
            <span style={{ fontWeight: '600' }}>Net Salary</span>
            <span style={{ fontWeight: '600', color: '#16a34a' }}>{formatCurrency(payslipData.finalPayableSalary)}</span>
          </div>
        </motion.div>

        {/* Attendance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiClock color="#3b82f6" /> Attendance Summary
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>
                {payslipData.totalWorkingDays}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Working Days</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>
                {payslipData.totalPresentDays}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Present Days</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>
                {payslipData.totalLeaves}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Leaves Taken</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>
                {payslipData.totalOvertimeHours.toFixed(1)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Overtime Hours</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            padding: '1.5rem',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.875rem',
            borderTop: '1px solid #e2e8f0',
            marginTop: '1.5rem'
          }}
        >
          <p>This is a computer generated payslip and does not require signature.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PayslipComponent;