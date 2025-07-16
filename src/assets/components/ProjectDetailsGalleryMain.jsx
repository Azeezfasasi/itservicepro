import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, XCircle, Image as ImageIcon } from 'lucide-react';

// Lightbox imports
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Your local image imports
import sense1 from '../images/portfolio/sense1.png';
import sense2 from '../images/portfolio/sense2.png';
import sense3 from '../images/portfolio/sense3.png';
import sense4 from '../images/portfolio/sense4.png';
import sense5 from '../images/portfolio/sense5.png';
import sense6 from '../images/portfolio/sense6.png';
import sense7 from '../images/portfolio/sense7.png';
import chifex1 from '../images/portfolio/chifex1.png';
import chifex2 from '../images/portfolio/chifex2.png';
import chifex3 from '../images/portfolio/chifex3.png';
import chifex4 from '../images/portfolio/chifex4.png';
import chifex5 from '../images/portfolio/chifex5.png';
import chifex6 from '../images/portfolio/chifex6.png';
import resin1 from '../images/portfolio/resin1.png';
import resin2 from '../images/portfolio/resin2.png';
import resin3 from '../images/portfolio/resin3.png';
import resin4 from '../images/portfolio/resin4.png';
import resin5 from '../images/portfolio/resin5.png';
import resin6 from '../images/portfolio/resin6.png';

const mockProjectsData = [
  {
    id: '1',
    title: 'Sense Academy LMS',
    category: 'Website Development',
    description: 'Developed a modern, responsive LMS platform with enhanced user experience and with custom dashboard. This project involved extensive UI/UX research, custom backend development, and integration with various learning tools.',
    technologyUsed: 'React, Node.js, Express.js, MongoDB, Tailwind CSS, Nodemailer',
    clientIndustry: 'Education',
    images: [
      sense1,
      sense2,
      sense3,
      sense4,
      sense5,
      sense6,
      sense7,
    ],
  },
  {
    id: '2',
    title: 'Chifex Engineering Services Limited',
    category: 'Website Development',
    description: 'Chifex Engineering Services Limited is a multi-disciplinary consortium incorporated in the year 2024 with the Corporate Affairs Commission and is manage by a team of highly experienced professionals, consultants with utmost solution to basic infrastructural needs of the society such as Estate Development, Road Construction and Environmental Management to avoid adverse effect to environment.',
    technologyUsed: 'WordPress, Boostrap, Elementor Builder, SMTP, AISEO',
    clientIndustry: 'Engineering & Construction',
    images: [
      chifex1,
      chifex2,
      chifex3,
      chifex4,
      chifex5,
      chifex6,
    ],
  },
  {
    id: '3',
    title: 'Resin By Saidat',
    category: 'Website Development',
    description: 'Resin By Saidat is a trusted provider of premium resin materials, offering an extensive selection of resins for different industries. From durable and versatile construction-grade resins to artistic resins used in creative projects.',
    technologyUsed: 'React, Node.js, Express.js, MongoDB, Tailwind CSS, Nodemailer, Slugify',
    clientIndustry: 'Ecommerce',
    images: [
      resin1,
      resin2,
      resin3,
      resin4,
      resin5,
      resin6,
    ],
  },
];

const ProjectDetailsGalleryMain = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    console.log('ProjectDetailsGalleryMain useEffect triggered.');
    console.log('id from URL params:', id, ' (Type:', typeof id, ')');

    const foundProject = mockProjectsData.find(p => {
      console.log(`Comparing project ID '${p.id}' (Type: ${typeof p.id}) with URL id '${id}' (Type: ${typeof id})`);
      return p.id === id;
    });

    if (foundProject) {
      console.log('Project found:', foundProject.title);
      setProject(foundProject);
      setLoading(false);
    } else {
      console.log('Project NOT found for id:', id);
      setError('Project not found.');
      setLoading(false);
    }
  }, [id]);

  const slides = project?.images ? project.images.map(imgSrc => ({ src: imgSrc })) : [];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-3 text-lg text-gray-700">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 rounded-lg shadow-md m-4">
        <XCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error!</p>
        <p className="text-lg text-center">{error}</p>
        <Link to="/app/projects" className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150">
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Project not found.</p>
        <Link to="/app/projects" className="ml-4 text-blue-600 hover:underline">Back to Projects</Link>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50 font-inter antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
          {/* Corrected Link to go back to /app/projects */}
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
                src={project.images[0]}
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
                  key={index}
                  className={`w-20 h-16 sm:w-24 sm:h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ease-in-out ${
                    index === lightboxIndex && lightboxOpen ? 'border-blue-600 shadow-md transform scale-105' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x60/cccccc/000000?text=Thumb"; }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Additional Project Details (Optional) */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">More About This Project</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Category:</strong> {project.category}</li>
              {/* FIXED: Changed project.technology to project.technologyUsed */}
              <li><strong>Technologies Used:</strong> {project.technologyUsed}</li>
              {/* FIXED: Changed project.clientIndustry to project.clientIndustry */}
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
