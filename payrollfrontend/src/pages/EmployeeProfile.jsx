import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { 
  Box, Typography, Avatar, Divider, Skeleton,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  Email, Badge, Work, Groups, Event, 
  AccountBalance, AttachMoney, Person
} from '@mui/icons-material';

// Helper function to format numbers in Indian style
const formatIndianCurrency = (num) => {
  if (!num) return '₹--';
  
  // Format with 2 decimal places for paise
  const numStr = parseFloat(num).toFixed(2);
  
  // Split into rupees and paise
  const [rupees, paise] = numStr.split('.');
  
  // Format rupees part with Indian separators
  const lastThree = rupees.slice(-3);
  const otherNumbers = rupees.slice(0, -3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  
  // Remove leading comma if any
  return `₹${formatted.startsWith(',') ? formatted.slice(1) : formatted}`;
};

const DetailRow = ({ icon, label, value }) => {
  const IconComponent = icon;
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      py: 2,
      borderBottom: '1px solid rgba(0,0,0,0.08)'
    }}>
      <Box sx={{ 
        width: 40, 
        height: 40, 
        borderRadius: '50%', 
        bgcolor: 'rgba(0,0,0,0.05)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <IconComponent sx={{ color: 'text.secondary' }} />
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
        <Typography variant="body1">{value || '--'}</Typography>
      </Box>
    </Box>
  );
};

const EmployeeProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const decoded = jwtDecode(token);
        const email = decoded.sub || decoded.email || decoded.username;
        
        const response = await axios.get(`http://localhost:9090/employee/by-email/${email}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setProfile(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ p: isMobile ? 2 : 4, maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Skeleton variant="circular" width={100} height={100} />
            <Box>
              <Skeleton variant="text" width={200} height={40} />
              <Skeleton variant="text" width={150} height={30} />
            </Box>
          </Box>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4, 
      maxWidth: 800, 
      mx: 'auto',
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      {/* Profile Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3, 
        mb: 4,
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <Avatar
          sx={{ 
            width: 100, 
            height: 100, 
            fontSize: '2.5rem',
            bgcolor: 'primary.main',
          }}
        >
          {profile.empName?.charAt(0) || 'U'}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {profile.empName}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.jobTitle}, {profile.department}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Profile Details */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 2
      }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Personal Information</Typography>
          <DetailRow icon={Email} label="Email" value={profile.email} />
          <DetailRow icon={Badge} label="Employee ID" value={profile.id} />
          <DetailRow icon={Person} label="Gender" value={profile.gender} />
          <DetailRow icon={Event} label="Joining Date" value={profile.joiningDate} />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Professional Details</Typography>
          <DetailRow icon={Work} label="Job Title" value={profile.jobTitle} />
          <DetailRow icon={Groups} label="Department" value={profile.department} />
          <DetailRow 
            icon={AttachMoney} 
            label="CTC" 
            value={formatIndianCurrency(profile.ctc)} 
          />
          <DetailRow 
            icon={AccountBalance} 
            label="Bank Account" 
            value={`${profile.bankName} ${profile.accNo?.toString().slice(0)}`} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeProfile;