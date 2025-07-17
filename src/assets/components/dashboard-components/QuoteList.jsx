import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { useUser } from '../../context-api/user-context/UseUser';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaEye, FaFilter, FaSearch, FaSave, FaTimesCircle, FaSortAmountDown, FaSortAmountUp, FaReply, FaSpinner, FaUserPlus, FaUser, FaEnvelope, FaPhone, FaTools, FaInfoCircle, FaUserTie, FaCalendarAlt  } from 'react-icons/fa';
import AssignQuoteModal from './AssignQuoteModal';
import AdminReplyQuoteModal from './AdminReplyQuoteModal';

const statusOptions = [
  { value: 'Waiting for Support', color: 'bg-purple-100 text-purple-800' },
  { value: 'Waiting for Customer', color: 'bg-pink-100 text-pink-800' },
  { value: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'In Review', color: 'bg-blue-100 text-blue-800' },
  { value: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'Done', color: 'bg-orange-100 text-orange-800' },
  { value: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'Rejected', color: 'bg-red-100 text-red-800' }
];

const PAGE_SIZE = 10;

const QuoteList = () => {
  const queryClient = useQueryClient();
  const { user, token } = useUser();

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(1);
  const [viewQuote, setViewQuote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [localSuccessMessage, setLocalSuccessMessage] = useState('');
  const [localErrorMessage, setLocalErrorMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [quoteToReply, setQuoteToReply] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [quoteToAssign, setQuoteToAssign] = useState(null);


  const getAuthHeaders = useCallback(() => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, [token]);

  const fetchAllQuotes = async () => {
    if (!token) return [];
    // The backend's getAllQuoteRequests should already populate 'assignedTo'.
    // If it's not, you'd add a query param here like:
    // const res = await axios.get(`${API_BASE_URL}/quotes?populate=assignedTo`, getAuthHeaders());
    // But since your backend already populates it, this line remains simple:
    const res = await axios.get(`${API_BASE_URL}/quotes`, getAuthHeaders());
    return res.data;
  };

  const {
    data: quotes = [],
    isLoading,
    isError,
    error,
    refetch: refetchQuotes
  } = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchAllQuotes,
    enabled: !!token,
    // staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to fetch quotes.');
    },
  });

   // Fetch all admin users for assignment dropdown
  const { data: admins = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Attempting to fetch admin users for QuoteList...');
      if (!token || (!user?.role === 'admin' && !user?.role === 'super admin')) {
        console.warn('Cannot fetch admins: Token or User role is insufficient.');
        return [];
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/users/admins`, getAuthHeaders());
        console.log('Admins API response for QuoteList:', res.data);
        return res.data;
      } catch (err) {
        console.error('Error fetching admins from API in QuoteList:', err.response?.data || err.message);
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
      queryClient.invalidateQueries({ queryKey: ['quotes'] }); // Invalidate to refetch list
      // No need to setQueryData here if invalidateQueries is used for the list
    },
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to update quote.');
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/quotes/${id}`, getAuthHeaders());
    },
    onSuccess: () => {
      setLocalSuccessMessage('Quote deleted successfully!');
      setShowDeleteModal(false);
      setQuoteToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to delete quote.');
    },
  });

  // Mutation for assigning a quote (used by AssignQuoteModal)
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
      setLocalSuccessMessage(`Quote assigned successfully to ${data.updatedQuote.assignedTo.name || data.updatedQuote.assignedTo.email}!`);
      setShowAssignModal(false); // Close the modal
      setQuoteToAssign(null); // Clear the quote to assign
      queryClient.invalidateQueries({ queryKey: ['quotes'] }); // Invalidate all quotes list
      queryClient.invalidateQueries({ queryKey: ['assignedQuotes', user?._id] }); // Invalidate assigned quotes list
    },
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to assign quote.');
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
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      // No need to setQueryData here if invalidateQueries is used for the list
    },
    onError: (err) => {
      setLocalErrorMessage(err.response?.data?.error || 'Failed to send reply.');
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

  const handleDeleteClick = (quote) => {
    setQuoteToDelete(quote);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteQuoteMutation.mutate(quoteToDelete._id);
  };

  const handleReplyClick = (quote) => {
    setQuoteToReply(quote);
    setShowReplyModal(true);
  };

  // Callback for when a quote is successfully assigned from the modal
  const handleAssignSuccess = (updatedQuote) => {
    // This callback is triggered when AssignQuoteModal successfully assigns.
    // The mutation's onSuccess in AssignQuoteModal already invalidates 'quotes'.
    // We just need to ensure our local modal states reflect the update.
    if (viewQuote && viewQuote._id === updatedQuote._id) {
      setViewQuote(updatedQuote);
    }
    if (quoteToReply && quoteToReply._id === updatedQuote._id) {
      setQuoteToReply(updatedQuote);
    }
    if (quoteToAssign && quoteToAssign._id === updatedQuote._id) {
      setQuoteToAssign(updatedQuote); // Update the quoteToAssign state as well
    }
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

    if (sortConfig.key === 'assignedTo') {
      // Safely access name or email for sorting
      const nameA = a.assignedTo?.name || a.assignedTo?.email || '';
      const nameB = b.assignedTo?.name || b.assignedTo?.email || '';
      if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
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


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading quotes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 rounded-lg shadow-md m-4">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error!</p>
        <p className="text-lg text-center">{error?.message || 'Failed to load quotes.'}</p>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quote Requests</h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Total: {totalQuotes}
        </div>
      </div>

      {(localErrorMessage || localSuccessMessage) && (
        <div className="mb-4 p-3 rounded-md border flex items-center justify-between
          ${localErrorMessage ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}">
          <div className="flex items-center">
            {localErrorMessage ? <FaTimes className="mr-2" /> : <FaCheck className="mr-2" />}
            <span>{localErrorMessage || localSuccessMessage}</span>
          </div>
          <button
            onClick={() => { setLocalErrorMessage(''); setLocalSuccessMessage(''); }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimesCircle />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.value}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 flex items-center">
          {(isLoading || updateQuoteMutation.isPending || deleteQuoteMutation.isPending || adminReplyToQuoteMutation.isPending) ? (
            <div className="flex items-center">
              <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" />
              Loading quotes...
            </div>
          ) : (
            <span>
              Showing {paginatedQuotes.length} of {totalQuotes} quotes
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortConfig.key === 'email' && (
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('phone')}
              >
                <div className="flex items-center">
                  Phone Number
                  {sortConfig.key === 'phone' && (
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
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
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
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
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('assignedTo')}
              >
                <div className="flex items-center">
                  Assigned To
                  {sortConfig.key === 'assignedTo' && (
                    sortConfig.direction === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedQuotes.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No quote requests found.
                </td>
              </tr>
            ) : (
              paginatedQuotes.map((quote) => (
                <tr key={quote._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editId === quote._id ? (
                      <input
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{quote.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editId === quote._id ? (
                      <input
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{quote.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editId === quote._id ? (
                      <input
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{quote.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editId === quote._id ? (
                      <input
                        name="service"
                        value={editData.service}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{quote.service}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editId === quote._id ? (
                      <textarea
                        name="message"
                        value={editData.message}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-1 w-full"
                        rows="2"
                      />
                    ) : (
                      <div className="text-sm text-gray-600 truncate max-w-xs">
                        {quote.message.length > 50
                          ? `${quote.message.substring(0, 50)}...`
                          : quote.message
                        }
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editId === quote._id ? (
                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-1 w-full"
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Display assignedTo name or email, or 'Unassigned' */}
                    {quote.assignedTo ? (
                      <div className="text-sm text-gray-900">
                        {quote.assignedTo.name || quote.assignedTo.email}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">Unassigned</div>
                    )}
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
                          <button
                            onClick={() => handleAssignClick(quote)}
                            className="text-orange-600 hover:text-orange-900 focus:outline-none cursor-pointer"
                            title="Assign"
                          >
                            <FaUserPlus size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(quote)}
                            className="text-red-600 hover:text-red-900 focus:outline-none cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash size={18} />
                          </button>
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

      {totalPages > 1 && (
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

      {/* View Quote Modal */}
      {viewQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-55 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mt-7 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Quote Details</h3>
              <button
                onClick={() => setViewQuote(null)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <FaUser className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900 text-lg">{viewQuote.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{viewQuote.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{viewQuote.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaTools className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Service Requested</p>
                  <p className="font-medium">{viewQuote.service}</p>
                </div>
              </div>
              <div className="flex items-center col-span-1 md:col-span-2">
                <FaInfoCircle className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewQuote.status)}`}>
                    {viewQuote.status}
                  </span>
                </div>
              </div>
              {viewQuote.assignedTo && (
                <div className="flex items-center col-span-1 md:col-span-2">
                  <FaUserTie className="text-blue-500 mr-3 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="font-medium">{viewQuote.assignedTo.name || viewQuote.assignedTo.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center col-span-1 md:col-span-2">
                <FaCalendarAlt className="text-blue-500 mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Date Submitted</p>
                  <p className="font-medium">{new Date(viewQuote.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Original message */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
              <p className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <FaInfoCircle className="mr-2" /> Your Original Message
              </p>
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <p className="whitespace-pre-line">{viewQuote.message}</p>
              </div>
            </div>

            {/* Display Replies in View Quote Modal - STYLED CHAT HISTORY */}
              {viewQuote.replies && viewQuote.replies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Conversation History</p>
                  <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-4 flex flex-col bg-gray-100 shadow-inner">
                    {/* Original Quote Message as the first message in the chat */}
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

                    {/* Existing Replies */}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && quoteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the quote request from{' '}
              <span className="font-semibold">{quoteToDelete.name}</span> for{' '}
              <span className="font-semibold">{quoteToDelete.service}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={deleteQuoteMutation.isPending}
              >
                {deleteQuoteMutation.isPending ? <FaSpinner className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Reply Quote Modal */}
      {showReplyModal && quoteToReply && (
        <AdminReplyQuoteModal
          quote={quoteToReply}
          onClose={() => setShowReplyModal(false)}
          onReplySuccess={() => {
            setLocalSuccessMessage('Reply sent successfully!');
            queryClient.invalidateQueries({ queryKey: ['quotes'] });
            queryClient.invalidateQueries({ queryKey: ['assignedQuotes', user?._id] });
          }}
          onReplyError={(msg) => setLocalErrorMessage(msg)}
        />
      )}
      
      {/* Assign Quote Modal */}
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
  );
};

export default QuoteList;