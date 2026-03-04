# 🎬 Stromae - Video Streaming Platform

A modern React-based video streaming web application that allows users to discover, watch, manage, and track their favorite films, TV series, and documentaries. The application features a responsive design, authentication system, watchlist management, and comprehensive video browsing capabilities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)

## Features

### User Authentication
- User registration with strong password validation
- Secure login/logout system
- JWT-like token management
- Session persistence with localStorage

### Video Catalog
- Browse extensive library of films, series, and documentaries
- Advanced search with real-time suggestions
- Multi-criteria filtering (type, category, rating)
- Multiple sorting options (recent, rating, popularity)
- Responsive grid layout

### Video Details
- Full video information display
- YouTube embedded trailer player
- Similar video recommendations
- View count tracking

### Watchlist Management
- Add/remove videos from personal watchlist
- Duplicate detection to prevent duplicate entries
- Watchlist statistics and summaries

### Watch History
- Automatic tracking of viewed videos
- Progress tracking for videos
- Mark videos as completed
- Watch statistics and insights

### User Profile
- View account information
- Edit profile details
- View comprehensive statistics
- Logout functionality

## Tech Stack

### Frontend Framework
- **React 19.2** - Modern UI library with hooks
- **Vite 7.2** - Lightning-fast build tool
- **React Router DOM 6** - Client-side routing

### Styling & UI
- **TailwindCSS 3.3** - Utility-first CSS framework
- **DaisyUI 5.5** - Component library built on Tailwind

### State Management & Storage
- **React Context API** - Global state management
- **Custom Hooks** - Reusable logic encapsulation
- **localStorage** - Persistent data storage

### Testing
- **Vitest 1.0** - Fast unit test framework
- **React Testing Library 14.1** - Component testing

## Architecture

The application follows **Clean Architecture** principles with clear separation of concerns:

```
Presentation Layer (Components, Pages)
    ↓
Business Logic Layer (Services, Hooks)
    ↓
Data Layer (Storage, localStorage)
```

## Project Structure

```
src/
├── components/
│   ├── Auth/                    # Authentication components
│   ├── Common/                  # Reusable UI components
│   ├── Layout/                  # Layout components
│   ├── VideoCard/               # Video display component
│   ├── Filters/                 # Filtering components
│   └── ProtectedRoute.jsx       # Route protection
│
├── pages/
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── Home/
│   │   └── HomePage.jsx
│   ├── VideoDetails/
│   │   └── VideoDetailsPage.jsx
│   ├── Watchlist/
│   │   └── WatchlistPage.jsx
│   └── UserProfile/
│       └── UserProfilePage.jsx
│
├── hooks/
│   └── index.js                 # Custom React hooks
│
├── services/
│   ├── VideoService.js          # Video operations
│   ├── AuthService.js           # Authentication
│   └── WatchlistService.js      # Watchlist & history
│
├── context/
│   └── AuthContext.jsx          # Auth context provider
│
├── utils/
│   ├── validators.js            # Input validation
│   ├── storage.js               # localStorage management
│   └── helpers.js               # Utility functions
│
├── types/
│   └── index.js                 # Type definitions
│
├── tests/
│   ├── validators.test.js
│   ├── helpers.test.js
│   └── VideoService.test.js
│
├── App.jsx                      # Main app with routes
├── index.css                    # Global styles
└── main.jsx                     # Entry point
```

## Installation & Setup

### Prerequisites
- Node.js 16.0 or higher
- npm 7.0 or higher

### Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Available at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Usage

### Demo Credentials
- **Email**: `demo@example.com`
- **Password**: `Demo@12345`

### Key Workflows

1. **Registration** - Create new account with validation
2. **Browse** - Explore videos with filters and search
3. **Watch** - View video details and YouTube trailers
4. **Manage** - Add videos to watchlist
5. **Track** - Monitor watch history and statistics
6. **Profile** - View account details and statistics

## Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

## Security Features

### Input Validation
- Email format validation
- Password strength requirements
- Username format validation
- Duplicate detection
- Video URL validation

### Data Protection
- Password hashing
- localStorage encryption option
- Secure session tokens
- Input sanitization

## Performance Optimizations

### Rendering
- React.memo for component memoization
- Debounced search (300ms)
- Lazy loading routes

### Caching
- LocalStorage caching with expiration
- Efficient array filtering
- Memoized selectors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, open an issue on GitHub.
