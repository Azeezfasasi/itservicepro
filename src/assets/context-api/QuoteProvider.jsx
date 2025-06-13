import React, { useState } from 'react';
import axios from 'axios';
import { QuoteContext } from './Request-quote-context/QuoteContext';

export const QuoteProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitQuote = async (form) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/quote',
        form
      );
      setSuccess(res.data.message || 'Quote request sent!');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to send quote request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <QuoteContext.Provider value={{ submitQuote, loading, error, success }}>
      {children}
    </QuoteContext.Provider>
  );
};