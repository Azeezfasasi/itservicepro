
function MeetExpert() {
    const experts = [
    {
      id: 1,
      name: 'Victor Obialor',
      title: 'Manager, IT Operations',
      bio: 'Expert in IT operations',
      linkedin: 'https://www.linkedin.com/in/victor-obialor',
      image: 'https://placehold.co/300x350/d0e2ff/ffffff?text=Expert+1',
    },
    {
      id: 2,
      name: 'Abisinuola Layode',
      title: 'Officer, IT Operations',
      bio: 'Expert in IT support and operations',
      image: 'https://placehold.co/300x350/d0e2ff/ffffff?text=Expert+2',
    },
    {
      id: 3,
      name: 'Taofik Ojuolape',
      title: 'Officer, IT Operations',
      bio: 'Expert in Data Analytics and IT support',
      image: 'https://placehold.co/300x350/e0efff/ffffff?text=Expert+3',
    },
    {
      id: 4,
      name: 'Azeez Fasasi',
      title: 'Associate, IT Operations',
      bio: 'Expert in Frontend Development and IT support',
      image: 'https://placehold.co/300x350/e0efff/ffffff?text=Expert+4',
    },
    {
      id: 5,
      name: 'Stewart Peter',
      title: 'Associate, IT Operations',
      bio: 'Expert in AWS and IT support',
      image: 'https://placehold.co/300x350/e0efff/ffffff?text=Expert+5',
    },
    {
      id: 6,
      name: 'Oluwasegun Ayandokun',
      title: 'Associate, IT Operations',
      bio: 'Expert in Hardware Repair and IT Support',
      image: 'https://placehold.co/300x350/e0efff/ffffff?text=Expert+6',
    },
  ];

  return (
    <>
    <div className="min-h-screen bg-white font-inter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Container for the entire section */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Heading and Description */}
        <div className="flex flex-col justify-center gap-8 mb-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-800 leading-tight">
              Meet our Experts
            </h2>
            <p>Skilled. Reliable. Tech-Savvy.</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              At IT Service Pro, we’ve built a team of dedicated IT professionals who are passionate about delivering top-tier technology services — from laptop repairs and office setups to web and mobile development.
            </p>
            <p className="text-gray-600">
              Our team includes certified technicians, developers, and support specialists, all committed to providing fast, friendly, and dependable service. Whether you are troubleshooting a device or building something new, our experts are here to help you every step of the way.
            </p>
          </div>
        </div>

        {/* Bottom Section: Expert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 lg:flex-row justify-center items-end gap-6">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="relative rounded-3xl shadow-xl overflow-hidden w-full max-w-md h-auto transform transition-all duration-300 ease-in-out hover:scale-105"
            >
              <img
                src={expert.image}
                alt={expert.name}
                className="w-full h-full object-cover"
              />
              {/* Name and Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 bg-opacity-90 text-white p-4">
                <h3 className="text-[16px] md:text-[20px] font-semibold">{expert.name}</h3>
                <p className="text-[13px] md:text-[14px]">{expert.bio}</p>
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