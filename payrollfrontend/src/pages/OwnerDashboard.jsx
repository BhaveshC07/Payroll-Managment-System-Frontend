import DashboardLayout from '../components/DashboardLayout';

const ownerLinks = [
  { name: "All Employees", path: "/ownerdashboard/employeedashboard" },
  { name: "Admin Attendance", path: "/ownerdashboard/adminattendance" },
  { name: "Payslip Generator", path: "/ownerdashboard/payslipgenerator" }
];

export default function OwnerDashboard() {
  return <DashboardLayout links={ownerLinks} role="owner" />;
}
