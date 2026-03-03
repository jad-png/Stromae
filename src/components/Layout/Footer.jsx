/**
 * Footer Component - Clean modern footer
 */

import { Link } from 'react-router-dom';
import { Film, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800/50 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500">
                <Film className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                Stro<span className="text-brand-400">mae</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Discover, watch, and manage your favorite movies, series, and documentaries.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-200">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Browse' },
                { to: '/watchlist', label: 'Watchlist' },
                { to: '/profile', label: 'Profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-200">Legal</h3>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-200">Connect</h3>
            <div className="flex gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Github, label: 'GitHub' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-500 hover:border-brand-500/50 hover:text-brand-400 transition-all cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-800/50 pt-6 text-center">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} Stromae. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
