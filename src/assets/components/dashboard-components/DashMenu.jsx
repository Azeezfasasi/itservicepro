import { Sidenav, Nav } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import TagIcon from '@rsuite/icons/Tag';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import { useUser } from '../../context-api/user-context/UseUser';
import ProjectIcon from '@rsuite/icons/Project';

function DashMenu() {
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
  };
  const activeKey = menuKeyByPath[location.pathname];

  return (
    <>
    <div style={{ width: 240 }} className='hidden lg:block'>
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
                    {/* {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="14" icon={<GearIcon />} as={Link} to="/app/mysettings">
                        Settings
                    </Nav.Item>
                    )} */}
                </Nav>
            </Sidenav.Body>
        </Sidenav>
    </div>
    </>
  )
}

export default DashMenu

