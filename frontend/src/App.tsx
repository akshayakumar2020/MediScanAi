import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Patient pages
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const MyReports = lazy(() => import('./pages/user/MyReports'));
const UploadReport = lazy(() => import('./pages/user/UploadReport'));
const ReportDetail = lazy(() => import('./pages/user/ReportDetail'));
const Appointments = lazy(() => import('./pages/user/Appointments'));
const FindDoctors = lazy(() => import('./pages/user/FindDoctors'));
const ChatAssistant = lazy(() => import('./pages/user/ChatAssistant'));
const HealthMetrics = lazy(() => import('./pages/user/HealthMetrics'));
const UserSettings = lazy(() => import('./pages/user/UserSettings'));

// Doctor pages
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorPatients = lazy(() => import('./pages/doctor/DoctorPatients'));
const DoctorReports = lazy(() => import('./pages/doctor/DoctorReports'));
const DoctorSchedule = lazy(() => import('./pages/doctor/DoctorSchedule'));
const DoctorNotes = lazy(() => import('./pages/doctor/DoctorNotes'));
const DoctorSettings = lazy(() => import('./pages/doctor/DoctorSettings'));
const PendingApproval = lazy(() => import('./pages/doctor/PendingApproval'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminDoctors = lazy(() => import('./pages/admin/AdminDoctors'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const SystemHealth = lazy(() => import('./pages/admin/SystemHealth'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const Loading = () => (
  <div className="loading-page">
    <div className="spinner" />
    <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Loading...</p>
  </div>
);

// Sidebar menu configs
const patientSidebarItems = [
  { path: '/user/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/user/reports', label: 'My Reports', icon: '📄' },
  { path: '/user/upload', label: 'Upload Report', icon: '📤' },
  { path: '/user/appointments', label: 'Appointments', icon: '📅' },
  { path: '/user/find-doctors', label: 'Find Doctors', icon: '👨‍⚕️' },
  { path: '/user/chat', label: 'AI Assistant', icon: '🤖' },
  { path: '/user/health-metrics', label: 'Health Metrics', icon: '❤️' },
  { path: '/user/settings', label: 'Settings', icon: '⚙️' },
];

const doctorSidebarItems = [
  { path: '/doctor/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/doctor/patients', label: 'My Patients', icon: '👥' },
  { path: '/doctor/reports', label: 'Pending Reports', icon: '📋' },
  { path: '/doctor/schedule', label: 'Schedule', icon: '📅' },
  { path: '/doctor/notes', label: 'Notes', icon: '📝' },
  { path: '/doctor/settings', label: 'Settings', icon: '⚙️' },
];

const adminSidebarItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/doctors', label: 'Doctors', icon: '👨‍⚕️' },
  { path: '/admin/reports', label: 'Reports', icon: '📄' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/system-health', label: 'System Health', icon: '🔧' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const getDashboardPath = (role: string) => {
  switch (role) {
    case 'PATIENT': return '/user/dashboard';
    case 'DOCTOR': return '/doctor/dashboard';
    case 'ADMIN': return '/admin/dashboard';
    default: return '/';
  }
};

const SmartRedirect = () => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  return <LandingPage />;
};

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SmartRedirect />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Patient Routes */}
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <DashboardLayout sidebarItems={patientSidebarItems} sidebarTitle="Patient" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="reports" element={<MyReports />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="upload" element={<UploadReport />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="find-doctors" element={<FindDoctors />} />
          <Route path="chat" element={<ChatAssistant />} />
          <Route path="health-metrics" element={<HealthMetrics />} />
          <Route path="settings" element={<UserSettings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DashboardLayout sidebarItems={doctorSidebarItems} sidebarTitle="Doctor" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="reports" element={<DoctorReports />} />
          <Route path="reports/:id" element={<DoctorReports />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="notes" element={<DoctorNotes />} />
          <Route path="settings" element={<DoctorSettings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Doctor Pending Approval */}
        <Route path="/doctor/pending" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <PendingApproval />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout sidebarItems={adminSidebarItems} sidebarTitle="Admin" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="system-health" element={<SystemHealth />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="status-page">
            <div className="status-icon">🔍</div>
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </Suspense>
  );
};

export default App;
