import { Routes, Route } from 'react-router-dom';
import Home from "./Home";
import AboutUs from './AboutUs';
import OurServices from './OurServices';
import QuoteRequest from './QuoteRequest';
import ContactUs from './ContactUs';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/ourservices" element={<OurServices />} />
      <Route path="/quoterequest" element={<QuoteRequest />} />
      <Route path="/contactus" element={<ContactUs />} />
    </Routes>
    </>
  )
}

export default App
