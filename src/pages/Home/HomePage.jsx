/**
 * Home Page - Video catalog
 */

import { useState, useMemo } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import VideoCard from '../../components/VideoCard/VideoCard';
import Filters from '../../components/Filters/Filters';
import { EmptyState } from '../../components/Common';
import { VideoService } from '../../services/VideoService';

const HomePage = () => {
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    sortBy: 'recent',
  });
  const [searchQuery, setSearchQuery] = useState('');

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

    return VideoService.getSortedVideos(videos, filters.sortBy);
  }, [filters, searchQuery]);

  return (
    <MainLayout>
      {/* Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <Filters onFiltersChange={setFilters} onSearch={setSearchQuery} />
          </aside>

          {/* Video Grid */}
          <div className="lg:col-span-3">
            {filteredVideos.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {searchQuery ? `Results for "${searchQuery}"` : 'Catalog'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                title="No Videos Found"
                description="Try adjusting your search or filter criteria"
              />
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
