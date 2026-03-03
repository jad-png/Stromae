/**
 * User Profile Page
 */

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Calendar, BookmarkPlus, Eye, CheckCircle2,
  LogOut,
} from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import AuthContext from '../../context/AuthContext';
import { WatchlistService, WatchHistoryService } from '../../services/WatchlistService';
import { LoadingSpinner } from '../../components/Common';
import { formatDate } from '../../utils/helpers';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ watchlistCount: 0, historyCount: 0, completedCount: 0 });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const watchlistCount = WatchlistService.getWatchlistCount(user.id);
    const watchHistory = WatchHistoryService.getWatchHistory(user.id);
    const completedCount = watchHistory.filter((h) => h.completed).length;

    setStats({ watchlistCount, historyCount: watchHistory.length, completedCount });
    setIsLoading(false);
  }, [user, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) return <LoadingSpinner message="Redirecting..." />;
  if (isLoading) return <MainLayout><LoadingSpinner message="Loading profile..." /></MainLayout>;

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        {/* Profile Header */}
        <div className="card p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/20">
              <span className="font-display text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white truncate">{user.username}</h1>
              <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                <Calendar className="h-3 w-3" />
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-200 mb-4">Account Information</h2>
          <div className="space-y-4">
            {[
              { icon: User, label: 'Username', value: user.username },
              { icon: Mail, label: 'Email', value: user.email },
              { icon: Calendar, label: 'Account Created', value: formatDate(user.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg bg-gray-800/20 px-4 py-3">
                <Icon className="h-4 w-4 text-gray-500 shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-500">{label}</p>
                  <p className="text-sm text-gray-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viewing Statistics */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-200 mb-4">Viewing Statistics</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BookmarkPlus, label: 'Watchlist', value: stats.watchlistCount, color: 'text-brand-400', bg: 'bg-brand-500/10' },
              { icon: Eye, label: 'Watched', value: stats.historyCount, color: 'text-accent-400', bg: 'bg-accent-500/10' },
              { icon: CheckCircle2, label: 'Completed', value: stats.completedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-gray-800/20">
                <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="btn-danger w-full justify-center">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
