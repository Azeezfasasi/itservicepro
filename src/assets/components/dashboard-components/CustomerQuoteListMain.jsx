import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from '../../context-api/user-context/UseUser';
import { API_BASE_URL } from '../../../config/api';
import { FaSpinner, FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaEye, FaUserTie } from 'react-icons/fa'; // Added FaUserTie icon

const CustomerQuotesListMain = () => {
  const { token, user } = useUser(); // Get token and user from UserContext

  // Define the data fetcher function for react-query
  const fetchMyQuotes = async () => {
    if (!token) {
      throw new Error('Authentication token not available.');
    }
    const response = await axios.get(`${API_BASE_URL}/customer/my-quotes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  // Use useQuery hook to fetch data
  const {
    data: quotes, // Rename 'data' to 'quotes' for convenience
    isLoading,    // True while fetching for the first time
    isFetching,   // True while fetching (including refetches)
    isError,      // True if the query failed
    error,        // The error object if isError is true
    refetch       // Function to manually refetch the data
  } = useQuery({
    queryKey: ['customerQuotes', user?.email], // Query key includes user email for specificity
    queryFn: fetchMyQuotes,
    enabled: !!token && !!user?.email, // Only enable query if token and user email are available
    staleTime: 0, // Set to 0 for debugging, to ensure fresh data on mount. Can increase later.
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
    onError: (err) => {
      console.error("React Query Error fetching customer quotes:", err);
      // You can set a local error state here if you need more granular control
      // setLocalError(err.message || 'Failed to load your quote requests.');
    },
  });

  // Helper to get status badge color
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

  // Loading state
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading your quote requests...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 rounded-lg shadow-md m-4">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error!</p>
        <p className="text-lg text-center">{error?.message || 'Failed to load your quote requests.'}</p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No quotes found state
  if (!quotes || quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <FaInfoCircle className="text-blue-500 text-5xl mb-4" />
        <p className="text-xl font-semibold text-gray-700 mb-2">No Quote Requests Found</p>
        <p className="text-md text-gray-600 text-center">
          It looks like you haven't submitted any quote requests yet.
        </p>
        <Link to="/app/contact" className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-150 ease-in-out">
          Submit a New Quote
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-inter antialiased">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 border-b-2 border-blue-100 pb-4 text-center">
          My Quote Requests
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {quotes.map((quote) => (
            <div key={quote._id} className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{quote.service}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2" /> Submitted on: {new Date(quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(quote.status)}`}>
                  {quote.status}
                </span>
              </div>

              {/* NEW: Display Assigned To information */}
              {quote.assignedTo && (
                <div className="mb-3 text-sm text-gray-700 flex items-center">
                  <FaUserTie className="mr-2 text-blue-500" />
                  <span className="font-semibold mr-1">Assigned To:</span> {quote.assignedTo.name || quote.assignedTo.email}
                </div>
              )}
              {/* END NEW */}

              <p className="text-gray-700 mb-4 line-clamp-2">
                {quote.message}
              </p>
              <div className="flex justify-end">
                <Link
                  to={`/app/quoteslist/${quote._id}`} // Link to the details page with the actual ID
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  <FaEye className="mr-2" /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerQuotesListMain;
