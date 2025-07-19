import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { API_BASE_URL } from './config/api'
import { Helmet } from 'react-helmet';
import TopHeader from './assets/components/TopHeader';
import MainHeader from './assets/components/MainHeader';
import { useUser } from './assets/context-api/user-context/UseUser';

const ResetPassword = () => {
  const { token } = useParams();
  const {loading} = useUser;
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages
  const [tokenValid, setTokenValid] = useState(true); // State to check if token is initially present/valid looking

  useEffect(() => {
    // Basic check if token is present in URL.
    // More robust token validation (e.g., against expiry) happens on the backend.
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!tokenValid) {
      setError('Invalid reset link. Please request a new password reset.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) { // Basic password length validation
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/reset-password`, {
        token,
        newPassword: password,
      });
      setMessage(response.data.message || 'Password reset successfully!');
      setLoading(false);
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        navigate('/login'); // Redirect to your login page
      }, 3000);
    } catch (err) {
      console.error('Password reset error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to reset password. The link might be expired or invalid.');
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter antialiased">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-gray-100">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => navigate('/forgetpassword')} // Assuming you have a forgot-password route
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Helmet>
        <title>Reset Password - Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter antialiased">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Reset Your Password</h2>

        {message && (
          <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700 flex items-center shadow-sm">
            <FaCheckCircle className="mr-3 text-xl" />
            <span className="text-base font-medium">{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700 flex items-center shadow-sm">
            <FaTimesCircle className="mr-3 text-xl" />
            <span className="text-base font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-3" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ResetPassword;
