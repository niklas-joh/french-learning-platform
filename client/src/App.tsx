import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css'; // Import Tailwind CSS
import LoginPage from './pages/LoginPage'; // Import the actual component
import RegisterPage from './pages/RegisterPage'; // Import the actual RegisterPage component

// Placeholder components - these will be created in subsequent steps
// const LoginPage = () => <div className="p-4"><h1 className="text-2xl font-bold text-blue-600">Login Page</h1><p>Login form will go here.</p><Link to="/register" className="text-blue-500 hover:underline">Go to Register</Link><br/><Link to="/dashboard" className="text-blue-500 hover:underline">Go to Dashboard (temp)</Link></div>;
// const RegisterPage = () => <div className="p-4"><h1 className="text-2xl font-bold text-green-600">Register Page</h1><p>Registration form will go here.</p><Link to="/login" className="text-blue-500 hover:underline">Go to Login</Link></div>;
const DashboardPage = () => <div className="p-4"><h1 className="text-2xl font-bold text-purple-600">Dashboard</h1><p>User dashboard content.</p><Link to="/" className="text-blue-500 hover:underline">Go to Home (Login)</Link></div>;
const NotFoundPage = () => <div className="p-4"><h1 className="text-2xl font-bold text-red-600">404 - Page Not Found</h1><Link to="/" className="text-blue-500 hover:underline">Go Home</Link></div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex space-x-4">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
