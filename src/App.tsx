import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { useAuthStore, useUIStore } from './store';
import { ROLE_DASHBOARD_PATHS } from './config/navigation';
import { fetchCurrentUser } from './utils/api';

// Layout
import AppShell from './components/layout/AppShell';
import ModuleSyncCenter from './pages/ModuleSyncCenter';
import { ProtectedRoute } from './components/ProtectedRoute';
import GlobalSearchModal from './components/GlobalSearchModal';

// Public
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Shared Pages
import NotificationsPage from './pages/NotificationsPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import SupportPage from './pages/SupportPage';

// Dashboards
import AdminDashboard from './pages/admin/Dashboard';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import PartnerDashboard from './pages/partner/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import CustomerDashboard from './pages/customer/Dashboard';

// Super Admin Pages
import UserManagementPage from './pages/super-admin/UserManagement';
import SystemSettingsPage from './pages/super-admin/SystemSettings';
import SystemControlsPage from './pages/super-admin/SystemControls';

// Admin Pages
import CustomerManagementPage from './pages/admin/CustomerManagement';
import AssetManagementPage from './pages/admin/AssetManagement';

// Employee Pages
import MyTasksPage from './pages/employee/MyTasks';
import AttendancePage from './pages/employee/Attendance';
import WorkSchedulePage from './pages/employee/WorkSchedule';

// Partner Pages
import ProjectPipelinePage from './pages/partner/ProjectPipeline';
import EarningsPayoutsPage from './pages/partner/EarningsPayouts';

// Customer Pages
import InstallationPage from './pages/customer/Installation';
import ServiceRequestsPage from './pages/customer/ServiceRequests';
import MyDevicesPage from './pages/customer/MyDevices';
import PaymentsPage from './pages/customer/Payments';

// Placeholder
import PlaceholderPage from './pages/PlaceholderPage';

// Messages Pages
import PartnerMessagesPage from './pages/partner/Messages';

function RoleRedirect() {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  if (!isInitialized) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_DASHBOARD_PATHS[user.role]} replace />;
}

function SessionBootstrap() {
  const { token, isInitialized, setSession, clearSession, finishInitialization } = useAuthStore();

  React.useEffect(() => {
    let active = true;

    if (isInitialized) return;

    const bootstrap = async () => {
      if (!token) {
        if (active) finishInitialization();
        return;
      }

      try {
        const response = await fetchCurrentUser();
        if (active) {
          setSession({ user: response.user, token });
        }
      } catch {
        if (active) {
          clearSession();
        }
      } finally {
        if (active) {
          finishInitialization();
        }
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [token, isInitialized, setSession, clearSession, finishInitialization]);

  return null;
}

export default function App() {
  React.useEffect(() => {
    const { darkMode } = useUIStore.getState();
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  return (
    <BrowserRouter>
      <SessionBootstrap />
      <GlobalSearchModal />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Authenticated Routes */}
        <Route element={<AppShell />}>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Super Admin */}
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route
            path="/super-admin/dashboard-synced"
            element={
              <ProtectedRoute pageId="sa-dashboard-synced">
                <PlaceholderPage title="Synced Super Admin Dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/users"
            element={
              <ProtectedRoute pageId="sa-user-management">
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/system-settings"
            element={
              <ProtectedRoute pageId="sa-system-settings">
                <SystemSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/system-controls"
            element={
              <ProtectedRoute pageId="sa-system-controls">
                <SystemControlsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/workspace/sync-center" element={<ModuleSyncCenter />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/dashboard-synced"
            element={
              <ProtectedRoute pageId="admin-dashboard-synced">
                <PlaceholderPage title="Synced Admin Dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute pageId="admin-customer-mgmt">
                <CustomerManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers/:id"
            element={
              <ProtectedRoute pageId="admin-customer-detail">
                <PlaceholderPage title="Customer Detail" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assets"
            element={
              <ProtectedRoute pageId="admin-asset-mgmt">
                <AssetManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assets/overview"
            element={
              <ProtectedRoute pageId="admin-asset-overview">
                <PlaceholderPage title="Asset Overview" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operations"
            element={
              <ProtectedRoute pageId="admin-operations">
                <PlaceholderPage title="Operations Dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute pageId="admin-employee-mgmt">
                <PlaceholderPage title="Employee Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/:id"
            element={
              <ProtectedRoute pageId="admin-employee-detail">
                <PlaceholderPage title="Employee Detail" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <ProtectedRoute pageId="admin-partner-mgmt">
                <PlaceholderPage title="Partner Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/partners/:id"
            element={
              <ProtectedRoute pageId="admin-partner-detail">
                <PlaceholderPage title="Partner Detail" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute pageId="admin-complaints">
                <PlaceholderPage title="Complaint Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints/:id"
            element={
              <ProtectedRoute pageId="admin-complaint-detail">
                <PlaceholderPage title="Complaint Detail" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/service-requests"
            element={
              <ProtectedRoute pageId="admin-service-requests">
                <PlaceholderPage title="Service Requests" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assets/new"
            element={
              <ProtectedRoute pageId="admin-asset-new">
                <PlaceholderPage title="Add New Solar Asset" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute pageId="admin-inventory">
                <PlaceholderPage title="Inventory Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/financials"
            element={
              <ProtectedRoute pageId="admin-financials">
                <PlaceholderPage title="Financial Management" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute pageId="admin-settings">
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Partner */}
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route
            path="/partner/projects"
            element={
              <ProtectedRoute pageId="partner-projects">
                <ProjectPipelinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/earnings"
            element={
              <ProtectedRoute pageId="partner-earnings">
                <EarningsPayoutsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/messages"
            element={
              <ProtectedRoute pageId="partner-messages">
                <PartnerMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner/settings"
            element={
              <ProtectedRoute pageId="partner-settings">
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Employee */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute pageId="emp-tasks">
                <MyTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/tasks/:id"
            element={
              <ProtectedRoute pageId="emp-task-detail">
                <PlaceholderPage title="Task Detail" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute pageId="emp-attendance">
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/schedule"
            element={
              <ProtectedRoute pageId="emp-schedule">
                <WorkSchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute pageId="emp-profile">
                <PlaceholderPage title="My Profile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/settings"
            element={
              <ProtectedRoute pageId="emp-settings">
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Customer */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route
            path="/customer/installation"
            element={
              <ProtectedRoute pageId="cust-installation">
                <InstallationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/installation/history"
            element={
              <ProtectedRoute pageId="cust-installation-history">
                <PlaceholderPage title="Installation History" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/installation/heatmap"
            element={
              <ProtectedRoute pageId="cust-installation-heatmap">
                <PlaceholderPage title="Installation Heatmap" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/service/schedule"
            element={
              <ProtectedRoute pageId="cust-service-schedule">
                <PlaceholderPage title="Schedule Service Appointment" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/devices"
            element={
              <ProtectedRoute pageId="cust-devices">
                <MyDevicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/service"
            element={
              <ProtectedRoute pageId="cust-service">
                <ServiceRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/feedback"
            element={
              <ProtectedRoute pageId="cust-feedback">
                <PlaceholderPage title="Customer Feedback" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/payments"
            element={
              <ProtectedRoute pageId="cust-payments">
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/settings"
            element={
              <ProtectedRoute pageId="cust-settings">
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Shared / Brand */}
          <Route path="/shared/performance-summary" element={<PlaceholderPage title="Performance Summary" />} />
          <Route path="/brand/helios-enterprise" element={<PlaceholderPage title="Helios Enterprise" />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
