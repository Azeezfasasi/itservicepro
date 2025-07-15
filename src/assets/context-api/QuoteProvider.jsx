import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { QuoteContext } from './Request-quote-context/QuoteContext';
import { API_BASE_URL } from '../../config/api';
import { UserContext } from './user-context/UserContext';

export const QuoteProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quotes, setQuotes] = useState([]);
  const { token, user } = useContext(UserContext);

  // --- Declare all useCallback functions first ---

  const getAuthHeaders = useCallback(() => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, [token]);

  const submitQuote = useCallback(async (form) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${API_BASE_URL}/quote`, form);
      setSuccess(res.data.message || 'Quote request sent!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching ALL quotes (Admin view)...');
      const res = await axios.get(`${API_BASE_URL}/quotes`, getAuthHeaders());
      console.log('Quotes response (Admin view):', res);
      setQuotes(res.data);
      return res.data;
    } catch (err) {
      console.log('Fetch ALL quotes error (Admin view):', err.response || err.data);
      setError('Failed to fetch all quote requests.');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchSingleQuote = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/customer/quotes/${id}`, getAuthHeaders());
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Error fetching single quote:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Failed to fetch quote details.');
      setLoading(false);
      throw err;
    }
  }, [getAuthHeaders]);

  const fetchCustomerQuotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching customer quotes...');
      const res = await axios.get(`${API_BASE_URL}/customer/my-quotes`, getAuthHeaders());
      setQuotes(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching customer quotes:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Failed to fetch your quote requests.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const deleteQuote = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`${API_BASE_URL}/quotes/${id}`, getAuthHeaders());
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      setSuccess('Quote request deleted.');
    } catch (err) {
      console.log(err);
      setError('Failed to delete quote request.');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const updateQuote = useCallback(async (id, updates) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`${API_BASE_URL}/quotes/${id}`, updates, getAuthHeaders());
      setQuotes((prev) => prev.map((q) => (q._id === id ? res.data : q)));
      setSuccess('Quote request updated.');
      return res.data;
    } catch (err) {
      console.log(err);
      setError('Failed to update quote request.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const adminReplyToQuote = useCallback(async (id, replyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/quotes/${id}/reply/admin`, replyData, getAuthHeaders());
      setQuotes(prevQuotes => prevQuotes.map(quote =>
        quote._id === id ? response.data.updatedQuote : quote
      ));
      setSuccess(response.data.message || 'Reply sent successfully!');
      return response.data.updatedQuote;
    } catch (err) {
      console.error('Error sending admin reply:', err);
      setError(err.response?.data?.error || 'Failed to send reply.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const customerReplyToQuote = useCallback(async (id, replyMessage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/customer/quotes/${id}/reply`, { replyMessage }, getAuthHeaders());
      setSuccess(response.data.message || 'Your reply has been sent!');
      return response.data.updatedQuote;
    } catch (err) {
      console.error('Error sending customer reply:', err);
      setError(err.response?.data?.error || 'Failed to send reply.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // --- Now, the useEffect that calls them ---
  useEffect(() => {
    if (token && user) {
      if (user.role === 'super admin' || user.role === 'admin') {
        fetchQuotes();
      } else if (user.role === 'customer' || user.role === 'user') {
        fetchCustomerQuotes();
      }
    }
  }, [token, user?.role, fetchQuotes, fetchCustomerQuotes]); // Dependencies are correct here

  // Clear success/error messages after a delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <QuoteContext.Provider value={{
      submitQuote,
      fetchQuotes,
      fetchSingleQuote,
      fetchCustomerQuotes,
      deleteQuote,
      updateQuote,
      adminReplyToQuote,
      customerReplyToQuote,
      quotes,
      loading,
      error,
      success,
      user
    }}>
      {children}
    </QuoteContext.Provider>
  );
};
