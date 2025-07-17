import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { useUser } from '../../context-api/user-context/UseUser';
import {
  FaSpinner, FaEdit, FaEye, FaSearch, FaFilter,
  FaSortAlphaDown, FaSortAlphaUp, FaTimesCircle, FaSave, FaCheckCircle, FaReply, FaExchangeAlt
} from 'react-icons/fa';
import AssignQuoteModal from './AssignQuoteModal';
import AdminReplyQuoteModal from './AdminReplyQuoteModal';

const statusOptions = [
  { value: 'Waiting for Support', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Waiting for Customer', color: 'bg-orange-100 text-orange-800' },
  { value: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'In Review', color: 'bg-blue-100 text-blue-800' },
  { value: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { value: 'Done', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'Declined', color: 'bg-red-100 text-red-800' },
  { value: 'Resolved', color: 'bg-green-200 text-green-700' },
  { value: 'Closed', color: 'bg-green-300 text-green-900' },
];

const PAGE_SIZE = 10;

const MyAssignedQuoteRequestMain = () => {
  const queryClient = useQueryClient();
  const { token, user } = useUser();

  // --- DEBUGGING LOGS ---
  console.log('MyAssignedQuoteRequestMain Rendered');
  console.log('Current Token:', token ? 'Exists' : 'Does NOT exist');
  console.log('Current User:', user);
  console.log('User ID (from _id):', user?._id); // FIXED: Accessing _id
  console.log('User Role:', user?.role);
  // --- END DEBUGGING LOGS ---

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(1);
  const [viewQuote, setViewQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [localSuccessMessage, setLocalSuccessMessage] = useState('');
  const [localErrorMessage, setLocalErrorMessage] = useState('');

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [quoteToReply, setQuoteToReply] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [quoteToAssign, setQuoteToAssign] = useState(null);

  const getAuthHeaders = useCallback(() => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, [token]);

  const fetchAssignedQuotes = async () => {
    console.log('Attempting to fetch assigned quotes...');
    // FIXED: Use user?._id
    if (!token || !user?._id) {
      console.warn('Cannot fetch assigned quotes: Token or User ID is missing.');
      return [];
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/quotes/assigned`, getAuthHeaders());
      console.log('Assigned Quotes API response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching assigned quotes from API:', err.response?.data || err.message);
      throw err;
    }
  };

  const {
    data: quotes = [],
    isLoading,
    isError,
    error,
    refetch: refetchQuotes
  } = useQuery({
    queryKey: ['assignedQuotes', user?._id], // FIXED: Use user?._id in queryKey
    queryFn: fetchAssignedQuotes,
    enabled: !!token && !!user?._id, // FIXED: Use user?._id in enabled condition
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to fetch assigned quotes.');
    },
  });

  console.log('useQuery state: isLoading=', isLoading, ' isError=', isError, ' error=', error);
  console.log('Quotes data from useQuery:', quotes);

  // Fetch all admin users for re-assignment dropdown
  const { data: admins = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Attempting to fetch admin users...');
      // FIXED: Use user?._id in condition (though not strictly necessary for this query, good practice)
      if (!token || (!user?.role === 'admin' && !user?.role === 'super admin')) {
        console.warn('Cannot fetch admins: Token or User role is insufficient.');
        return [];
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/users/admins`, getAuthHeaders());
        console.log('Admins API response:', res.data);
        return res.data;
      } catch (err) {
        console.error('Error fetching admins from API:', err.response?.data || err.message);
        throw err;
      }
    },
    enabled: !!token && (user?.role === 'admin' || user?.role === 'super admin'),
    staleTime: 5 * 60 * 1000,
  });

  const updateQuoteMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const res = await axios.put(`${API_BASE_URL}/quotes/${id}`, updates, getAuthHeaders());
      return res.data;
    },
    onSuccess: (data) => {
      setLocalSuccessMessage('Quote updated successfully!');
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ['assignedQuotes', user?._id] }); // FIXED: Use user?._id
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to update quote.');
    },
  });

  const adminReplyToQuoteMutation = useMutation({
    mutationFn: async ({ id, replyData }) => {
      const res = await axios.post(`${API_BASE_URL}/quotes/${id}/reply/admin`, replyData, getAuthHeaders());
      return res.data.updatedQuote;
    },
    onSuccess: (data) => {
      setLocalSuccessMessage('Reply sent successfully!');
      setShowReplyModal(false);
      setQuoteToReply(null);
      queryClient.invalidateQueries({ queryKey: ['assignedQuotes', user?._id] }); // FIXED: Use user?._id
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to send reply.');
    },
  });

  const assignQuoteMutation = useMutation({
    mutationFn: async ({ quoteId, assignedToUserId }) => {
      const res = await axios.put(
        `${API_BASE_URL}/quotes/${quoteId}/assign`,
        { assignedToUserId },
        getAuthHeaders()
      );
      return res.data;
    },
    onSuccess: (data) => {
      setLocalSuccessMessage(`Quote re-assigned successfully to ${data.updatedQuote.assignedTo.name || data.updatedQuote.assignedTo.email}!`);
      setShowAssignModal(false);
      setQuoteToAssign(null);
      queryClient.invalidateQueries({ queryKey: ['assignedQuotes', user?._id] }); // FIXED: Use user?._id
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to re-assign quote.');
    },
  });

  useEffect(() => {
    if (localSuccessMessage) {
      const timer = setTimeout(() => setLocalSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
    if (localErrorMessage) {
      const timer = setTimeout(() => setLocalErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [localSuccessMessage, localErrorMessage]);

  const handleEdit = (quote) => {
    setEditId(quote._id);
    setEditData({ ...quote });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    updateQuoteMutation.mutate({ id: editId, updates: editData });
  };

  const handleStatusChange = (id, status) => {
    updateQuoteMutation.mutate({ id, updates: { status } });
  };

  const handleReplyClick = (quote) => {
    setQuoteToReply(quote);
    setShowReplyModal(true);
  };

  const handleAssignClick = (quote) => {
    setQuoteToAssign(quote);
    setShowAssignModal(true);
  };

  useEffect(() => {
    if (viewQuote) {
      const updatedViewQuote = quotes.find(q => q._id === viewQuote._id);
      if (updatedViewQuote) {
        setViewQuote(updatedViewQuote);
      }
    }
    if (quoteToReply) {
      const updatedQuoteToReply = quotes.find(q => q._id === quoteToReply._id);
      if (updatedQuoteToReply) {
        setQuoteToReply(updatedQuoteToReply);
      }
    }
    if (quoteToAssign) {
      const updatedQuoteToAssign = quotes.find(q => q._id === quoteToAssign._id);
      if (updatedQuoteToAssign) {
        setQuoteToAssign(updatedQuoteToAssign);
      }
    }
  }, [quotes, viewQuote, quoteToReply, quoteToAssign]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? quote.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === 'createdAt' || sortConfig.key === 'assignedAt') {
      const dateA = aValue ? new Date(aValue) : new Date(0);
      const dateB = bValue ? new Date(bValue) : new Date(0);
      if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalQuotes = sortedQuotes.length;
  const totalPages = Math.ceil(totalQuotes / PAGE_SIZE);
  const paginatedQuotes = sortedQuotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  const getSenderName = (reply, currentQuoteContext) => {
    if (reply.senderType === 'admin') {
      return (reply.senderId && reply.senderId.name) ? reply.senderId.name : reply.senderEmail || 'Admin';
    }
    if (reply.senderType === 'customer') {
      return currentQuoteContext?.name || reply.senderEmail || 'Customer';
    }
    return 'Unknown';
  };

  if (isLoading || isLoadingAdmins) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading your assigned quotes and admins...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 rounded-lg shadow-md m-4">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error!</p>
        <p className="text-lg text-center">{error?.message || 'Failed to load assigned quotes.'}</p>
        <button
          onClick={() => refetchQuotes()}
          className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-inter antialiased">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[18px] sm:text-[24px] font-extrabold text-gray-900 leading-tight">
            My Assigned Quotes
          </h2>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
            Total: {totalQuotes}
          </span>
        </div>

        {(localSuccessMessage || localErrorMessage) && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            localErrorMessage ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          } shadow-sm`}>
            <div className="flex items-center">
              {localErrorMessage ? <FaTimesCircle className="mr-3 text-xl" /> : <FaCheckCircle className="mr-3 text-xl" />}
              <span className="text-base font-medium">{localErrorMessage || localSuccessMessage}</span>
            </div>
            <button
              onClick={() => { setLocalErrorMessage(''); setLocalSuccessMessage(''); }}
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, service or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Customer Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Customer Email
                    {sortConfig.key === 'email' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('service')}
                >
                  <div className="flex items-center">
                    Service
                    {sortConfig.key === 'service' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('assignedAt')}
                >
                  <div className="flex items-center">
                    Assigned On
                    {sortConfig.key === 'assignedAt' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No assigned quote requests found.
                  </td>
                </tr>
              ) : (
                paginatedQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{quote.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                      {quote.message.length > 50
                        ? `${quote.message.substring(0, 50)}...`
                        : quote.message
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editId === quote._id ? (
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleEditChange}
                          className="border rounded px-3 py-1 w-full text-sm"
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>{status.value}</option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={quote.status}
                          onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                          className={`${getStatusColor(quote.status)} border-0 rounded-full px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
                        >
                          {statusOptions.map((status) => (
                            <option
                              key={status.value}
                              value={status.value}
                              className="bg-white text-gray-800"
                            >
                              {status.value}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {quote.assignedAt ? new Date(quote.assignedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        {editId === quote._id ? (
                          <>
                            <button
                              onClick={handleEditSave}
                              className="text-green-600 hover:text-green-900 focus:outline-none cursor-pointer"
                              title="Save"
                              disabled={updateQuoteMutation.isPending}
                            >
                              {updateQuoteMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaSave size={18} />}
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                              title="Cancel"
                            >
                              <FaTimesCircle size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setViewQuote(quote)}
                              className="text-blue-600 hover:text-blue-900 focus:outline-none cursor-pointer"
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <button
                              onClick={() => handleReplyClick(quote)}
                              className="text-purple-600 hover:text-purple-900 focus:outline-none cursor-pointer"
                              title="Reply"
                            >
                              <FaReply size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(quote)}
                              className="text-indigo-600 hover:text-indigo-900 focus:outline-none cursor-pointer"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>
                            {(user?.role === 'admin' || user?.role === 'super admin') && (
                              <button
                                onClick={() => handleAssignClick(quote)}
                                className="text-orange-600 hover:text-orange-900 focus:outline-none cursor-pointer"
                                title="Re-assign Quote"
                                disabled={isLoadingAdmins}
                              >
                                <FaExchangeAlt size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalQuotes > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(page * PAGE_SIZE, totalQuotes)}
              </span>{' '}
              of <span className="font-medium">{totalQuotes}</span> results
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {viewQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 mt-10 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mt-7 mb-4">
                <h3 className="text-xl font-bold text-gray-800">Quote Details</h3>
                <button
                  onClick={() => setViewQuote(null)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{viewQuote.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{viewQuote.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{viewQuote.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{viewQuote.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewQuote.status)}`}>
                      {viewQuote.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Date Submitted</p>
                    <p className="font-medium">{new Date(viewQuote.createdAt).toLocaleString()}</p>
                  </div>
                  {viewQuote.assignedTo && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium">{viewQuote.assignedTo.name || viewQuote.assignedTo.email}</p>
                    </div>
                  )}
                  {viewQuote.assignedAt && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Assigned On</p>
                      <p className="font-medium">{new Date(viewQuote.assignedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-line">{viewQuote.message}</p>
                  </div>
                </div>

                {viewQuote.replies && viewQuote.replies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Conversation History</p>
                    <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-4 flex flex-col bg-gray-100 shadow-inner">
                      <div
                        className={`p-4 rounded-lg shadow-sm max-w-[85%] ${
                          'bg-green-100 border border-green-300 text-green-900 self-end mr-auto'
                        }`}
                      >
                        <p className="text-sm font-bold mb-1">
                          {viewQuote.name} (Original Request)
                        </p>
                        <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
                          {viewQuote.message}
                        </p>
                        <p className="text-xs text-gray-600 text-right mt-2">
                          {new Date(viewQuote.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {viewQuote.replies.map((reply, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg shadow-sm max-w-[85%] ${
                            reply.senderType === 'admin'
                              ? 'bg-blue-100 border border-blue-300 text-blue-900 self-start ml-auto'
                              : 'bg-green-100 border border-green-300 text-green-900 self-end mr-auto'
                          }`}
                        >
                          <p className="text-sm font-bold mb-1">
                            {getSenderName(reply, viewQuote)}
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
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t mt-4">
                <button
                  onClick={() => {
                    handleReplyClick(viewQuote);
                    setViewQuote(null);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    handleEdit(viewQuote);
                    setViewQuote(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                {(user?.role === 'admin' || user?.role === 'super admin') && (
                  <button
                    onClick={() => {
                      handleAssignClick(viewQuote);
                      setViewQuote(null);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    disabled={isLoadingAdmins}
                  >
                    Re-assign
                  </button>
                )}
                <button
                  onClick={() => setViewQuote(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showReplyModal && quoteToReply && (
          <AdminReplyQuoteModal
            quote={quoteToReply}
            onClose={() => setShowReplyModal(false)}
            onReplySuccess={() => {
              setLocalSuccessMessage('Reply sent successfully!');
              queryClient.invalidateQueries({ queryKey: ['assignedQuotes', user?._id] }); // FIXED: Use user?._id
              queryClient.invalidateQueries({ queryKey: ['quotes'] });
            }}
            onReplyError={(msg) => setLocalErrorMessage(msg)}
          />
        )}

        {showAssignModal && quoteToAssign && (
          <AssignQuoteModal
            quote={quoteToAssign}
            admins={admins}
            onClose={() => setShowAssignModal(false)}
            onAssignSuccess={(assignedToUser) => {
              assignQuoteMutation.mutate({
                quoteId: quoteToAssign._id,
                assignedToUserId: assignedToUser._id,
              });
            }}
            onAssignError={(msg) => setLocalErrorMessage(msg)}
            isAssigning={assignQuoteMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default MyAssignedQuoteRequestMain;
