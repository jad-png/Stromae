/**
 * Login Page
 */

import { useContext, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, Mail, Lock, ArrowRight } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { useForm } from '../../hooks';
import { validateLoginForm, validateEmail, validatePassword } from '../../utils/validators';
import { ErrorAlert, SuccessAlert } from '../../components/Common';
import MainLayout from '../../components/Layout/MainLayout';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useContext(AuthContext);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateField = useCallback((name, value) => {
    if (name === 'email') {
      const result = validateEmail(value);
      setFormErrors((prev) => ({ ...prev, email: result.isValid ? '' : result.error }));
    }
    if (name === 'password') {
      if (!value) {
        setFormErrors((prev) => ({ ...prev, password: 'Password is required' }));
      } else {
        setFormErrors((prev) => ({ ...prev, password: '' }));
      }
    }
  }, []);

  const { values, handleChange: baseHandleChange, handleSubmit, isSubmitting } = useForm(
    { email: '', password: '' },
    async (formData) => {
      const validation = validateLoginForm(formData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      setFormErrors({});
      clearError();

      const result = login(formData.email, formData.password);
      if (result.success) {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      }
    }
  );

  const handleChange = (e) => {
    baseHandleChange(e);
    validateField(e.target.name, e.target.value);
  };

  return (
    <MainLayout>
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12">
        {/* Background effects */}
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-brand-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-accent-500/5 blur-3xl" />

        <div className="relative w-full max-w-md animate-slide-up">
          <div className="card p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/25">
                <Film className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
            </div>

            {error && <ErrorAlert message={error} onClose={clearError} />}
            {successMessage && <SuccessAlert message={successMessage} />}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${formErrors.email ? 'input-error' : ''}`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    className={`input-field pl-10 ${formErrors.password ? 'input-error' : ''}`}
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
