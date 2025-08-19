import { Routes, Route, Outlet, Navigate } from 'react-router-dom'; // Added Outlet and Navigate
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Profile from './pages/Profile';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import './index.css'; // Ensure Tailwind CSS is imported

function App() {
    return (
        <AuthProvider>
            {/* The main Routes component now defines public and protected routes */}
            <Routes>
                {/* Public Routes - these paths do NOT have the sidebar layout */}
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes with Sidebar Layout */}
                {/* The 'element' here is a layout component. Its children routes will render within its <Outlet> */}
                {/* This ensures the Sidebar and authentication checks are consistently applied to these paths */}
                <Route element={<AuthenticatedLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    {/* Add more protected routes here as needed */}
                </Route>
            </Routes>
        </AuthProvider>
    );
}

// Renamed from PrivateRouteWithSidebar to AuthenticatedLayout for clarity.
// This component now acts as the layout wrapper for all protected routes.
// It handles:
// 1. Displaying a loading state during the initial authentication check.
// 2. Redirecting unauthenticated users to the login page.
// 3. Rendering the common layout (Sidebar + main content area via Outlet) for authenticated users.
const AuthenticatedLayout = () => {
    const { authReady, user } = useAuth(); // Access auth state from AuthContext

    // Show loading state while authentication check is in progress
    if (!authReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="text-center text-xl font-semibold text-gray-700 p-10 bg-white rounded-2xl shadow-xl animate-pulse">
                    <div className="flex items-center justify-center space-x-3">
                        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span>Loading authentication...</span>
                    </div>
                </div>
            </div>
        );
    }

    // If authentication check is complete and no user is found, redirect to the login page.
    // Using <Navigate> here prevents rendering the protected content or a duplicated Login form.
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If authenticated, render the layout: Sidebar on the left, and the matched child route content on the right.
    return (
        <div className="flex h-screen w-full"> {/* Ensure this div takes full screen width and height */}
            <Sidebar /> {/* The Sidebar is rendered once as part of this layout */}
            <div className="flex-grow overflow-y-auto"> {/* Main content area, allows scrolling if content overflows */}
                <Outlet /> {/* This is where the actual page components (Dashboard, Users, Profile, etc.) will render */}
            </div>
        </div>
    );
};


export default App;
