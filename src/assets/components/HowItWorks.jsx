import heroone from '../images/heroone.jpg'

function HowItWorks() {
  return (
    <>
    <div className="min-h-screen bg-gray-200 font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container for the entire section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section: Image with Badge */}
        <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] flex justify-center items-center">
          {/* Main image with rounded corners and shadow */}
          <img
            src={heroone}
            alt="Professional Worker"
            className="absolute rounded-3xl shadow-xl object-cover w-full h-full"
          />

          {/* Blue checkmark badge */}
          <div className="absolute bottom-4 right-4 bg-blue-500 p-3 rounded-full shadow-lg">
            {/* Check icon (from Lucide React or similar, here using inline SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
          </div>
        </div>

        {/* Right Section: How it works steps */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-8">
            How IT Service Pro <br /> works?
          </h2>

          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start mb-8">
            <div className="flex-shrink-0 mr-4">
              <span className="text-5xl font-bold text-blue-500">1.</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Call us anytime 24/7</h3>
              <p className="text-gray-600">
                You can contact us directly, we will quickly put you in touch with our home care professionals
                who are ready anytime
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start mb-8">
            <div className="flex-shrink-0 mr-4">
              <span className="text-5xl font-bold text-blue-500">2.</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Schedule Service</h3>
              <p className="text-gray-600">
                After connecting your call, our home care experts will answer your questions and provide flexible
                appointment times
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row items-center lg:items-start mb-8">
            <div className="flex-shrink-0 mr-4">
              <span className="text-5xl font-bold text-blue-500">3.</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Your request is completed</h3>
              <p className="text-gray-600">
                Once your technician arrives, he will diagnose the problem and provide an estimate. If you decide
                to continue, the technician will get to work
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default HowItWorks