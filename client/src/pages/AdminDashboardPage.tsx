// client/src/pages/AdminDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { getAdminAnalytics, AdminAnalyticsData } from '../services/adminService';

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAdminAnalytics();
        setData(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin data.');
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
          <p className="text-3xl">{data.totalUsers ?? 'N/A'}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Users by Role</h2>
          {data.usersByRole && data.usersByRole.length > 0 ? (
            <ul>
              {data.usersByRole.map(roleInfo => (
                <li key={roleInfo.role} className="text-lg">
                  {roleInfo.role}: {roleInfo.count}
                </li>
              ))}
            </ul>
          ) : (
            <p>No role data available.</p>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Content Items</h2>
          <p className="text-3xl">{data.totalContentItems ?? 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
