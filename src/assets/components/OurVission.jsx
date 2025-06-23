import aboutimage2 from '../images/aboutimage2.png'

function OurVission() {
  return (
    <>
    <div className="min-h-screen bg-white font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container for the entire section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section: Vision Statement and Description */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <p className="text-gray-600 uppercase tracking-wide text-[18px] mb-4 font-semibold">Our Vision</p>
          <h1 className="text-[25px] sm:text-[30px] lg:text-[30px] font-bold text-gray-800 leading-tight mb-6">
            At IT Service Pro, our vision is to redefine the standard of IT support and digital services by delivering innovative, customer-focused solutions that keep pace with an ever-evolving tech landscape.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            We are committed to staying at the forefront of technology — from hardware repairs to web and app development — while ensuring every client experience is marked by reliability, excellence, and trust.
            <br />
            Our goal? To become a go-to tech partner for individuals, businesses, and organizations seeking smart, scalable, and future-ready solutions.
          </p>
        </div>

        {/* Right Section: Image */}
        <div className="w-full flex justify-center items-center">
          <img
            src={aboutimage2}
            alt="About Image 2"
            className="rounded-3xl shadow-xl object-fill w-full h-[300px] md:h-[400px]"
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default OurVission