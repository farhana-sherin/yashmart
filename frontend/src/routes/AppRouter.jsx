import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleProtectedRoute from "@/routes/RoleProtectedRoute";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/profile/Profile";
import ChangePassword from "@/pages/auth/ChangePassword";
import DashboardHome from "@/pages/dashboard/DashboardHome";

// Attendance Pages
import AttendanceDashboard from "@/pages/attendance/AttendanceDashboard";
import AttendanceHistory from "@/pages/attendance/AttendanceHistory";
import CheckIn from "@/pages/attendance/CheckIn";
import CheckOut from "@/pages/attendance/CheckOut";
import QRScanner from "@/pages/attendance/QRScanner";
import AttendanceReport from "@/pages/attendance/AttendanceReport";
import StaffAttendance from "@/pages/attendance/StaffAttendance";

// Customer Pages
import CustomerList from "@/pages/customers/CustomerList";
import CustomerCreate from "@/pages/customers/CustomerCreate";
import CustomerEdit from "@/pages/customers/CustomerEdit";
import CustomerDetail from "@/pages/customers/CustomerDetail";

// Staff Pages
import StaffList from "@/pages/staff/StaffList";
import StaffCreate from "@/pages/staff/StaffCreate";
import StaffEdit from "@/pages/staff/StaffEdit";
import StaffDetail from "@/pages/staff/StaffDetail";

// Reward Pages
import RewardDashboard from "@/pages/rewards/RewardDashboard";
import RewardHistory from "@/pages/rewards/RewardHistory";

// Offer Pages
import OfferList from "@/pages/offers/OfferList";
import OfferCreate from "@/pages/offers/OfferCreate";
import OfferEdit from "@/pages/offers/OfferEdit";

// Settings & Analytics
import SettingsPage from "@/pages/settings/SettingsPage";
import AdvancedAnalytics from "@/pages/analytics/AdvancedAnalytics";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          
          {/* Staff & Admin Shared Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={["ADMIN", "STAFF"]} />}>
            <Route path="/attendance" element={<AttendanceDashboard />} />
            <Route path="/attendance/history" element={<AttendanceHistory />} />
            <Route path="/attendance/check-in" element={<CheckIn />} />
            <Route path="/attendance/check-out" element={<CheckOut />} />
            <Route path="/attendance/qr-scanner" element={<QRScanner />} />
            
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/create" element={<CustomerCreate />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/customers/:id/edit" element={<CustomerEdit />} />

            <Route path="/rewards" element={<RewardDashboard />} />
            <Route path="/rewards/history" element={<RewardHistory />} />

            <Route path="/offers" element={<OfferList />} />
          </Route>

          {/* Admin Only Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/attendance/reports" element={<AttendanceReport />} />
            <Route path="/attendance/staff" element={<StaffAttendance />} />
            
            <Route path="/staff" element={<StaffList />} />
            <Route path="/staff/create" element={<StaffCreate />} />
            <Route path="/staff/:id" element={<StaffDetail />} />
            <Route path="/staff/:id/edit" element={<StaffEdit />} />

            <Route path="/offers/create" element={<OfferCreate />} />
            <Route path="/offers/:id/edit" element={<OfferEdit />} />
            
            <Route path="/analytics" element={<AdvancedAnalytics />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          {/* Customer Only Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={["CUSTOMER"]} />}>
            <Route path="/my-rewards" element={<RewardHistory />} />
            <Route path="/browse-offers" element={<OfferList />} />
          </Route>
        </Route>
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
