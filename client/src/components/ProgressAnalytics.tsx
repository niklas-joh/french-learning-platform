import React, { useState, useEffect } from 'react';
import { getUserProgress } from '../services/userService';
import { TopicProgress } from '../types/Progress';

const ProgressAnalytics: React.FC = () => {
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getUserProgress();
        setProgress(data);
        setError(null);
      } catch (err) {
        setError('Failed to load progress data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return <div>Loading progress...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">My Progress</h2>
      {progress.length === 0 ? (
        <p>No progress data available yet.</p>
      ) : (
        <div className="space-y-4">
          {progress.map((item) => (
            <div key={item.topicId}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{item.topicName}</span>
                <span className="text-sm font-medium text-gray-700">{`${item.completedCount} / ${item.totalCount} (${item.percentage}%)`}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressAnalytics;
