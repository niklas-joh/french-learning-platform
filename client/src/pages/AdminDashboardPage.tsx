// client/src/pages/AdminDashboardPage.tsx
import React, { useEffect, useState } from 'react';
// import { getAdminAnalytics } from '../services/adminService'; // Assuming you'll create this

interface AdminData {
  totalUsers?: number;
  // Add other expected data fields
}

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const response = await getAdminAnalytics(); // Replace with actual API call
        // For now, using placeholder data.
        // You'll need to implement adminService.ts and the corresponding backend endpoint.
        const placeholderData: AdminData = {
          totalUsers: 100, // Example data
        };
        // setData(response.data); // When API call is ready
        setData(placeholderData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch admin data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading admin dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return <div className="p-4">No admin data available.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl">{data.totalUsers || 'N/A'}</p>
        </div>
        {/* Add more cards for other analytics */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p>Manage topics, lessons, quizzes.</p>
          {/* Links or buttons to content management sections */}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p>View users, manage roles.</p>
          {/* Links or buttons to user management sections */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
