import aboutimage1 from '../images/aboutimage1.jpg';

function OurMission() {
  return (
    <>
    <div className="min-h-screen bg-white font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container for the entire section */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Main Mission Statement */}
        <div className="mb-0 flex flex-col justify-start items-center mx-auto">
          <p className="text-gray-600 uppercase tracking-wide text-[14px] lg:text-[20px] font-semibold mb-4 text-center lg:text-center">Our Mission</p>
          <h1 className="text-[25px] md:text-[30px] lg:text-[30px] font-bold text-gray-800 leading-tight text-center lg:text-center max-w-4xl mx-auto lg:mx-0">
            At IT Service Pro, our mission is simple: To empower individuals and businesses through reliable, efficient, and expert-driven IT solutions.
          </h1>
        </div>

        {/* Bottom Section: Image and Detailed Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
          {/* Left Side: Image */}
          <div className="w-full flex justify-center items-center">
            <img
              src={aboutimage1}
              alt="About Image"
              className="rounded-3xl shadow-xl object-fill w-full h-[300px] md:h-[400px]"
            />
          </div>

          {/* Right Side: Detailed Description */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              We believe technology should enhance your productivity, simplify your life, and support your goals — not complicate them. Whether it's repairing laptops, setting up office systems, or building custom websites and apps, we’re committed to keeping your digital world running smoothly.
              <br />
              Your tech is more than just equipment — it's a vital part of how you live and work. Our goal is to make sure it performs at its best, so you can focus on what matters most.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default OurMission