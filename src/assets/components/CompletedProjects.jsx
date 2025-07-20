import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api'; // Adjust path as needed
import { FaSpinner, FaTimesCircle } from 'react-icons/fa'; // Import FaSpinner
import { 
  UploadCloud, Monitor, Smartphone, Cloud, ShieldCheck, Lightbulb, BarChart2, 
  Code, Database, Server, Settings, Users, Layers, Globe, Image as ImageIcon // Added ImageIcon for no projects found state
} from 'lucide-react';

// Map icon names from backend to Lucide React components
const LucideIcons = {
  Monitor: Monitor,
  Smartphone: Smartphone,
  Cloud: Cloud,
  ShieldCheck: ShieldCheck,
  Lightbulb: Lightbulb,
  BarChart2: BarChart2,
  Code: Code,
  Database: Database,
  Server: Server,
  Settings: Settings,
  Users: Users,
  Globe: Globe,
  Layers: Layers
};

const CompletedProjects = () => {
  // Use useQuery to fetch projects
  // Destructure the data object returned by the backend
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projects'], // Unique key for this query
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/projects`);
      return response.data; // This will be { projects: [...], currentPage: ..., totalPages: ... }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
  });

  // Access the projects array from the data object
  const projects = data?.projects || [];

  if (isLoading) {
    return (
      <section className="py-5 sm:py-5 bg-gray-50 font-inter antialiased flex items-center justify-center min-h-[50vh]">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" /> {/* FaSpinner added */}
        <p className="ml-3 text-lg text-gray-700">Loading projects...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-5 sm:py-5 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[50vh] text-red-600">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error loading projects!</p>
        <p className="text-lg text-center">{error.message || 'Something went wrong.'}</p>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section className="py-5 sm:py-5 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[50vh] text-gray-600">
        <ImageIcon className="w-12 h-12 text-gray-500 mb-4" /> {/* Added ImageIcon */}
        <p className="text-xl font-semibold">No projects found.</p>
        <p className="text-lg text-center mt-2">Check back later for new additions!</p>
      </section>
    );
  }

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
          {projects.map((project) => {
            // Get the corresponding Lucide icon component
            const IconComponent = LucideIcons[project.icon];
            return (
              <div
                key={project._id} // Use project._id from MongoDB
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                  <img
                    src={project.images[0]?.url || "https://placehold.co/600x400/cccccc/000000?text=No+Image"} // Use first image URL from backend
                    alt={project.title}
                    className="w-full h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/000000?text=Image+Unavailable"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center text-sm font-medium bg-blue-600 px-3 py-1 rounded-full w-fit mb-2 shadow-md">
                      {IconComponent && React.createElement(IconComponent, { className: "w-4 h-4 mr-2" })}
                      {project.category}
                    </div>
                    <Link to={`/app/projectdetailsgallery/${project._id}`} className="text-xl font-bold leading-tight">{project.title}</Link>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 text-base mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <Link
                    to={`/app/projectdetailsgallery/${project._id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                  >
                    View Project
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompletedProjects;
