import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import TopHeader from '../assets/components/TopHeader'; 
import MainHeader from '../assets/components/MainHeader';
import { API_BASE_URL } from '../config/api';

const UnsubscribeNewsletter = () => {
  const { token } = useParams(); // Get the unsubscribe token from the URL
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Processing your unsubscribe request...');

  useEffect(() => {
    const unsubscribe = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid unsubscribe link: Token is missing.');
        return;
      }

      try {
        // Make a GET request to your backend's unsubscribe by token endpoint
        const response = await axios.get(`${API_BASE_URL}/newsletter/unsubscribe/${token}`);
        
        if (response.status === 200) {
          setStatus('success');
          setMessage(response.data.message || 'You have been successfully unsubscribed from our newsletter.');
        } else {
          // This block might not be hit if backend sends 4xx/5xx, but good for robustness
          setStatus('error');
          setMessage(response.data.error || 'Failed to unsubscribe. Please try again.');
        }
      } catch (err) {
        console.error('Unsubscribe error:', err.response?.data || err.message);
        setStatus('error');
        setMessage(err.response?.data?.error || 'An error occurred during unsubscription. The link might be invalid or expired, or you might have already unsubscribed.');
      }
    };

    unsubscribe();
  }, [token]); // Rerun effect if token changes (though it shouldn't for this use case)

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <FaSpinner className="animate-spin text-blue-500 text-5xl mb-4" />
            <p className="text-lg text-gray-700 font-medium">{message}</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Unsubscribed Successfully!</h2>
            <p className="text-gray-600 text-lg mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              Return to Homepage
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FaTimesCircle className="text-red-500 text-6xl mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Unsubscription Failed</h2>
            <p className="text-gray-600 text-lg mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto py-3 px-6 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              Return to Homepage
            </button>
          </div>
        );
      default:
        return null; // Should not happen
    }
  };

  return (
    <>
      <Helmet>
        <title>Unsubscribe - Marshall Global Ventures</title>
      </Helmet>
      <TopHeader />
      <MainHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-100 font-inter antialiased py-8">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default UnsubscribeNewsletter;
