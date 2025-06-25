import React, { useState, useEffect } from 'react';
import { useQuote } from '../context-api/Request-quote-context/UseQuote';

function RequestQuote() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const { submitQuote, loading, error, success } = useQuote();

   useEffect(() => {
    if (success) {
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    }
  }, [success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitQuote(form);
    if (success) setForm({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
              Need Tech Support or IT Services?
            </h1>
            <p className='font-semibold text-[18px]'>Get in Touch Today!</p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
              Whether you need a laptop repair, a website/app built, a complete office IT setup, or any other tech service, our team is here to help. <br /> Have a question, need a quote, or ready to schedule a service? We’re just a call or message away.
              <br />
              Reach out using the contact details below or fill out our quick form and we will respond promptly.
              We look forward to delivering reliable, professional tech solutions that keep you moving forward.
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mt-8">
              <div className="flex items-center space-x-3">
                {/* Phone icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone text-blue-500">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="text-gray-700">Fast Service: <a href="tel:202-555-0187" className="text-blue-500 hover:underline">(+234) 0811725648</a></span>
              </div>
              <div className="flex items-center space-x-3">
                {/* Mail icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-blue-500">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span className="text-gray-700"><a href="mailto:infohomepro@email.com" className="text-blue-500 hover:underline">info@itservicepro.com</a></span>
              </div>
            </div>
          </div>

          {/* Right Section: Free Quote Form */}
          <div className="bg-gray-50 p-8 rounded-3xl shadow-xl w-full max-w-lg mx-auto border border-solid border-gray-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center lg:text-left">Free Quote Request</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {success && <p className="text-green-600 text-center mt-2">{success}</p>}
              {error && <p className="text-red-600 text-center mt-2">{error}</p>}
              <div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Service</option>
                  <option value="Laptop Repair">Laptop Repair</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Laptop Purchase">Laptop Purchase</option>
                  <option value="Office Computer & Server Setup">Office Computer & Server Setup</option>
                  <option value="IT Solutions">IT Solutions</option>                  
                  <option value="Networking">Networking</option>
                  <option value="Data Recovery">Data Recovery</option>
                  <option value="Software Installation">Software Installation</option>
                  <option value="Hardware Upgrade">Hardware Upgrade</option>
                  <option value="Virus Removal">Virus Removal</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other Tech Services</option>
                </select>
              </div>
              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Service Needed"
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <span>{loading ? 'Sending...' : 'Request Quote'}</span>
                {/* Phone icon for the button */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-call">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestQuote;