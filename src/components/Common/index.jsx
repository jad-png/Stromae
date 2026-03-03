/**
 * Common UI Components
 * Reusable building blocks for the application
 */

import { X, AlertCircle, CheckCircle, Loader2, Frown, ChevronLeft, ChevronRight } from 'lucide-react';

// Error Alert
export const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="animate-slide-up mb-4 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      <AlertCircle className="h-5 w-5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-red-500/20 transition-colors">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Success Alert
export const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="animate-slide-up mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
      <CheckCircle className="h-5 w-5 shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-emerald-500/20 transition-colors">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl animate-pulse-soft" />
        <Loader2 className="relative h-10 w-10 animate-spin text-brand-500" />
      </div>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
};

// Empty State
export const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="mb-6 rounded-full bg-gray-800/50 p-6">
        <Frown className="h-12 w-12 text-gray-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-200 mb-2">{title}</h2>
      <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};

// Modal
export const Modal = ({ isOpen, title, children, onClose, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-scale-in card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-gray-300">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

// Rating
export const Rating = ({ value = 0, max = 10, onChange, readOnly = false }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = (i + 1) * 2;
    return (
      <button
        key={i}
        onClick={() => !readOnly && onChange?.(starValue)}
        className={`text-2xl transition-all duration-150 ${
          starValue <= value
            ? 'text-sunset-400 scale-110'
            : 'text-gray-700 hover:text-sunset-400/50'
        } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
        disabled={readOnly}
        type="button"
      >
        ★
      </button>
    );
  });

  return (
    <div className="flex items-center gap-1">
      {stars}
      {value > 0 && (
        <span className="ml-3 text-sm font-medium text-gray-400">
          {value.toFixed(1)}/{max}
        </span>
      )}
    </div>
  );
};

// Pagination
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-ghost btn-sm rounded-lg disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentPage === page
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-ghost btn-sm rounded-lg disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
