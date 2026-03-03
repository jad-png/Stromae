/**
 * User Profile Page
 */

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Calendar, BookmarkPlus, Eye, CheckCircle2,
  Settings, LogOut, Download, Lock, Pencil, Save, X,
} from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import AuthContext from '../../context/AuthContext';
import { WatchlistService, WatchHistoryService } from '../../services/WatchlistService';
import { LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/Common';
import { formatDate } from '../../utils/helpers';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
    setFormData({ username: user.username, email: user.email });
    setIsLoading(false);
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.username || !formData.email) {
      setError('Username and email are required');
      return;
    }

    updateUser({ ...user, ...formData });
    setSuccess('Profile updated successfully');
    setIsEditing(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  if (!isAuthenticated || !user) return <LoadingSpinner message="Redirecting..." />;
  if (isLoading) return <MainLayout><LoadingSpinner message="Loading profile..." /></MainLayout>;

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BookmarkPlus, label: 'Watchlist', value: stats.watchlistCount, color: 'text-brand-400', bg: 'bg-brand-500/10' },
            { icon: Eye, label: 'Watched', value: stats.historyCount, color: 'text-accent-400', bg: 'bg-accent-500/10' },
            { icon: CheckCircle2, label: 'Completed', value: stats.completedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="card p-4 text-center">
              <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Edit Profile */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-brand-400" />
              <h2 className="text-base font-semibold text-gray-200">Profile Settings</h2>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-ghost btn-sm">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-outline flex-1">
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
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
          )}
        </div>

        {/* Account Actions */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-gray-200 mb-4">Account Actions</h3>
          <div className="space-y-2">
            <button className="btn-outline w-full justify-start">
              <Lock className="h-4 w-4" />
              Change Password
            </button>
            <button className="btn-outline w-full justify-start">
              <Download className="h-4 w-4" />
              Download My Data
            </button>
            <button onClick={handleLogout} className="btn-danger w-full justify-start">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
