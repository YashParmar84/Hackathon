import React, { useState } from 'react';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
          <p className="text-gray-400 mb-6">
            We've sent a password reset link to <strong className="text-white">{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
          <p className="text-gray-400">Enter your email to reset your password</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Note:</p>
          <p className="text-xs text-gray-300">
            This is a demo. In a real application, an email would be sent to your Gmail account with reset instructions.
          </p>
        </div>
      </div>
    </div>
  );
};