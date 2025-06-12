import CallToAction from "./assets/components/CallToAction"
import Hero from "./assets/components/Hero"
import HowItWorks from "./assets/components/HowItWorks"
import MainHeader from "./assets/components/MainHeader"
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
    </>
  )
}

export default Home