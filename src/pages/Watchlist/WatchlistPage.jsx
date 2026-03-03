/**
 * Watchlist Page
 */

import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Play, Star, Clock, Film, BookmarkX, BarChart3 } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import AuthContext from '../../context/AuthContext';
import { WatchlistService } from '../../services/WatchlistService';
import { VideoService } from '../../services/VideoService';
import { EmptyState, LoadingSpinner } from '../../components/Common';
import { formatDate } from '../../utils/helpers';

const WatchlistPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [videosMap, setVideosMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const items = WatchlistService.getWatchlist(user.id);
    setWatchlistItems(items);

    const map = {};
    items.forEach((item) => {
      const video = VideoService.getVideoById(item.videoId);
      if (video) map[item.videoId] = video;
    });
    setVideosMap(map);
    setIsLoading(false);
  }, [user, isAuthenticated]);

  const handleRemove = (watchlistId) => {
    if (!user) return;
    WatchlistService.removeFromWatchlist(user.id, watchlistId);
    setWatchlistItems(WatchlistService.getWatchlist(user.id));
  };

  const handleClearAll = () => {
    if (!user || !confirm('Clear your entire watchlist?')) return;
    WatchlistService.clearWatchlist(user.id);
    setWatchlistItems([]);
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-16">
          <EmptyState
            title="Login Required"
            description="Sign in to view and manage your watchlist"
            action={<Link to="/login" className="btn-primary">Sign In</Link>}
          />
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Loading watchlist..." />
      </MainLayout>
    );
  }

  const totalDuration = watchlistItems.reduce((sum, item) => sum + (videosMap[item.videoId]?.duration || 0), 0);
  const avgRating = watchlistItems.length > 0
    ? (watchlistItems.reduce((sum, item) => sum + (videosMap[item.videoId]?.rating || 0), 0) / watchlistItems.length).toFixed(1)
    : '0';

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
            <p className="mt-1 text-sm text-gray-500">
              {watchlistItems.length} item{watchlistItems.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {watchlistItems.length > 0 && (
            <button onClick={handleClearAll} className="btn-danger btn-sm">
              <BookmarkX className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {watchlistItems.length === 0 ? (
          <EmptyState
            title="Your watchlist is empty"
            description="Browse videos and save them to watch later"
            action={<Link to="/" className="btn-primary">Browse Videos</Link>}
          />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Film, label: 'Total Items', value: watchlistItems.length, color: 'text-brand-400', bg: 'bg-brand-500/10' },
                { icon: Star, label: 'Avg Rating', value: avgRating, color: 'text-sunset-400', bg: 'bg-sunset-500/10' },
                { icon: Clock, label: 'Total Duration', value: `${totalDuration} min`, color: 'text-ocean-400', bg: 'bg-ocean-500/10' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="card flex items-center gap-4 p-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-xl font-bold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Watchlist Items */}
            <div className="space-y-3">
              {watchlistItems.map((item) => {
                const video = videosMap[item.videoId];
                if (!video) return null;

                return (
                  <div
                    key={item.id}
                    className="card flex flex-col gap-4 p-4 transition-all hover:border-brand-500/20 sm:flex-row sm:items-center animate-fade-in"
                  >
                    {/* Thumbnail */}
                    <Link to={`/video/${video.id}`} className="shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-20 w-14 rounded-lg object-cover sm:h-16 sm:w-12"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/video/${video.id}`} className="text-sm font-semibold text-white hover:text-brand-400 transition-colors line-clamp-1">
                        {video.title}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="badge badge-brand text-[10px]">{video.type}</span>
                        <span className="text-xs text-gray-500">{video.releaseYear}</span>
                        <span className="flex items-center gap-1 text-xs text-sunset-400">
                          <Star className="h-3 w-3 fill-sunset-400" />
                          {video.rating}
                        </span>
                        <span className="text-xs text-gray-600">{video.duration} min</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        Added {formatDate(item.addedAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/video/${video.id}`} className="btn-ghost btn-sm">
                        <Play className="h-4 w-4" />
                        Watch
                      </Link>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default WatchlistPage;
