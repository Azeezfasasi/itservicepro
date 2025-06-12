import CallToAction from "./assets/components/CallToAction"
import Hero from "./assets/components/Hero"
import HowItWorks from "./assets/components/HowItWorks"
import MainHeader from "./assets/components/MainHeader"
import MeetExpert from "./assets/components/MeetExpert"
import ServicesSection from "./assets/components/ServicesSection"
import TopHeader from "./assets/components/TopHeader"

function Home() {
  return (
    <>
    <TopHeader />
    <MainHeader />
    <Hero />
    <ServicesSection />
    <CallToAction />
    <HowItWorks />
    <MeetExpert />
    </>
  )
}

export default Home