import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuote } from '../../context-api/Request-quote-context/UseQuote';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaReply, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaTools, FaInfoCircle, FaUserTie } from 'react-icons/fa'; // Added FaUserTie

const CustomerQuoteDetailsMain = () => {
  const { id } = useParams();
  const { fetchSingleQuote, customerReplyToQuote, loading, error } = useQuote();
  const [quoteDetails, setQuoteDetails] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  const getQuote = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchSingleQuote(id);
      setQuoteDetails(data);
      setLocalError('');
    } catch (err) {
      setLocalError(error || 'Failed to load quote details.');
    }
  }, [id, fetchSingleQuote, error]);

  useEffect(() => {
    getQuote();
  }, [getQuote]);

  useEffect(() => {
    if (localSuccess) {
      const timer = setTimeout(() => setLocalSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
    if (localError) {
      const timer = setTimeout(() => setLocalError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [localSuccess, localError]);

  const handleReplySend = async () => {
    if (!replyMessage.trim()) {
      setLocalError('Reply message cannot be empty.');
      return;
    }
    try {
      const updatedQuote = await customerReplyToQuote(id, replyMessage);
      setQuoteDetails(updatedQuote);
      setReplyMessage('');
      setLocalSuccess('Your reply has been sent!');
    } catch (err) {
      setLocalError(err.message || 'Failed to send reply. Please try again.');
    }
  };

  const getSenderName = (reply) => {
    if (reply.senderType === 'admin') {
      return (reply.senderId && reply.senderId.name) ? reply.senderId.name : reply.senderEmail || 'Admin';
    }
    if (reply.senderType === 'customer') {
      return quoteDetails?.name || reply.senderEmail || 'You';
    }
    return 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Review': return 'bg-blue-100 text-blue-800';
      case 'Done': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      case 'Resolved': return 'bg-green-200 text-green-700';
      case 'Closed': return 'bg-green-300 text-green-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !quoteDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading your quote details...</p>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 rounded-lg shadow-md m-4">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error!</p>
        <p className="text-lg text-center">{error || localError}</p>
        <button
          onClick={getQuote}
          className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!quoteDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">No quote details found for this ID.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-inter antialiased">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
        <Link to="/app/myquotes" className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FaReply className="mr-2 text-blue-600" /> Back to Quotes
        </Link>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 border-b-2 border-blue-100 pb-4 text-center">
          Your Quote Request Details
        </h2>

        {(localError || localSuccess) && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            localError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          } shadow-sm`}>
            <div className="flex items-center">
              {localError ? <FaTimesCircle className="mr-3 text-xl" /> : <FaCheckCircle className="mr-3 text-xl" />}
              <span className="text-base font-medium">{localError || localSuccess}</span>
            </div>
            <button
              onClick={() => { setLocalError(''); setLocalSuccess(''); }}
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        )}

        {/* Quote Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <FaUser className="text-blue-500 mr-3 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900 text-lg">{quoteDetails.name}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-blue-500 mr-3 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900 text-lg">{quoteDetails.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-blue-500 mr-3 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900 text-lg">{quoteDetails.phone || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaTools className="text-blue-500 mr-3 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Service Requested</p>
              <p className="font-semibold text-gray-900 text-lg">{quoteDetails.service}</p>
            </div>
          </div>
          <div className="flex items-center col-span-1 md:col-span-2">
            <FaInfoCircle className="text-blue-500 mr-3 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(quoteDetails.status)}`}>
                {quoteDetails.status}
              </span>
            </div>
          </div>
          {/* NEW: Display Assigned To information */}
          {quoteDetails.assignedTo && (
            <div className="flex items-center col-span-1 md:col-span-2">
              <FaUserTie className="text-blue-500 mr-3 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Assigned To</p>
                <p className="font-semibold text-gray-900 text-lg">{quoteDetails.assignedTo.name || quoteDetails.assignedTo.email}</p>
              </div>
            </div>
          )}
          {/* END NEW */}
          <div className="flex items-center col-span-1 md:col-span-2">
            <FaCalendarAlt className="text-blue-500 mr-3 text-xl" />
            <div>
              <p className="text-sm text-gray-600">Date Submitted</p>
              <p className="font-semibold text-gray-900 text-lg">{new Date(quoteDetails.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Original Message */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <p className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <FaInfoCircle className="mr-2" /> Your Original Message
          </p>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <p className="whitespace-pre-line text-gray-800 leading-relaxed">{quoteDetails.message}</p>
          </div>
        </div>

        {/* Conversation History */}
        {quoteDetails.replies && quoteDetails.replies.length > 0 && (
          <div className="mb-8">
            <p className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Conversation History</p>
            <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-4 bg-gray-100 shadow-inner">
              {quoteDetails.replies.map((reply, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-sm max-w-[85%] ${
                    reply.senderType === 'admin'
                      ? 'bg-blue-100 border border-blue-300 text-blue-900 self-start mr-auto'
                      : 'bg-green-100 border border-green-300 text-green-900 self-end ml-auto'
                  }`}
                >
                  <p className="text-sm font-bold mb-1">
                    {getSenderName(reply)}
                  </p>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
                    {reply.message}
                  </p>
                  <p className="text-xs text-gray-600 text-right mt-2">
                    {new Date(reply.repliedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply Section */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaReply className="mr-2 text-blue-600" /> Send a Reply
          </h3>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[120px] text-gray-800 placeholder-gray-500 transition duration-150 ease-in-out"
            placeholder="Type your message to the admin here..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          ></textarea>
          <button
            onClick={handleReplySend}
            disabled={loading}
            className="mt-5 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-200 flex items-center justify-center text-lg transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-3 text-xl" />
            ) : (
              <FaReply className="mr-3 text-xl" />
            )}
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuoteDetailsMain;
