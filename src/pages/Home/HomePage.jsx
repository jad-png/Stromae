/**
 * Home Page - Video catalog with hero section
 */

import { useState, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Film } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import VideoCard from '../../components/VideoCard/VideoCard';
import Filters from '../../components/Filters/Filters';
import { EmptyState, Pagination } from '../../components/Common';
import { VideoService } from '../../services/VideoService';
import AuthContext from '../../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    sortBy: 'recent',
    minRating: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredVideos = useMemo(() => {
    let videos;

    if (searchQuery) {
      videos = VideoService.searchVideos(searchQuery);
    } else {
      videos = VideoService.getAllVideos();
    }

    if (filters.type) {
      videos = videos.filter((v) => v.type === filters.type);
    }
    if (filters.categoryId) {
      videos = videos.filter((v) => v.categoryId === filters.categoryId);
    }
    if (filters.minRating) {
      videos = videos.filter((v) => v.rating >= parseFloat(filters.minRating));
    }

    return VideoService.getSortedVideos(videos, filters.sortBy);
  }, [filters, searchQuery]);

  const paginationResult = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: filteredVideos.slice(startIndex, endIndex),
      page: currentPage,
      total: filteredVideos.length,
      totalPages: Math.ceil(filteredVideos.length / itemsPerPage),
    };
  }, [filteredVideos, currentPage]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800/50">
        {/* Background gradient blobs */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-60 w-60 rounded-full bg-ocean-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-400">
              <Sparkles className="h-3.5 w-3.5" />
              Stream your favorite content
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-white">Discover & Watch</span>
              <br />
              <span className="gradient-text">Amazing Content</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-gray-400 sm:text-lg">
              Explore curated movies, series, and documentaries.
              Build your watchlist and track your viewing journey.
            </p>

            {!isAuthenticated && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/register" className="btn-primary btn-lg">
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-outline btn-lg">
                  Sign In
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {[
                { icon: Film, label: 'Videos', value: filteredVideos.length },
                { icon: TrendingUp, label: 'Avg Rating', value: '8.8' },
                { icon: Sparkles, label: 'Categories', value: '7' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-white">
                    <Icon className="h-5 w-5 text-brand-400" />
                    {value}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Filters onFiltersChange={setFilters} onSearch={setSearchQuery} />
          </aside>

          {/* Video Grid */}
          <div className="lg:col-span-3">
            {paginationResult.items.length > 0 ? (
              <>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {searchQuery ? `Results for "${searchQuery}"` : 'Catalog'}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {paginationResult.total} video{paginationResult.total !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paginationResult.items.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>

                <Pagination
                  currentPage={paginationResult.page}
                  totalPages={paginationResult.totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <EmptyState
                title="No Videos Found"
                description="Try adjusting your search or filter criteria"
                action={
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ type: '', categoryId: '', sortBy: 'recent', minRating: '' });
                      setCurrentPage(1);
                    }}
                    className="btn-primary"
                  >
                    Reset Filters
                  </button>
                }
              />
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
