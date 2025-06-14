import React, { useState } from 'react';
import { useQuote } from '../../context-api/Request-quote-context/UseQuote';

const statusOptions = ['Pending', 'In Review', 'Done', 'Completed', 'Rejected'];
const PAGE_SIZE = 10;

const QuoteList = () => {
  const { quotes, deleteQuote, updateQuote, loading, error, success } = useQuote();
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(1);

  // Removed useEffect that calls fetchQuotes to avoid repeated API calls

  const handleEdit = (quote) => {
    setEditId(quote._id);
    setEditData({ ...quote });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await updateQuote(editId, editData);
    setEditId(null);
  };

  const handleStatusChange = async (id, status) => {
    await updateQuote(id, { status });
  };

  // Pagination logic
  const totalQuotes = quotes.length;
  const totalPages = Math.ceil(totalQuotes / PAGE_SIZE);
  const paginatedQuotes = quotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#0A1F44]">All Quote Requests</h2>
        <span className="text-sm text-gray-600">Total: {totalQuotes}</span>
      </div>
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center text-red-500 py-2">{error}</div>}
      {success && <div className="text-center text-green-600 py-2">{success}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-[#f0f4fa] text-[#0A1F44]">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Service</th>
              <th className="py-2 px-4 border">Message</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQuotes.map((quote) => (
              <tr key={quote._id} className="text-center">
                <td className="py-2 px-4 border">
                  {editId === quote._id ? (
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    quote.name
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editId === quote._id ? (
                    <input
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    quote.email
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editId === quote._id ? (
                    <input
                      name="service"
                      value={editData.service}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    quote.service
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editId === quote._id ? (
                    <input
                      name="message"
                      value={editData.message}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    quote.message
                  )}
                </td>
                <td className="py-2 px-4 border">
                  {editId === quote._id ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleEditChange}
                      className="border rounded px-2 py-1"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="py-2 px-4 border flex flex-col gap-2">
                  {editId === quote._id ? (
                    <>
                      <button
                        onClick={handleEditSave}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mb-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(quote)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mb-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteQuote(quote._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {paginatedQuotes.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="py-4 text-gray-500">No quote requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteList;