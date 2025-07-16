import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

function SubscribeToNewsletterPopUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async (email) => {
      const res = await axios.post(`${API_BASE_URL}/newsletter/subscribe`, { email, name });
      return res.data;
    },
    onSuccess: (data) => {
      setSuccess(data.message || 'Subscribed successfully!');
      setError('');
      setEmail('');
      setName('');
    },
    onError: (err) => {
      setError(err?.response?.data?.error || 'Subscription failed.');
      setSuccess('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    mutation.mutate(email);
  };

  return (
    <>
    <div className="flex flex-col flex-1 border border-solid border-gray-400 justify-start items-center py-4 rounded-md">
        {success && <p className="text-green-400 text-xs mt-2">{success}</p>}
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        <form className="w-[90%] md:w-[60%] flex flex-col sm:flex-col items-center gap-2" onSubmit={handleSubmit}>
        <input
            type="name"
            placeholder="Your name"
            className="w-full px-3 py-2 rounded text-blue-700 focus:outline-blue-700 borde border-solid border-orange-500 outline"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={mutation.isLoading}
        />
        <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2 rounded text-blue-700 focus:outline-blue-700 borde border-solid border-orange-500 outline"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={mutation.isLoading}
        />
        <button
            type="submit"
            className="w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition cursor-pointer"
            disabled={mutation.isLoading}
        >
            {mutation.isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
        </form>
        {success && <p className="text-green-400 text-xs mt-2">{success}</p>}
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>   
    </>
  )
}

export default SubscribeToNewsletterPopUp