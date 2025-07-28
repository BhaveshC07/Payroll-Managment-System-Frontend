import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React, { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import EmpPayslipGenerator from './pages/EmpPayslipGenerator';
import TimeTracking from './pages/TimeTracking';
import AdminAttendance from './pages/AdminAttendance';
import PayslipGeneratorForm from './pages/PayslipGeneratorForm';
import EmployeeDashboard from './pages/EmployeeDashboard';
import OwnerHome from './pages/OwnerHome';
import UserHome from './pages/UserHome';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard Routes */}
        <Route path="/userdashboard" element={<UserDashboard />}>
          <Route index element={<UserHome />} /> {/* This loads by default */}
          <Route path="employeeprofile" element={<EmployeeProfile />} />
          <Route path="timetracking" element={<TimeTracking />} />
           <Route path="emppayslipgenerator" element={<EmpPayslipGenerator />} />
            <Route path="/userdashboard/userhome" element={<UserHome />} />
        </Route>

        {/* Owner Dashboard Routes */}
        <Route path="/ownerdashboard" element={<OwnerDashboard />}>
          <Route index element={<OwnerHome />} /> {/* This loads by default */}
          <Route path="employeedashboard" element={<EmployeeDashboard />} />
          <Route path="adminattendance" element={<AdminAttendance />} />
          <Route path="payslipgenerator" element={<PayslipGeneratorForm />} />
           <Route path="/ownerdashboard/ownerhome" element={<OwnerHome />} />
        </Route>

       
      
      </Routes>
    </BrowserRouter>
  );
}
