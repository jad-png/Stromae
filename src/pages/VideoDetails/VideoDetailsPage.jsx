/**
 * Video Details Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import {
  ArrowLeft, BookmarkPlus, BookmarkCheck, Star,
  Calendar, Users,
} from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import VideoCard from '../../components/VideoCard/VideoCard';
import { ErrorAlert, Rating, LoadingSpinner } from '../../components/Common';
import AuthContext from '../../context/AuthContext';
import { VideoService } from '../../services/VideoService';
import { useWatchlist } from '../../hooks';

const VideoDetailsPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist(user?.id);

  const [video, setVideo] = useState(null);
  const [similarVideos, setSimilarVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    try {
      const videoData = VideoService.getVideoById(videoId);
      if (!videoData) {
        setError('Video not found');
        setIsLoading(false);
        return;
      }

      setVideo(videoData);
      setSimilarVideos(VideoService.getSimilarVideos(videoId, 6));
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load video');
      setIsLoading(false);
    }
  }, [videoId]);

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Loading video..." />
      </MainLayout>
    );
  }

  if (error || !video) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <ErrorAlert message={error || 'Video not found'} />
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Catalog
          </button>
        </div>
      </MainLayout>
    );
  }

  const inWatchlist = isInWatchlist(video.id);

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    inWatchlist ? removeFromWatchlist(video.id) : addToWatchlist(video.id);
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    setIsRating(false);
  };

  const category = VideoService.getCategoryById(video.categoryId);

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="btn-ghost -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </button>

        {/* Video Player */}
        <div className="overflow-hidden rounded-2xl border border-gray-800/50 bg-black shadow-2xl">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={video.trailerUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="block"
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="card p-6 space-y-6">
          {/* Title & badges */}
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{video.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge badge-brand">{video.type}</span>
              {category && <span className="badge badge-accent">{category.name}</span>}
              <span className="badge badge-ocean">{video.releaseYear}</span>
              <span className="badge badge-sunset">{video.duration} min</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 rounded-xl bg-gray-800/30 px-4 py-3">
            <Star className="h-5 w-5 text-sunset-400 fill-sunset-400" />
            <span className="text-xl font-bold text-white">{video.rating}</span>
            <span className="text-sm text-gray-500">/10</span>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed">{video.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-800/20 p-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Director</p>
              <p className="text-sm font-medium text-gray-200">{video.director}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Release Year</p>
              <p className="text-sm font-medium text-gray-200">{video.releaseYear}</p>
            </div>
          </div>

          {/* Cast */}
          {video.cast?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-brand-400" />
                <p className="text-sm font-medium text-gray-300">Cast</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {video.cast.map((actor, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-gray-800/50 bg-gray-800/30 px-3 py-1.5 text-xs text-gray-300"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleWatchlistToggle}
              disabled={!isAuthenticated}
              className={inWatchlist ? 'btn-secondary' : 'btn-primary'}
            >
              {inWatchlist ? (
                <><BookmarkCheck className="h-4 w-4" /> Saved</>
              ) : (
                <><BookmarkPlus className="h-4 w-4" /> Add to Watchlist</>
              )}
            </button>

            <button onClick={() => setIsRating(!isRating)} className="btn-outline">
              <Star className="h-4 w-4" />
              Rate
            </button>
          </div>

          {isRating && (
            <div className="rounded-xl bg-gray-800/30 p-4 animate-slide-down">
              <p className="text-sm text-gray-400 mb-3">How would you rate this?</p>
              <Rating value={userRating} onChange={handleRating} />
            </div>
          )}
        </div>

        {/* Similar Videos */}
        {similarVideos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Similar Videos</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarVideos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default VideoDetailsPage;
