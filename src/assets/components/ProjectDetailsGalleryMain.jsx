import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { ChevronLeft, XCircle, Image as ImageIcon, } from 'lucide-react'; // Import FaSpinner for loading

// Lightbox imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Remove all local image imports and mock data
// import sense1 from '../images/portfolio/sense1.png';
// ... (all other local image imports)
// const mockProjectsData = [...];

const ProjectDetailsGalleryMain = () => {
  const { id } = useParams(); // Get the project ID from the URL

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Use useQuery to fetch a single project by ID
  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ['project', id], // Query key includes the ID for unique caching
    queryFn: async () => {
      if (!id) throw new Error('Project ID is missing.'); // Ensure ID exists
      const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if ID is available
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Prepare slides for the lightbox using Cloudinary URLs
  const slides = project?.images ? project.images.map(img => ({ src: img.url })) : [];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {/* <FaSpinner className="animate-spin text-blue-500 text-4xl" /> */}
        <p className="ml-3 text-lg text-gray-700">Loading project details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 rounded-lg shadow-md m-4">
        <XCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error loading project!</p>
        <p className="text-lg text-center">{error.message || 'Something went wrong.'}</p>
        <Link to="/recentproject" className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150">
          Back to Projects
        </Link>
      </div>
    );
  }

  // If not loading and no project data (e.g., 404 from API)
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-xl text-gray-700">Project not found.</p>
        <Link to="/recentproject" className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50 font-inter antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
          <Link to="/recentproject" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 mb-6">
            <ChevronLeft className="w-5 h-5 mr-2" /> Back to All Projects
          </Link>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 border-b-2 border-blue-100 pb-3">
            {project.title}
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {project.description}
          </p>

          {project.images && project.images.length > 0 ? (
            <div
              className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg mb-6 cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <img
                src={project.images[0]?.url || "https://placehold.co/1200x800/cccccc/000000?text=No+Image"} // Use first image URL
                alt={`${project.title} - Main Image`}
                className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x800/cccccc/000000?text=Image+Load+Error"; }}
              />
              <div className="absolute inset-0 flex items-center justify-center group-hover:bg-opacity-20 transition-opacity duration-300">
                <span className="text-[38px] text-blue-900 font-bold opacity-0 bg-blue-200 group-hover:opacity-100 transition-opacity duration-300 px-3 py-2 rounded-md">Click to view gallery</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xl mb-6 shadow-inner">
              <ImageIcon className="w-8 h-8 mr-2" /> No images available for this project.
            </div>
          )}

          {project.images && project.images.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {project.images.map((image, index) => (
                <div
                  key={image.public_id || index} // Use public_id as key if available, fallback to index
                  className={`w-20 h-16 sm:w-24 sm:h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ease-in-out ${
                    index === lightboxIndex && lightboxOpen ? 'border-blue-600 shadow-md transform scale-105' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.url} // Use image URL
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x60/cccccc/000000?text=Thumb"; }}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">More About This Project</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Category:</strong> {project.category}</li>
              <li><strong>Technologies Used:</strong> {project.technologyUsed}</li>
              <li><strong>Client Industry:</strong> {project.clientIndustry}</li>
            </ul>
          </div>
        </div>
      </div>

      <Lightbox
        slides={slides}
        open={lightboxOpen}
        index={lightboxIndex}
        close={() => setLightboxOpen(false)}
        on={{ view: update => setLightboxIndex(update.index) }}
      />
    </section>
  );
};

export default ProjectDetailsGalleryMain;
