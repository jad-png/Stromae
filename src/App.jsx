import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import VideoDetailsPage from './pages/VideoDetails/VideoDetailsPage';
import WatchlistPage from './pages/Watchlist/WatchlistPage';
import UserProfilePage from './pages/UserProfile/UserProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute requiredAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute requiredAuth={false}>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route path="/video/:videoId" element={<VideoDetailsPage />} />

          {/* Protected Routes */}
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute requiredAuth={true}>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredAuth={true}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
                <div className="text-center animate-fade-in">
                  <h1 className="font-display text-7xl font-extrabold gradient-text mb-4">404</h1>
                  <p className="text-lg text-gray-400 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist.
                  </p>
                  <a href="/" className="btn-primary">
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
