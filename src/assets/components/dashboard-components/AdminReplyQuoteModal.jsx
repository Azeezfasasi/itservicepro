    // import React, { useState } from 'react';
    // import { FaSpinner, FaTimesCircle, FaReply } from 'react-icons/fa';
    // import { useMutation } from '@tanstack/react-query';
    // import axios from 'axios';
    // import { API_BASE_URL } from '../../../config/api';
    // import { useUser } from '../../context-api/user-context/UseUser';

    // const AdminReplyQuoteModal = ({ quote, onClose, onReplySuccess, onReplyError }) => {
    //   const [replyMessage, setReplyMessage] = useState('');
    //   const { token } = useUser();

    //   const adminReplyMutation = useMutation({
    //     mutationFn: async (message) => {
    //       const res = await axios.post(
    //         `${API_BASE_URL}/quotes/${quote._id}/reply/admin`,
    //         { replyMessage: message },
    //         { headers: { Authorization: `Bearer ${token}` } }
    //       );
    //       return res.data;
    //     },
    //     onSuccess: () => {
    //       onReplySuccess(); // Call the success callback from parent
    //       onClose(); // Close the modal
    //     },
    //     onError: (err) => {
    //       onReplyError(err.response?.data?.error || 'Failed to send reply.');
    //     },
    //   });

    //   const handleSubmitReply = () => {
    //     if (!replyMessage.trim()) {
    //       onReplyError('Reply message cannot be empty.');
    //       return;
    //     }
    //     adminReplyMutation.mutate(replyMessage);
    //   };

    //   return (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    //       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
    //         <button
    //           onClick={onClose}
    //           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
    //         >
    //           <FaTimesCircle size={24} />
    //         </button>
    //         <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">Reply to Quote Request from {quote.name}</h3>

    //         {/* Conversation History (Optional, can be removed if not needed here) */}
    //         {quote.replies && quote.replies.length > 0 && (
    //           <div className="mt-4 pt-4 border-t border-gray-200">
    //             <p className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Conversation History</p>
    //             <div className="max-h-48 overflow-y-scroll border border-gray-200 rounded-md p-3 space-y-3 flex flex-col bg-gray-50 shadow-inner">
    //               <div className={`p-4 rounded-lg shadow-sm max-w-[85%] bg-green-100 border border-green-300 text-green-900 self-end ml-auto`}>
    //                 <p className="text-sm font-bold mb-1">{quote.name} (Original Request)</p>
    //                 <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{quote.message}</p>
    //                 <p className="text-xs text-gray-600 text-right mt-1">{new Date(quote.createdAt).toLocaleString()}</p>
    //               </div>
    //               {quote.replies.map((reply, index) => (
    //                 <div
    //                   key={index}
    //                   className={`p-4 rounded-lg shadow-sm max-w-[85%] ${
    //                     reply.senderType === 'admin'
    //                       ? 'bg-blue-100 border border-blue-300 text-blue-900 self-start mr-auto'
    //                       : 'bg-green-100 border border-green-300 text-green-900 self-end ml-auto'
    //                   }`}
    //                 >
    //                   <p className="text-sm font-bold mb-1">
    //                     {reply.senderType === 'admin' ? (reply.senderId?.name || reply.senderEmail || 'Admin') : (quote.name || reply.senderEmail || 'Customer')}
    //                   </p>
    //                   <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{reply.message}</p>
    //                   <p className="text-xs text-gray-600 text-right mt-1">{new Date(reply.repliedAt).toLocaleString()}</p>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         )}

    //         <div className="mt-6">
    //           <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-700 mb-1">
    //             Your Reply
    //           </label>
    //           <textarea
    //             id="replyMessage"
    //             value={replyMessage}
    //             onChange={(e) => setReplyMessage(e.target.value)}
    //             className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[100px]"
    //             placeholder="Type your reply here..."
    //           ></textarea>
    //         </div>
    //         <div className="mt-4 flex justify-end gap-3">
    //           <button
    //             onClick={handleSubmitReply}
    //             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    //             disabled={adminReplyMutation.isPending}
    //           >
    //             {adminReplyMutation.isPending ? <FaSpinner className="animate-spin mr-2" /> : <FaReply className="mr-2" />}
    //             Send Reply
    //           </button>
    //           <button
    //             onClick={onClose}
    //             className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };

// export default AdminReplyQuoteModal;
    
import React, { useState } from 'react';
import { FaSpinner, FaTimes, FaReply } from 'react-icons/fa'; // Changed FaTimesCircle to FaTimes as per your snippet
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { useUser } from '../../context-api/user-context/UseUser';

const AdminReplyQuoteModal = ({ quote, onClose, onReplySuccess, onReplyError }) => {
  const [replyMessage, setReplyMessage] = useState('');
  const { token, user } = useUser(); // Get token and user for authentication and invalidation
  const queryClient = useQueryClient();

  // Helper function for sender name (moved from parent)
  const getSenderName = (reply, currentQuoteContext) => {
    if (reply.senderType === 'admin') {
      // If senderId is populated, use its name, otherwise fallback to email or 'Admin'
      return (reply.senderId && reply.senderId.name) ? reply.senderId.name : reply.senderEmail || 'Admin';
    }
    if (reply.senderType === 'customer') {
      // Use the quote's name for customer replies, fallback to email or 'Customer'
      return currentQuoteContext?.name || reply.senderEmail || 'Customer';
    }
    return 'Unknown';
  };

  // Mutation for sending the admin reply
  const adminReplyToQuoteMutation = useMutation({
    mutationFn: async (message) => {
      const res = await axios.post(
        `${API_BASE_URL}/quotes/${quote._id}/reply/admin`,
        { replyMessage: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.updatedQuote; // Return the updated quote
    },
    onSuccess: () => {
      // Invalidate queries to refetch the updated quote lists
      queryClient.invalidateQueries({ queryKey: ['assignedQuotes', user?._id] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] }); // Invalidate all quotes list as well
      onReplySuccess(); // Notify parent of success
      onClose(); // Close the modal
    },
    onError: (err) => {
      onReplyError(err.response?.data?.error || 'Failed to send reply.');
    },
  });

  const handleSubmitReply = () => {
    if (!replyMessage.trim()) {
      onReplyError('Reply message cannot be empty.');
      return;
    }
    adminReplyToQuoteMutation.mutate(replyMessage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <FaTimes size={24} />
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Reply to Quote Request from {quote.name}</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Recipient Email</p>
            <p className="font-medium">{quote.email}</p>
          </div>

          {/* Display Existing Replies in Reply Modal - STYLED CHAT HISTORY */}
          {quote.replies && quote.replies.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Conversation History</p>
              <div className="max-h-48 overflow-y-scroll border border-gray-200 rounded-md p-3 space-y-3 flex flex-col bg-gray-50 shadow-inner">
                {/* Original Quote Message */}
                <div
                  className={`p-4 rounded-lg shadow-sm max-w-[85%] ${
                    'bg-green-100 border border-green-300 text-green-900 self-start mr-auto' // Original message from customer
                  }`}
                >
                  <p className="text-sm font-bold mb-1">
                    {quote.name} (Original Request)
                  </p>
                  <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
                    {quote.message}
                  </p>
                  <p className="text-xs text-gray-600 text-right mt-1">
                    {new Date(quote.createdAt).toLocaleString()}
                  </p>
                </div>
                {/* Existing Replies */}
                {quote.replies.map((reply, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg shadow-sm max-w-[85%] ${
                      reply.senderType === 'admin'
                        ? 'bg-blue-100 border border-blue-300 text-blue-900 self-end ml-auto' // Admin replies
                        : 'bg-green-100 border border-green-300 text-green-900 self-start mr-auto' // Customer replies
                    }`}
                  >
                    <p className="text-sm font-bold mb-1">
                      {getSenderName(reply, quote)}
                    </p>
                    <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
                      {reply.message}
                    </p>
                    <p className="text-xs text-gray-600 text-right mt-1">
                      {new Date(reply.repliedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Your New Reply
            </label>
            <textarea
              id="replyMessage"
              name="replyMessage"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[80px]"
              rows="3"
              placeholder="Type your reply here..."
            ></textarea>
          </div>
        </div>
        <div className="pt-4 flex justify-end space-x-3 border-t mt-4">
          <button
            onClick={handleSubmitReply} // Call the local submit handler
            className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={adminReplyToQuoteMutation.isPending}
          >
            {adminReplyToQuoteMutation.isPending ? <FaSpinner className="animate-spin mr-2" /> : <FaReply className="mr-2" />}
            Send Reply
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReplyQuoteModal;

    