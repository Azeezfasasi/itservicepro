import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import SubscribeToNewsletter from './SubscribeToNewsletter'

function Footer() {
  return (
    <footer className="bg-[#0A1F44] text-white pt-10 pb-4 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
        {/* Company Info */}
        <div className="flex-1 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">IT Service Pro</h2>
          <p className="mb-4 text-gray-300">
            Your trusted partner for IT solutions, support, and consulting. We deliver reliable, secure, and innovative technology services for businesses of all sizes.
          </p>
          <div className="flex items-center mb-2">
            <Phone className="w-4 h-4 mr-2 text-[#00B9F1]" />
            <a href="tel:08117256648" className="text-gray-200 hover:text-[#00B9F1] transition">(+234) 08117256648</a>
          </div>
          <div className="flex items-center mb-2">
            <Mail className="w-4 h-4 mr-2 text-[#00B9F1]" />
            <a href="mailto:info@itservicepro.com" className="text-gray-200 hover:text-[#00B9F1] transition">info@itservicepro.com</a>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-[#00B9F1]" />
            <span className="text-gray-200">123 Ikorodu Road, Lagos, Nigeria</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex-1 mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-[#00B9F1] transition">Home</Link></li>
            <li><Link to="/aboutus"className="hover:text-[#00B9F1] transition">About Us</Link></li>
            <li><Link to="/ourservices" className="hover:text-[#00B9F1] transition">Services</Link></li>
            <li><Link to="/contactus" className="hover:text-[#00B9F1] transition">Contact</Link></li>
            <li><Link to="/quoterequest" className="hover:text-[#00B9F1] transition">Get Free Quote</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <SubscribeToNewsletter />
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} IT Service Pro. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer