/**
 * VideoCard Component - Modern card with gradient overlay and hover effects
 */

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Play, BookmarkPlus, BookmarkCheck, Clock, Calendar } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { useWatchlist } from '../../hooks';
import { getCategoryById } from '../../services/VideoService';

const VideoCard = ({ video }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist(user?.id);

  const category = getCategoryById(video.categoryId);
  const inWatchlist = isInWatchlist(video.id);

  const typeColors = {

    FILM: 'badge-brand',
    SERIE: 'badge-accent',
    DOCUMENTAIRE: 'badge-ocean',
  };

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    if (inWatchlist) {
      removeFromWatchlist(video.id);
    } else {
      addToWatchlist(video.id);
    }
  };

  return (
    <div className="group animate-fade-in">
      <div className="card overflow-hidden transition-all duration-300 hover:border-brand-500/30 hover:shadow-glow">
        {/* Image */}
        <Link to={`/video/${video.id}`} className="block relative aspect-[3/4] overflow-hidden">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/90 shadow-lg shadow-brand-500/30 backdrop-blur-sm">
              <Play className="h-6 w-6 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`badge ${typeColors[video.type] || 'badge-brand'}`}>
              {video.type}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-base font-bold text-white line-clamp-1 mb-1">
              {video.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {video.releaseYear}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {video.duration} min
              </span>
              {category && (
                <span className="badge-sunset badge text-[10px]">{category.name}</span>
              )}
            </div>
          </div>
        </Link>

        {/* Card Footer */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xs text-gray-500 line-clamp-1 flex-1 mr-2">
            {video.description}
          </p>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleWatchlistToggle}
              disabled={!isAuthenticated}
              className={`rounded-lg p-1.5 transition-colors ${
                inWatchlist
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-gray-500 hover:bg-brand-500/10 hover:text-brand-400'
              } disabled:opacity-30`}
              title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <BookmarkPlus className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
