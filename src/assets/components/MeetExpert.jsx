
function MeetExpert() {
    const experts = [
    {
      id: 1,
      name: 'Herry Jackson',
      title: 'CEO HomePro',
      image: 'https://placehold.co/400x500/a0c4ff/ffffff?text=Expert+1',
      main: true, // Indicates this is the larger, main expert card
    },
    {
      id: 2,
      name: 'Herry Jackson',
      title: 'CEO HomePro',
      image: 'https://placehold.co/300x350/d0e2ff/ffffff?text=Expert+2',
      main: false,
    },
    {
      id: 3,
      name: 'Herry Jackson',
      title: 'CEO HomePro',
      image: 'https://placehold.co/300x350/e0efff/ffffff?text=Expert+3',
      main: false,
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
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Meet our Experts
            </h2>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-gray-600 mb-4">
              At HomePro, we have assembled a team of dedicated professionals
              who are passionate about smart home technology and providing
              exceptional repair and service.
            </p>
            <p className="text-gray-600">
              Our team consists of highly skilled technicians and customer service
              representatives, all committed to ensuring that your smart home
              operates seamlessly. Get to know the individuals who make our team
              exceptional!
            </p>
          </div>
        </div>

        {/* Bottom Section: Expert Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-end gap-6">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="relative rounded-3xl shadow-xl overflow-hidden 
                expert.main
                  w-full max-w-md h-auto lg:w-1/3 transform 
              } transition-all duration-300 ease-in-out hover:scale-105}"
            >
              <img
                src={expert.image}
                alt={expert.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x500/cccccc/333333?text=Image+Error"; }}
              />
              {/* Name and Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-90 text-white p-4">
                <h3 className="text-xl font-semibold">{expert.name}</h3>
                <p className="text-sm">{expert.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

export default MeetExpert