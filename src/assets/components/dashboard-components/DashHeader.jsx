import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import accountprofile from '../../images/accountprofile.svg';
import { useUser } from '../../context-api/user-context/UseUser';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import TagIcon from '@rsuite/icons/Tag';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import { Sidenav, Nav } from 'rsuite';
import marshalllogo from '../../images/marshalllogo.png'
import ProjectIcon from '@rsuite/icons/Project';

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
    '/app/quote': '2-1',
    '/app/myassignedquoterequest': '2-2',
    '/app/myquotes': '2-3',
    '/app/products': '3-1',
    '/app/addproduct': '3-2',
    '/app/productcategories': '3-3',
    '/app/addproductcategory': '3-4',
    '/app/adminorderlist': '4',
    '/app/userorderdetails': '5',
    '/app/blogposts': '6-1',
    '/app/addnewpost': '6-2',
    '/app/sendnewsletter': '7-1',
    '/app/allnewsletter': '7-2',
    '/app/Newslettersubscribers': '7-3',
    '/app/allproject': '8-1',
    '/app/createproject': '8-2',
    '/app/allusers': '9-1',
    '/app/addnewuser': '9-2',
    '/app/changeuserpassword': '9-3',
    '/app/shop': '10',
    '/quoterequest': '11',
    '/app/blog': '12',
    '/app/profile': '13',
    '/app/mysettings': '14',
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
    <div className="bg-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50 border-b border-solid border-gray-500">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img src={marshalllogo} alt="logo"  className='w-[150px] h-[40px]'/>
      </Link>

      {/* Hamburger Icon (Mobile) */}
      <div className="lg:hidden flex flex-row items-center gap-4">
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
              <div className="absolute top-10 right-[-150px] mt-2 w-44 bg-white border border-solid border-gray-300 rounded shadow-lg z-50 animate-fade-in">
                <Link to="/app/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Dashboard</Link>
                <Link to="/app/userorderdetails" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>My Orders</Link>
                <Link to="" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>My Quotes</Link>
                <Link to="/app/profile" className="block px-4 py-2 hover:bg-gray-100 text-[#0A1F44]" onClick={() => setProfileMenuOpen(false)}>Profile</Link>                
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
          <Link to="/app/wishlist">Wishlist</Link>
        ) : null}
        <Link to="/app/cart">Cart</Link>
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
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start pl-0 py-0 z-50 lg:hidden animate-fade-in border-b h-[600px] overflow-y-scroll overflow-x-hidden">
          <Sidenav>
            <Sidenav.Body>
                <Nav activeKey={activeKey}>
                    {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="1" icon={<DashboardIcon />} as={Link} to="/app/dashboard">
                        Dashboard
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Item eventKey="2-1" icon={<DetailIcon />} as={Link} to="/app/quote">
                        Quote Requests
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Item eventKey="2-2" icon={<DetailIcon />} as={Link} to={`/app/myassignedquoterequest`}>
                        My Assigned Quote
                    </Nav.Item>
                    )}
                    {(isCustomer || isUser) && (
                    <Nav.Item eventKey="2-3" icon={<DetailIcon />} as={Link} to={`/app/myquotes`}>
                        My Quote Requests
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="3" title="Product" icon={<GridIcon />}>
                        <Nav.Item eventKey="3-1" as={Link} to="/app/products">All Products</Nav.Item>
                        <Nav.Item eventKey="3-2" as={Link} to="/app/addproduct">Add Products</Nav.Item>
                        <Nav.Item eventKey="3-3" as={Link} to="/app/productcategories">Product Categories</Nav.Item>
                        <Nav.Item eventKey="3-4" as={Link} to="/app/addproductcategory">Add Product Category</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Item eventKey="4" icon={<TagIcon />} as={Link} to="/app/adminorderlist">
                        Manage Orders 
                    </Nav.Item>
                    )}
                    {(isUser || isCustomer) && (
                    <Nav.Item eventKey="5" icon={<TagIcon />} as={Link} to="/app/userorderdetails">
                        My Order
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="6" title="Blog Post" icon={<ListIcon />}>
                        <Nav.Item eventKey="6-1" as={Link} to="/app/blogposts">All Posts</Nav.Item>
                        <Nav.Item eventKey="6-2" as={Link} to="/app/addnewpost">Add New Post</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="7" title="Newsletter" icon={<MessageIcon />}>
                        <Nav.Item eventKey="7-1" as={Link} to="/app/sendnewsletter">Send Newsletter</Nav.Item>
                        <Nav.Item eventKey="7-2" as={Link} to="/app/allnewsletter">All Newsletters</Nav.Item>
                        <Nav.Item eventKey="7-3" as={Link} to="/app/Newslettersubscribers">Subscribers</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="8" title="Completed Projects" icon={<ProjectIcon />}>
                        <Nav.Item eventKey="8-1" as={Link} to="/app/allproject">All Projects</Nav.Item>
                        <Nav.Item eventKey="8-2" as={Link} to="/app/createproject">Add New Project</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="9" title="Users" icon={<PeoplesIcon />}>
                        <Nav.Item eventKey="9-1" as={Link} to="/app/allusers">All Users</Nav.Item>
                        <Nav.Item eventKey="9-2" as={Link} to="/app/addnewuser">Add New User</Nav.Item>
                        <Nav.Item eventKey="9-3" as={Link} to="/app/changeuserpassword">Change User Password</Nav.Item>
                    </Nav.Menu>
                    )}
                    {(isUser || isCustomer) && (
                    <Nav.Item eventKey="10" icon={<UserInfoIcon />} as={Link} to="/app/shop">
                        Shop Products
                    </Nav.Item>
                    )}
                    {(isUser || isCustomer) && (
                    <Nav.Item eventKey="11" icon={<UserInfoIcon />} as={Link} to="/quoterequest">
                        Request a New Quote
                    </Nav.Item>
                    )}
                    {(isUser || isCustomer) && (
                    <Nav.Item eventKey="12" icon={<UserInfoIcon />} as={Link} to="/app/blog">
                        Blog Posts
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="13" icon={<UserInfoIcon />} as={Link} to="/app/profile">
                        Profile
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="14" icon={<GearIcon />} as={Link} to="/app/mysettings">
                        Settings
                    </Nav.Item>
                    )}
                </Nav>
            </Sidenav.Body>
          </Sidenav>
          <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">Logout</button>
        </div>
      )}
    </div>
  );
}

export default DashHeader;