// import React, { useState } from 'react';
// import { FaSpinner, FaTimesCircle, FaUserPlus } from 'react-icons/fa';

// // This modal is responsible for selecting an admin and triggering the assignment
// const AssignQuoteModal = ({ quote, admins = [], onClose, onAssignSuccess, onAssignError, isAssigning }) => {
//   const [selectedAdminId, setSelectedAdminId] = useState(quote.assignedTo?._id || ''); // Pre-select current assignee
//   const [localError, setLocalError] = useState('');

//   const handleAssign = () => {
//     if (!selectedAdminId) {
//       setLocalError('Please select an admin to assign the quote.');
//       return;
//     }
//     setLocalError('');
//     // Call the parent's onAssignSuccess, which will trigger the mutation
//     const assignedToUser = admins.find(admin => admin._id === selectedAdminId);
//     if (assignedToUser) {
//       onAssignSuccess(assignedToUser);
//     } else {
//       onAssignError('Selected admin not found in the list.');
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
//         >
//           <FaTimesCircle size={24} />
//         </button>
//         <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">Re-assign Quote: {quote.name}</h3>

//         {localError && (
//           <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
//             {localError}
//           </div>
//         )}

//         <div className="mb-4">
//           <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
//             Assign to:
//           </label>
//           <select
//             id="assignee"
//             value={selectedAdminId}
//             onChange={(e) => setSelectedAdminId(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             disabled={isAssigning}
//           >
//             <option value="">Select an Admin</option>
//             {/* This map will now always run on an array (empty or populated) */}
//             {admins.map((admin) => (
//               <option key={admin._id} value={admin._id}>
//                 {admin.name} ({admin.email})
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mt-6 flex justify-end space-x-3">
//           <button
//             onClick={handleAssign}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             disabled={isAssigning}
//           >
//             {isAssigning ? <FaSpinner className="animate-spin mr-2" /> : <FaUserPlus className="mr-2" />}
//             {isAssigning ? 'Re-assigning...' : 'Re-assign'}
//           </button>
//           <button
//             onClick={onClose}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             disabled={isAssigning}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignQuoteModal;

import React, { useState } from 'react';
import { FaSpinner, FaTimesCircle, FaUserPlus } from 'react-icons/fa';

// This modal is responsible for selecting an admin and triggering the assignment
const AssignQuoteModal = ({ quote, admins = [], onClose, onAssignSuccess, onAssignError, isAssigning }) => {
  const [selectedAdminId, setSelectedAdminId] = useState(quote.assignedTo?._id || ''); // Pre-select current assignee
  const [localError, setLocalError] = useState('');

  const handleAssign = () => {
    if (!selectedAdminId) {
      setLocalError('Please select an admin to assign the quote.');
      return;
    }
    setLocalError('');
    // Call the parent's onAssignSuccess, which will trigger the mutation
    const assignedToUser = admins.find(admin => admin._id === selectedAdminId);
    if (assignedToUser) {
      onAssignSuccess(assignedToUser);
    } else {
      onAssignError('Selected admin not found in the list.');
    }
  };

  const currentAssigneeName = quote.assignedTo?.name || quote.assignedTo?.email;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <FaTimesCircle size={24} />
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">Re-assign Quote: {quote.name}</h3>

        {localError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {localError}
          </div>
        )}

        {/* NEW: Display Currently Assigned Admin */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          <p className="font-semibold mb-1">Currently Assigned To:</p>
          {quote.assignedTo ? (
            <p className="font-medium">
              {currentAssigneeName} ({quote.assignedTo.email})
            </p>
          ) : (
            <p className="text-gray-600 italic">Not yet assigned</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
            Assign to:
          </label>
          <select
            id="assignee"
            value={selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isAssigning}
          >
            <option value="">Select an Admin</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.name} ({admin.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleAssign}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isAssigning}
          >
            {isAssigning ? <FaSpinner className="animate-spin mr-2" /> : <FaUserPlus className="mr-2" />}
            {isAssigning ? 'Re-assigning...' : 'Re-assign'}
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isAssigning}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignQuoteModal;
