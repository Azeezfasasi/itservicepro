import React from 'react'

function OurVission() {
  return (
    <>
    <div className="min-h-screen bg-white font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container for the entire section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section: Vision Statement and Description */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <p className="text-gray-600 uppercase tracking-wide text-[14px] mb-4">Our Vision</p>
          <h1 className="text-[25px] sm:text-[40px] lg:text-[50px] font-bold text-gray-800 leading-tight mb-6">
            At HomePro, our vision is to revolutionize the smart home repair and service industry
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            We are committed to being at the forefront of technological advancements, providing innovative solutions, and exceeding
            customer expectations. Here's a closer look at our vision:
          </p>
        </div>

        {/* Right Section: Image */}
        <div className="w-full h-96 sm:h-[500px] lg:h-[600px] flex justify-center items-center">
          {/* Main image with rounded corners and shadow */}
          {/* Using a placeholder as the exact image isn't available */}
          <img
            src="https://placehold.co/600x500/a0c4ff/ffffff?text=Vision+Image"
            alt="Man holding blueprints"
            className="rounded-3xl shadow-xl object-cover w-full h-full"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x500/cccccc/333333?text=Image+Error"; }}
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default OurVission