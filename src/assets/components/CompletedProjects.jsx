import React from 'react';
import { Monitor, Smartphone, Cloud, ShieldCheck, Lightbulb, BarChart2 } from 'lucide-react';
import sense1 from '../images/portfolio/sense1.png';
import chifex1 from '../images/portfolio/chifex1.png';
import resin1 from '../images/portfolio/resin1.png';
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
    ],
    link: '#',
    icon: Monitor,
  },
  {
    id: '2',
    title: 'Chifex Engineering Services Limited',
    category: 'Website Development',
    description: 'Chifex Engineering Services Limited is a multi-disciplinary consortium incorporated in the year 2024 with the Corporate Affairs Commission and is manage by a team of highly experienced professionals, consultants with utmost solution to basic infrastructural needs of the society such as Estate Development, Road Construction and Environmental Management to avoid adverse effect to environment.',
    imageUrl: chifex1,
    images: [
      chifex1,
    ],
    link: '#',
    icon: Smartphone,
  },
  {
    id: '3',
    title: 'Resin By Saidat',
    category: 'Website Development',
    description: 'Resin By Saidat is a trusted provider of premium resin materials, offering an extensive selection of resins for different industries. From durable and versatile construction-grade resins to artistic resins used in creative projects.',
    imageUrl: resin1,
    images: [
      resin1,
    ],
    link: '#',
    icon: Cloud,
  },
];

const CompletedProjects = () => {
  return (
    <section className="py-5 sm:py-5 bg-gray-50 font-inter antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
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
                  <Link to={`/app/projectdetailsgallery/${project.id}`} className="text-xl font-bold leading-tight">{project.title}</Link>
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
