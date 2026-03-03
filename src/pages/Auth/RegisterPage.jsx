/**
 * Register Page
 */

import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { useForm } from '../../hooks';
import { validateRegistrationForm } from '../../utils/validators';
import { ErrorAlert, SuccessAlert } from '../../components/Common';
import MainLayout from '../../components/Layout/MainLayout';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useContext(AuthContext);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm(
    { username: '', email: '', password: '', confirmPassword: '' },
    async (formData) => {
      const validation = validateRegistrationForm(formData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        return;
      }

      setFormErrors({});
      clearError();

      const result = register(formData.username, formData.email, formData.password);
      if (result.success) {
        setSuccessMessage('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    }
  );

  const passwordRequirements = [
    { label: 'At least 8 characters', met: values.password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(values.password) },
    { label: 'A number', met: /\d/.test(values.password) },
    { label: 'Special character', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.password) },
  ];

  return (
    <MainLayout>
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full bg-accent-500/5 blur-3xl" />
        <div className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-ocean-500/5 blur-3xl" />

        <div className="relative w-full max-w-md animate-slide-up">
          <div className="card p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-ocean-500 shadow-lg shadow-accent-500/25">
                <Film className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="mt-1 text-sm text-gray-500">Join Stromae and start streaming</p>
            </div>

            {error && <ErrorAlert message={error} onClose={clearError} />}
            {successMessage && <SuccessAlert message={successMessage} />}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Choose a username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    className={`input-field pl-10 ${formErrors.username ? 'input-error' : ''}`}
                  />
                </div>
                {formErrors.username && <p className="mt-1 text-xs text-red-400">{formErrors.username}</p>}
              </div>

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
                {formErrors.email && <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    className={`input-field pl-10 ${formErrors.password ? 'input-error' : ''}`}
                  />
                </div>
                {formErrors.password && <p className="mt-1 text-xs text-red-400">{formErrors.password}</p>}
              </div>

              {/* Password strength indicators */}
              {values.password && (
                <div className="grid grid-cols-2 gap-2">
                  {passwordRequirements.map(({ label, met }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <Check className={`h-3 w-3 ${met ? 'text-emerald-400' : 'text-gray-600'}`} />
                      <span className={`text-[11px] ${met ? 'text-emerald-400' : 'text-gray-600'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pl-10 ${formErrors.confirmPassword ? 'input-error' : ''}`}
                  />
                </div>
                {formErrors.confirmPassword && <p className="mt-1 text-xs text-red-400">{formErrors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} className="btn-secondary w-full">
                {isSubmitting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
