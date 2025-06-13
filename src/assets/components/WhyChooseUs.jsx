

function WhyChooseUs() {
    const features = [
    {
      id: 1,
      icon: (
        // Home icon
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      title: 'Tech Experts You Can Trust',
      description: 'Our team is made up of certified professionals with deep knowledge in laptop repairs, IT infrastructure, and digital development — delivering smart, effective solutions every time.',
      primary: false,
    },
    {
      id: 2,
      icon: (
        // Wrench icon
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wrench">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77Z"/>
          <path d="M15 9l4 4"/>
        </svg>
      ),
      title: 'Highly Skilled Technicians',
      description: 'With hands-on experience and continuous training, our technicians are equipped to handle everything from routine maintenance to complex installations — fast, clean, and right the first time.',
      primary: false,
    },
    {
      id: 3,
      icon: (
        // Rocket icon
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74.5 5 2c1.26-1.5 1.26-2 2-2s-.74-3.5-2-5c-1.26 1.5-2 1.5-2 2z"/>
          <path d="M10.95 9.45l-3.9 3.9c-.38.38-.38 1 0 1.38l1.38 1.38c.38.38 1 .38 1.38 0l3.9-3.9"/>
          <path d="M15 15l2 2"/>
          <path d="M18 18l2 2"/>
          <path d="M21 21l3 3"/>
          <path d="M12 12l-2-2"/>
          <path d="M8 8l-2-2"/>
          <path d="M4 4l-2-2"/>
          <path d="M16 8l2 2"/>
          <path d="M20 12l2 2"/>
          <path d="M24 16l3 3"/>
        </svg>
      ),
      title: 'Energy-Efficient Solutions',
      description: 'We don’t just fix and install — we help you optimize. Our services are designed to improve system performance and reduce unnecessary energy consumption, especially in office environments.',
      primary: false,
    },
    {
      id: 4,
      icon: (
        // Headphones icon
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headphones">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
        </svg>
      ),
      title: 'Reliable Maintenance & Support',
      description: 'Enjoy peace of mind with our ongoing support and professional maintenance plans. We are here when you need us — no delays, no hassle',
      primary: false,
    },
  ];

  return (
    <>
    <div className="min-h-screen bg-white font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container for the entire section */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Heading and Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="text-center lg:text-left">
            <h1 className="text-[25px] md:text-[40px] lg:text-[50px] font-bold text-gray-800 leading-tight">
              Why Choose IT Service Pro?
            </h1>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-[18px] font-semibold">Trusted. Skilled. Always Ready.</p>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Experience true peace of mind with our cutting-edge tech solutions, expert technicians, and outstanding customer support. Here’s why IT Service Pro is the smart choice for all your IT needs:
            </p>
          </div>
        </div>

        {/* Bottom Section: Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-3xl shadow-lg p-8 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:scale-105 bg-gray-100 hover:bg-blue-500 text-black hover:text-white"
            >
              <div className={`p-4 rounded-full mb-4 ${feature.primary ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default WhyChooseUs