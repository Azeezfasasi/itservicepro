import { useState } from 'react'
import { Link } from 'react-router-dom'
import accountprofile from '../images/accountprofile.svg'
import CartIcon from './dashboard-components/CartIcon';
import WishlistIcon from './dashboard-components/Wishlisticon';
import marshalllogo from '../images/marshalllogo.png'

function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="bg-gray-300 py-4 px-2 md:px-6 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={marshalllogo} alt="logo"  className='w-[150px] h-[40px]'/>
        </Link>

        {/* Hamburger Icon (Mobile) */}
        <div className='lg:hidden flex flex-row justify-start items-center gap-4'>
          <Link to="/login" className='lg:hidden block'>
            <img src={accountprofile} alt="profile" className='w-8 h-8 lg:hidden block' />
          </Link>
          <WishlistIcon />
          <CartIcon />
          <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-[#0A1F44] mb-1 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-[#0A1F44] mb-1 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-[#0A1F44] transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Navigation */}
        <div className="hidden lg:flex space-x-6 font-medium text-[#0A1F44]">
          <Link to="/">Home</Link>
          <Link to="/aboutus">About Us</Link>
          <Link to="/ourservices">Our Service</Link>
          <Link to="/recentproject">Recent Projects</Link>
          <Link to="/app/shop">Shop</Link>
          <Link to="/app/trackorder">Track Orders</Link>
          <Link to="/app/blog">Blog</Link>
          <Link to="/contactus">Contact Us</Link>
        </div>

        {/* CTA Button */}
        <div className='hidden lg:flex flex-row justify-start gap-4 items-center'>
          <Link to="/login" className='hidden lg:block'>
            <img src={accountprofile} alt="profile" className='w-10 h-10 hidden lg:block' />
          </Link>
          <div className='hidden lg:flex flex-row justify-start gap-4 items-center'>
            <WishlistIcon />
            <CartIcon />
          </div>
          <Link to="/quoterequest" className="hidden lg:inline-block bg-[#00B9F1] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#00A1D1] transition">
          Get Free Quote →
          </Link>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-300 shadow-md flex flex-col items-center py-4 z-50 lg:hidden animate-fade-in">
            <Link to="/" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/aboutus" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link to="/ourservices" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Our Service</Link>
            <Link to="/recentproject" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Recent Projects</Link>
            <Link to="/app/shop" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/app/trackorder" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Track Orders</Link>
            <Link to="/app/blog" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link to="/contactus" className="py-2 w-full text-center text-[#0A1F44] font-medium hover:bg-gray-200" onClick={() => setMenuOpen(false)}>Contact Us</Link>
            <Link to="/quoterequest" className="mt-4 bg-[#00B9F1] text-white font-semibold px-4 py-2 rounded-full hover:bg-[#00A1D1] transition" onClick={() => setMenuOpen(false)}>
              Get Free Quote →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default MainHeader