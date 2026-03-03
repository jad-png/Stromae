/**
 * Filters Component - Sidebar with search (with suggestions), type, category, and sort controls
 */

import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { VIDEO_CATEGORIES, VIDEO_TYPES } from '../../types';
import { useDebounce } from '../../hooks';
import { VideoService } from '../../services/VideoService';

const Filters = ({ onFiltersChange, onSearch }) => {
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    sortBy: 'recent',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    onSearch?.(debouncedSearch);

    if (debouncedSearch.trim().length > 0) {
      const results = VideoService.searchVideos(debouncedSearch);
      setSuggestions(results.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearch, onSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    onSearch?.(title);
  };

  return (
    <div className="card p-5 space-y-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-200">
        <SlidersHorizontal className="h-4 w-4 text-brand-400" />
        <h3 className="text-sm font-semibold">Filters</h3>
      </div>

      {/* Search with suggestions */}
      <div className="relative" ref={suggestionsRef}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="input-field pl-10"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900 shadow-lg">
            {suggestions.map((video) => (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(video.title)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800/60 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                  <span className="truncate">{video.title}</span>
                  <span className="ml-auto text-[10px] text-gray-600">{video.type}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">Type</label>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="select-field"
        >
          <option value="">All Types</option>
          {Object.entries(VIDEO_TYPES).map(([key, value]) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">Category</label>
        <select
          value={filters.categoryId}
          onChange={(e) => handleFilterChange('categoryId', e.target.value)}
          className="select-field"
        >
          <option value="">All Categories</option>
          {VIDEO_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="select-field"
        >
          <option value="recent">Most Recent</option>
          <option value="rating">Highest Rating</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
