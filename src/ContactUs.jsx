import MainHeader from './assets/components/MainHeader'
import TopHeader from './assets/components/TopHeader'
import Footer from './assets/components/Footer'
import ContactInfo from './assets/components/ContactInfo'
import RequestQuote from './assets/components/RequestQuote'
import {Helmet} from 'react-helmet'
import TawkToChat from './assets/components/TawkToChat'

function ContactUs() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>Contact Us - Marshall Global Ventures</title>
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