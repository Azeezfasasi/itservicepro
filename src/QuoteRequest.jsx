import TopHeader from './assets/components/TopHeader'
import MainHeader from './assets/components/MainHeader'
import RequestQuote from './assets/components/RequestQuote'
import Footer from './assets/components/Footer'
import {Helmet} from 'react-helmet'
import TawkToChat from './assets/components/TawkToChat'

function QuoteRequest() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>Request Quote - Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <RequestQuote />
    <Footer />
    </>
  )
}

export default QuoteRequest