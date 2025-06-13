import React from 'react'

function OurMission() {
  return (
    <>
    <div className="min-h-screen bg-white font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container for the entire section */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Main Mission Statement */}
        <div className="mb-12 flex flex-col justify-start items-center mx-auto">
          <p className="text-gray-600 uppercase tracking-wide text-[14px] lg:text-[20px] font-semibold mb-4 text-center lg:text-center">Our Mission</p>
          <h1 className="text-[25px] md:text-[40px] lg:text-[50px] font-bold text-gray-800 leading-tight text-center lg:text-center max-w-4xl mx-auto lg:mx-0">
            Our mission is simple: to enhance the functionality and convenience of your smart home through exceptional repair and service.
          </h1>
        </div>

        {/* Bottom Section: Image and Detailed Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Image */}
          <div className="w-full h-96 sm:h-[500px] lg:h-[600px] flex justify-center items-center">
            {/* Main image with rounded corners and shadow */}
            {/* Using a placeholder as the exact image isn't available */}
            <img
              src="https://placehold.co/600x400/a0c4ff/ffffff?text=Smart+Home+Control"
              alt="Woman interacting with smart home device"
              className="rounded-3xl shadow-xl object-cover w-full h-full"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/cccccc/333333?text=Image+Error"; }}
            />
          </div>

          {/* Right Side: Detailed Description */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Our mission is simple: to enhance the functionality and convenience of your smart home through
              exceptional repair and service. We understand that your smart home is more than just a collection
              of devices – it's a reflection of your lifestyle and a cornerstone of your daily routines. Our goal is to
              ensure that your smart home operates seamlessly, allowing you to enjoy the benefits of automation
              and connectivity without any interruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default OurMission