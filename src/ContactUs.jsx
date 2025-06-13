import MainHeader from './assets/components/MainHeader'
import TopHeader from './assets/components/TopHeader'
import Footer from './assets/components/Footer'
import ContactInfo from './assets/components/ContactInfo'
import RequestQuote from './assets/components/RequestQuote'
import {Helmet} from 'react-helmet'

function ContactUs() {
  return (
    <>
    <Helmet>
      <title>Contact Us - IT Service Pro</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <ContactInfo />
    <RequestQuote />
    <Footer />
    </>
  )
}

export default ContactUs