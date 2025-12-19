import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import { TrendingUp, Calendar, BookOpen, Target } from 'lucide-react';
import statsService from '../../services/statsService';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading statistics..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Avg Pages/Day"
        value={stats.averages.last7Days}
        subtitle="Last 7 days"
        icon={TrendingUp}
        gradient="from-teal-400 to-teal-600"
      />
      
      <StatsCard
        title="Active Days"
        value={stats.activeDays.last7Days}
        subtitle="Days with reading sessions"
        icon={Calendar}
        iconColor="text-gray-400"
      />
      
      <StatsCard
        title="Total Books"
        value={stats.books.total}
        subtitle="In your library"
        icon={BookOpen}
        iconColor="text-gray-400"
      />
      
      <StatsCard
        title="Completed"
        value={stats.books.completed}
        subtitle="Books finished"
        icon={Target}
        iconColor="text-gray-400"
      />
    </div>
  );
};

export default StatsDashboard;