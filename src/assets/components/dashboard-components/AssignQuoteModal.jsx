import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { useUser } from '../../context-api/user-context/UseUser';
import { FaSpinner, FaTimes, FaCheckCircle, FaTimesCircle, FaUserPlus, FaUsers } from 'react-icons/fa';

const AssignQuoteModal = ({ quote, onClose, onAssignSuccess }) => {
  const queryClient = useQueryClient();
  const { token } = useUser();
  // Pre-select if already assigned, otherwise default to empty string
  const [selectedAdminId, setSelectedAdminId] = useState(quote.assignedTo?._id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  // Memoized function to get authentication headers
  const getAuthHeaders = useCallback(() => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, [token]);

  // React Query to fetch all admin/super admin users
  const fetchAdmins = async () => {
    if (!token) return []; // Don't attempt to fetch if no token
    try {
      const res = await axios.get(`${API_BASE_URL}/users`, getAuthHeaders());
      // Filter for users with 'admin' or 'super admin' roles
      return res.data.filter(user => user.role === 'admin' || user.role === 'super admin');
    } catch (error) {
      console.error("Error fetching admins:", error.response?.data?.error || error.message);
      throw error; // Re-throw to be caught by useQuery's onError
    }
  };

  const {
    data: admins = [], // Default to an empty array
    isLoading: isLoadingAdmins,
    isError: isErrorAdmins,
    error: adminsError,
    refetch: refetchAdmins // Function to manually refetch admins
  } = useQuery({
    queryKey: ['adminsForAssignment'], // Unique key for this query
    queryFn: fetchAdmins,
    enabled: !!token, // Only enable query if token is available
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
    onError: (err) => {
      setLocalError(err.response?.data?.error || 'Failed to load admin list.');
    },
  });

  // React Query Mutation for assigning the quote
  const assignQuoteMutation = useMutation({
    mutationFn: async ({ quoteId, assignedToUserId }) => {
      const res = await axios.put(`${API_BASE_URL}/quotes/${quoteId}/assign`, { assignedToUserId }, getAuthHeaders());
      return res.data.updatedQuote; // Backend should return the updated quote
    },
    onSuccess: (updatedQuote) => {
      setLocalSuccess('Quote assigned successfully!');
      // Invalidate the main quotes list to reflect the assignment change
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      // Optionally update the specific quote in cache if it's open elsewhere
      queryClient.setQueryData(['quotes', updatedQuote._id], updatedQuote);
      onAssignSuccess(updatedQuote); // Callback to parent component
      // Close modal after a short delay to show success message
      setTimeout(() => onClose(), 1000);
    },
    onError: (err) => {
      setLocalError(err.response?.data?.error || 'Failed to assign quote.');
    },
  });

  // Filter admins based on search term for the dropdown display
  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for the Assign button click
  const handleAssign = () => {
    if (!selectedAdminId) {
      setLocalError('Please select an admin to assign the quote.');
      return;
    }
    // Trigger the mutation
    assignQuoteMutation.mutate({ quoteId: quote._id, assignedToUserId: selectedAdminId });
  };

  // Effect to clear local success/error messages after a delay
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Assign Quote to Admin</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Local Success & Error Messages */}
        {(localError || localSuccess) && (
          <div className={`mb-4 p-3 rounded-md border flex items-center justify-between ${
            localError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            <div className="flex items-center">
              {localError ? <FaTimesCircle className="mr-2" /> : <FaCheckCircle className="mr-2" />}
              <span className="text-sm font-medium">{localError || localSuccess}</span>
            </div>
            <button
              onClick={() => { setLocalError(''); setLocalSuccess(''); }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimesCircle />
            </button>
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Assign quote for service: <span className="font-semibold">{quote.service}</span> (from {quote.name})
          </p>
          {quote.assignedTo ? (
            <p className="text-sm text-gray-600">
              Currently assigned to: <span className="font-semibold">{quote.assignedTo.name || quote.assignedTo.email}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">Currently unassigned.</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="admin-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Admin:
          </label>
          <input
            id="admin-search"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-2"
          />
          {isLoadingAdmins ? (
            <div className="flex items-center justify-center py-4 text-gray-600">
              <FaSpinner className="animate-spin text-blue-500 mr-2" /> Loading admins...
            </div>
          ) : isErrorAdmins ? (
            <div className="text-red-600 text-sm text-center py-4">
              Error: {adminsError?.message || 'Could not load admins.'}
            </div>
          ) : (
            <select
              id="admin-select"
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select an Admin --</option>
              {filteredAdmins.map(admin => (
                <option key={admin._id} value={admin._id}>
                  {admin.name} ({admin.email})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleAssign}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center transition ease-in-out duration-150"
            disabled={assignQuoteMutation.isPending || isLoadingAdmins}
          >
            {assignQuoteMutation.isPending ? <FaSpinner className="animate-spin mr-2" /> : <FaUserPlus className="mr-2" />}
            {assignQuoteMutation.isPending ? 'Assigning...' : 'Assign Quote'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition ease-in-out duration-150"
            disabled={assignQuoteMutation.isPending}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignQuoteModal;
