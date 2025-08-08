import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import here
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext'; // Import your AuthProvider

function App() {
    return (
        // Remove BrowserRouter wrapper here, as it should be in main.jsx/index.js
        <AuthProvider>
            <Routes>
                {/* Public route for login */}
                <Route path="/" element={<Login />} />

                {/* Protected routes wrapped by PrivateRoute */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <Users />
                        </PrivateRoute>
                    }
                />

                {/* You might want a catch-all route for 404s */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </AuthProvider>
    );
}

export default App;
