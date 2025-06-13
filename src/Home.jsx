import CallToAction from "./assets/components/CallToAction"
import Hero from "./assets/components/Hero"
import HowItWorks from "./assets/components/HowItWorks"
import MainHeader from "./assets/components/MainHeader"
import MeetExpert from "./assets/components/MeetExpert"
import OurMission from "./assets/components/OurMission"
import OurVission from "./assets/components/OurVission"
import RequestQuote from "./assets/components/RequestQuote"
import ServicesSection from "./assets/components/ServicesSection"
import TopHeader from "./assets/components/TopHeader"
import TrackRecords from "./assets/components/TrackRecords"
import WhyChooseUs from "./assets/components/WhyChooseUs"

function Home() {
  return (
    <>
    <TopHeader />
    <MainHeader />
    <Hero />
    <ServicesSection />
    <TrackRecords />
    <CallToAction />
    <HowItWorks />
    <WhyChooseUs />
    <RequestQuote />
    </>
  )
}

export default Home