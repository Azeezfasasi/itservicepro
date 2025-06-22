import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import accountprofile from '../../images/accountprofile.svg';
import { useUser } from '../../context-api/user-context/UseUser';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import { Sidenav, Nav } from 'rsuite';

function DashHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [linkOpen, setLinkOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const {isSuperAdmin, isAdmin, isUser, isCustomer} = useUser()
  const location = useLocation();

  // Map route paths to eventKeys
  const menuKeyByPath = {
    '/app/dashboard': '1',
    '/app/quote': '2',
    '/app/blogposts': '3-1',
    '/app/addnewpost': '3-2',
    '/app/profile': '4',
    '/app/allusers': '5-1',
    '/app/addnewuser': '5-2',
    '/app/changeuserpassword': '5-3',
    '/app/products': '6-1',
    '/app/addproduct': '6-2',
    '/app/productcategories': '6-3',
    '/app/addproductcategory': '6-4',
    '/app/userorderdetails': '7',
    '/app/adminorderlist': '8',
    '/app/mysettings': '9',
  };
  const activeKey = menuKeyByPath[location.pathname];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) setProfileMenuOpen(false);
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

  return (
    <div className="bg-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <h1 className="text-[20px] font-bold text-[#0A1F44]">IT Service Pro</h1>
      </Link>

      {/* Hamburger Icon (Mobile) */}
      <div className="lg:hidden flex flex-row items-center gap-4">
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
      <div className="hidden lg:flex space-x-6 font-medium text-[#0A1F44] items-center">
        <Link to="/">Home</Link>
        {user?.role === 'admin' || user?.role === 'super admin' ? (
          <Link to="/app/users">Wishlist</Link>
        ) : null}
        <Link to="/app/quotes">Cart</Link>
        <Link to="/app/profile">Profile</Link>
        <div className="flex flex-row items-center gap-2 ml-4 relative profile-dropdown">
          <div className="relative">
            <img
              src={accountprofile}
              alt="profile"
              className="w-8 h-8 rounded-full border cursor-pointer"
              onClick={() => setProfileMenuOpen((open) => !open)}
            />
            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute top-10 right-[-90px] mt-2 w-44 bg-white border border-solid border-gray-300 rounded shadow-lg z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-solid border-gray-300">
                  <span className="font-semibold block">{user?.name || 'User'}</span>
                  <span className="text-gray-500 text-xs capitalize">{user?.role}</span>
                </div>
                <Link to="/app/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Dashboard</Link>
                <Link to="/app/profile" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Profile</Link>
                {(user?.role === 'admin' || user?.role === 'super admin') && (
                  <Link to="/app/allusers" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Users</Link>
                )}
                <Link to="/app/quote" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Quotes</Link>
                <button
                  onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >Logout</button>
              </div>
            )}
          </div>
          <div className="flex flex-col text-xs cursor-pointer" onClick={() => setProfileMenuOpen((open) => !open)}>
            <span className="font-semibold">{user?.name || 'User'}</span>
            <span className="text-gray-500 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start pl-0 py-4 z-50 lg:hidden animate-fade-in border-b h-[600px] overflow-y-scroll overflow-x-hidden">
          {/* <Link to="/app/dashboard" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          {(user?.role === 'admin' || user?.role === 'super admin') && (
            <Link to="/app/quote" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Quote Request</Link>
          )}
          <Link to="/app/blogposts" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>All Posts</Link>
          <Link to="/app/addnewpost" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Add New Post</Link>
          <Link to="/app/profile" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Profile</Link>
          <Link to="/app/allusers" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>All Users</Link>
          <Link to="/app/addnewuser" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Add New User</Link>
          <Link to="/app/changeuserpassword" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Change User Password</Link>
          <Link to="/app/products" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>All Products</Link>
          <Link to="/app/addproduct" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Add Product</Link>
          <Link to="/app/productcategories" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Product Categories</Link>
          <Link to="/app/addproductcategory" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Add Product Categories</Link>
          <Link to="/app/userorderdetails" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>My Orders</Link>
          <Link to="/app/adminorderlist" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>All Orders</Link>
          <Link to="/app/mysettings" className="py-2 w-full text-left text-[#0A1F44] font-medium hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Settings</Link> */}
          <Sidenav>
            <Sidenav.Body>
                <Nav activeKey={activeKey}>
                    {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="1" icon={<DashboardIcon />} as={Link} to="/app/dashboard">
                        Dashboard
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Item eventKey="2" icon={<GroupIcon />} as={Link} to="/app/quote">
                        Quote Requests
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="3" title="Blog Post" icon={<MagicIcon />}>
                        <Nav.Item eventKey="3-1" as={Link} to="/app/blogposts">All Posts</Nav.Item>
                        <Nav.Item eventKey="3-2" as={Link} to="/app/addnewpost">Add New Post</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="4" icon={<GroupIcon />} as={Link} to="/app/profile">
                        Profile
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="5" title="Users" icon={<MagicIcon />}>
                        <Nav.Item eventKey="5-1" as={Link} to="/app/allusers">All Users</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="/app/addnewuser">Add New User</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="/app/changeuserpassword">Change User Password</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="6" title="Product" icon={<MagicIcon />}>
                        <Nav.Item eventKey="6-1" as={Link} to="/app/products">All Products</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="/app/addproduct">Add Products</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="/app/productcategories">Product Categories</Nav.Item>
                        <Nav.Item eventKey="5-2" as={Link} to="/app/addproductcategory">Add Product Category</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isUser || isCustomer) && (
                    <Nav.Item eventKey="7" icon={<GroupIcon />} as={Link} to="/app/userorderdetails">
                        My Order
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Item eventKey="8" icon={<GroupIcon />} as={Link} to="/app/adminorderlist">
                        All Order 
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="9" icon={<GroupIcon />} as={Link} to="/app/mysettings">
                        Settings
                    </Nav.Item>
                    )}
                </Nav>
            </Sidenav.Body>
        </Sidenav>




          <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">Logout</button>
          <div className="flex flex-row items-center gap-2 mt-4">
            <img src={accountprofile} alt="profile" className="w-8 h-8 rounded-full border" />
            <div className="flex flex-col text-xs">
              <span className="font-semibold">{user?.name || 'User'}</span>
              <span className="text-gray-500 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashHeader;