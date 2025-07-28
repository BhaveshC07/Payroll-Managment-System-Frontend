import DashboardLayout from '../components/DashboardLayout';

const userLinks = [
  { name: "Employee Profile", path: "/userdashboard/employeeprofile" },
  { name: "Generate Payslip", path: "/userdashboard/emppayslipgenerator" },
  { name: "Time Tracking", path: "/userdashboard/timetracking" }
];

export default function UserDashboard() {
  return <DashboardLayout links={userLinks} role="user" />;
}
