/**
 * Filters Component - Sidebar with search and filter controls
 */

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { VIDEO_CATEGORIES, VIDEO_TYPES } from '../../types';
import { useDebounce } from '../../hooks';

const Filters = ({ onFiltersChange, onSearch }) => {
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    sortBy: 'recent',
    minRating: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = { type: '', categoryId: '', sortBy: 'recent', minRating: '' };
    setFilters(defaultFilters);
    setSearchQuery('');
    onFiltersChange?.(defaultFilters);
  };

  const hasActiveFilters = filters.type || filters.categoryId || filters.minRating || searchQuery;

  return (
    <div className="card p-5 space-y-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-200">
          <SlidersHorizontal className="h-4 w-4 text-brand-400" />
          <h3 className="text-sm font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
        />
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

      {/* Rating */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">Min Rating</label>
        <select
          value={filters.minRating}
          onChange={(e) => handleFilterChange('minRating', e.target.value)}
          className="select-field"
        >
          <option value="">Any Rating</option>
          <option value="6">6.0+</option>
          <option value="7">7.0+</option>
          <option value="8">8.0+</option>
          <option value="9">9.0+</option>
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
