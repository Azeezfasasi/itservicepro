import React from 'react';
import { Monitor, Smartphone, Cloud, ShieldCheck, Lightbulb, BarChart2 } from 'lucide-react';
import sense1 from '../images/portfolio/sense1.png'; // Assuming this path is correct
import { Link } from 'react-router-dom';

// Mock data for recently completed projects
const projects = [
  {
    id: '1',
    title: 'Sense Academy LMS',
    category: 'Website Development',
    description: 'Developed a modern, responsive LMS platform with enhanced user experience and with custom dashboard',
    imageUrl: sense1,
    images: [
      sense1,
      'https://placehold.co/1200x800/A0C8D0/000000?text=LMS+Login', 
      'https://placehold.co/1200x800/90B8C0/000000?text=LMS+Dashboard',
    ],
    link: '#',
    icon: Monitor,
  },
//   {
//     id: '2', // <--- CHANGED: ID is now a string
//     title: 'Fitness Tracker Mobile App',
//     category: 'Mobile App Development',
//     description: 'Built an intuitive cross-platform mobile application for tracking fitness activities, integrated with wearable devices and social sharing features.',
//     imageUrl: 'https://placehold.co/600x400/F0F9FF/000000?text=Mobile+App',
//     images: [ // <--- Ensure all projects have an images array
//       'https://placehold.co/1200x800/F0F9FF/000000?text=Mobile+App+Home',
//       'https://placehold.co/1200x800/E0F0F7/000000?text=Activity+Log',
//       'https://placehold.co/1200x800/D0E0F0/000000?text=Profile+Screen',
//     ],
//     link: '#',
//     icon: Smartphone,
//   },
//   {
//     id: '3', // <--- CHANGED: ID is now a string
//     title: 'Cloud Infrastructure Migration',
//     category: 'Cloud Solutions',
//     description: 'Successfully migrated legacy on-premise infrastructure to a scalable and secure cloud environment (AWS/Azure), resulting in 30% cost savings and improved performance.',
//     imageUrl: 'https://placehold.co/600x400/E5F7E0/000000?text=Cloud+Migration',
//     images: [ // <--- Ensure all projects have an images array
//       'https://placehold.co/1200x800/E5F7E0/000000?text=Cloud+Architecture',
//       'https://placehold.co/1200x800/D5F0D0/000000?text=Migration+Process',
//     ],
//     link: '#',
//     icon: Cloud,
//   },
];

const CompletedProjects = () => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50 font-inter antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Our <span className="text-blue-600">Recently Completed</span> Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Showcasing our expertise across various IT domains, delivering innovative, reliable, and impactful solutions that drive client success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/000000?text=Image+Unavailable"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center text-sm font-medium bg-blue-600 px-3 py-1 rounded-full w-fit mb-2 shadow-md">
                    {project.icon && React.createElement(project.icon, { className: "w-4 h-4 mr-2" })}
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{project.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 text-base mb-4 line-clamp-3">
                  {project.description}
                </p>
                {/* Corrected Link usage */}
                <Link
                  to={`/app/projectdetailsgallery/${project.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                >
                  View Project
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompletedProjects;
