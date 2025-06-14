import { UserProvider } from './assets/context-api/user-context/UserProvider';
import { QuoteProvider } from './assets/context-api/QuoteProvider';
import { Routes, Route } from 'react-router-dom';
import Home from "./Home";
import AboutUs from './AboutUs';
import OurServices from './OurServices';
import QuoteRequest from './QuoteRequest';
import ContactUs from './ContactUs';
import ScrollToTop from './assets/components/ScrollToTop';
import Dashboard from './app/Dashboard';
import Login from './Login';
import Register from './Register';
import ForgetPassword from './ForgetPassword';
import PrivateRoutes from './assets/components/routes/PrivateRoutes';
import 'rsuite/dist/rsuite-no-reset.min.css';
import Quote from './app/Quote';
import { BlogProvider } from './assets/context-api/blog-context/BlogProvider';
import AddNewPost from './app/AddNewPost';
import BlogPosts from './app/BlogPosts';
import EditBlogPost from './app/EditBlogPost';
import Blog from './app/Blog';
import BlogDetails from './app/BlogDetails';
import Profile from './app/Profile';
import AllUsers from './app/AllUsers';
import AddNewUser from './app/AddNewUser';
import { Settings } from 'lucide-react';
import MySettings from './app/MySettings';
import ChangeUserPassword from './app/ChangeUserPassword';

function App() {
  return (
    <>
      <UserProvider>
        <QuoteProvider>
          <BlogProvider>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/ourservices" element={<OurServices />} />
              <Route path="/quoterequest" element={<QuoteRequest />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/app/blog" element={<Blog />} />
              <Route path="/app/blogdetails/:id" element={<BlogDetails />} />

              {/* Private/protected routes */}
              <Route element={<PrivateRoutes />}>
                <Route path="/app/dashboard" element={<Dashboard />} />
                <Route path="/app/quote" element={<Quote />} />
                <Route path="/app/addnewpost" element={<AddNewPost />} />
                <Route path="/app/blogposts" element={<BlogPosts />} />
                <Route path="/app/editblogpost/:id" element={<EditBlogPost />} />
                <Route path="/app/profile" element={<Profile />} />
                <Route path="/app/allusers" element={<AllUsers />} />
                <Route path="/app/addnewuser" element={<AddNewUser />} />
                <Route path="/app/mysettings" element={<MySettings />} />
                <Route path="/app/changeuserpassword" element={<ChangeUserPassword />} />
              </Route>
            </Routes>
          </BlogProvider>
        </QuoteProvider>
      </UserProvider>
    </>
  );
}

export default App;