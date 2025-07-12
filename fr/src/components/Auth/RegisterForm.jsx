import React, { useState, useEffect } from 'react';
import { UserPlus, Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterForm = ({ onToggle, onBack }) => {
  const [step, setStep] = useState(1); // 1: User info, 2: OTP verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    bio: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { sendOTP, verifyOTPAndRegister } = useAuth();
  const navigate = useNavigate();

  // Watch for successful registration and navigate
  useEffect(() => {
    if (registrationComplete) {
      console.log("Registration complete, navigating to /auth/profile");
      navigate('/auth/profile');
    }
  }, [registrationComplete, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (step === 1) {
      // Step 1: Validate form and send OTP
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      try {
        await sendOTP(formData.email);
        setSuccess('OTP sent successfully to your email!');
        setStep(2);
      } catch (err) {
        setError(err.message || 'Failed to send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Verify OTP and register
      if (!formData.otp) {
        setError('Please enter the OTP sent to your email');
        setLoading(false);
        return;
      }

      try {
        console.log("Starting registration process...");
        await verifyOTPAndRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.location,
          bio: formData.bio,
          otp: formData.otp,
          skillsOffered: [],
          skillsWanted: [],
          availability: []
        });
        console.log("Registration successful! Welcome to the community.");
        setSuccess('Registration successful! Welcome to the community.');
        console.log("Setting registrationComplete to true");
        setRegistrationComplete(true);
      } catch (err) {
        console.error("Registration error:", err);
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setError('');
    setSuccess('');
  };

  const resendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      await sendOTP(formData.email);
      setSuccess('OTP resent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8">
        {onBack && step === 1 && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        )}

        {step === 2 && (
          <button
            onClick={handleBackToStep1}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </button>
        )}

        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="text-gray-400">
            {step === 1 
              ? 'Join the skill swap community' 
              : 'Enter the verification code sent to your email'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg p-3 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            // Step 1: User Information
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            </>
          ) : (
            // Step 2: OTP Verification
            <>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center text-blue-400 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Verification Code Sent</span>
                </div>
                <p className="text-sm text-gray-300">
                  We've sent a 6-digit verification code to <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={loading}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Resend
                </button>
              </div>
            </>
          )}
        </form>

        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onToggle}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};