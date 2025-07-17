import CallToAction from "./assets/components/CallToAction"
import CompletedProjects from "./assets/components/CompletedProjects"
import Footer from "./assets/components/Footer"
import Hero from "./assets/components/Hero"
import HowItWorks from "./assets/components/HowItWorks"
import MainHeader from "./assets/components/MainHeader"
import FeaturedProduct from "./assets/components/product/FeaturedProduct"
import RequestQuote from "./assets/components/RequestQuote"
import ServicesSection from "./assets/components/ServicesSection"
import SubscribePopUp from './assets/components/SubscribePopUp'
import TawkToChat from "./assets/components/TawkToChat"
import TopHeader from "./assets/components/TopHeader"
import TrackRecords from "./assets/components/TrackRecords"
import WhyChooseUs from "./assets/components/WhyChooseUs"
import {Helmet} from 'react-helmet'

function Home() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>Home - Marshall Global Ventures</title>
      <meta name="description" content="Marshall Global Ventures offers expert laptop repair, IT solutions, web and mobile development, and more. Trusted, skilled, and always ready to serve your business technology needs." />
    </Helmet>
    <SubscribePopUp />
    <TopHeader />
    <MainHeader />
    <Hero />
    <ServicesSection />
    <CompletedProjects />
    <FeaturedProduct />
    <TrackRecords />
    <CallToAction />
    <HowItWorks />
    <WhyChooseUs />
    <RequestQuote />
    <Footer />
    </>
  )
}

export default Home