import { Sidenav, Nav } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import { useUser } from '../../context-api/user-context/UseUser';

function DashMenu() {
    const {isSuperAdmin, isAdmin, isUser, isCustomer} = useUser()
    const location = useLocation();

    // Map route paths to eventKeys
  const menuKeyByPath = {
    '/app/dashboard': '1',
    '/app/quote': '2',
    '/app/addnewpost': '3-1',
    '/app/blogposts': '3-2',
    '/app/profile': '4',
    '/app/allusers': '5-1',
    '/app/addnewuser': '5-2',
    '/app/changeuserpassword': '5-3',
    '/app/mysettings': '6',
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
                    <Nav.Item eventKey="2" icon={<GroupIcon />} as={Link} to="/app/quote">
                        Quote Requests
                    </Nav.Item>
                    )}
                    {(isSuperAdmin || isAdmin) && (
                    <Nav.Menu eventKey="3" title="Blog Post" icon={<MagicIcon />}>
                        <Nav.Item eventKey="3-1" as={Link} to="/app/addnewpost">Add New Post</Nav.Item>
                        <Nav.Item eventKey="3-2" as={Link} to="/app/blogposts">All Posts</Nav.Item>
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
                    {(isSuperAdmin || isAdmin || isUser || isCustomer) && (
                    <Nav.Item eventKey="6" icon={<GroupIcon />} as={Link} to="/app/mysettings">
                        Settings
                    </Nav.Item>
                    )}
                </Nav>
            </Sidenav.Body>
        </Sidenav>
    </div>
    </>
  )
}

export default DashMenu