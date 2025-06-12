import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="bg-gray-300 py-4 px-6 flex justify-between items-center relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-[#0A1F44]">IT Service Pro</h1>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-[#0A1F44] mb-1 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#0A1F44] mb-1 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#0A1F44] transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Navigation */}
        <div className="hidden lg:flex space-x-6 font-medium text-[#0A1F44]">
          <Link to="/">Home</Link>
          <Link to="/">Service</Link>
          <Link to="/">Testimonials</Link>
          <Link to="/">About Us</Link>
          <Link to="/">Contact</Link>
        </div>

        {/* CTA Button */}
        <Link to="" className="hidden lg:inline-block bg-[#00B9F1] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#00A1D1] transition">
          Get Free Quote →
        </Link>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-300 shadow-md flex flex-col items-center py-4 z-50 lg:hidden animate-fade-in">
            <Link to="/" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Service</Link>
            <Link to="/" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Testimonials</Link>
            <Link to="/" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="" className="mt-4 bg-[#00B9F1] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#00A1D1] transition" onClick={() => setMenuOpen(false)}>
              Get Free Quote →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default MainHeader