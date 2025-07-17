import TopHeader from './assets/components/TopHeader'
import MainHeader from './assets/components/MainHeader'
import ServicesSection from './assets/components/ServicesSection'
import Footer from './assets/components/Footer'
import RequestQuote from './assets/components/RequestQuote'
import {Helmet} from 'react-helmet'
import TawkToChat from './assets/components/TawkToChat'

function OurServices() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>Our Services - Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <ServicesSection />
    <RequestQuote />
    <Footer />
    </>
  )
}

export default OurServices