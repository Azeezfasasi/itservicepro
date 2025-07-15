import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, XCircle, Image as ImageIcon } from 'lucide-react';
import sense1 from '../images/portfolio/sense1.png'
import sense2 from '../images/portfolio/sense2.png'
import sense3 from '../images/portfolio/sense3.png'
import sense4 from '../images/portfolio/sense4.png'
import sense5 from '../images/portfolio/sense5.png'
import sense6 from '../images/portfolio/sense6.png'
import sense7 from '../images/portfolio/sense7.png'

const mockProjectsData = [
  {
    id: '1', // Ensure this is a string '1'
    title: 'Sense Academy LMS',
    category: 'Website Development',
    description: 'Developed a modern, responsive LMS platform with enhanced user experience and with custom dashboard. This project involved extensive UI/UX research, custom backend development, and integration with various learning tools.',
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
  // {
  //   id: '2', // Ensure this is a string '2'
  //   title: 'Fitness Tracker Mobile App',
  //   category: 'Mobile App Development',
  //   description: 'Built an intuitive cross-platform mobile application for tracking fitness activities, integrated with wearable devices and social sharing features. Focused on clean design, real-time data synchronization, and user engagement.',
  //   images: [
  //     'https://placehold.co/1200x800/F0F9FF/000000?text=Mobile+App+Home',
  //     'https://placehold.co/1200x800/E0F0F7/000000?text=Activity+Log',
  //     'https://placehold.co/1200x800/D0E0F0/000000?text=Profile+Screen',
  //     'https://placehold.co/1200x800/C0D0E0/000000?text=Map+Tracking',
  //   ],
  // },
  // {
  //   id: '3', // Ensure this is a string '3'
  //   title: 'Cloud Infrastructure Migration',
  //   category: 'Cloud Solutions',
  //   description: 'Successfully migrated legacy on-premise infrastructure to a scalable and secure cloud environment (AWS/Azure), resulting in 30% cost savings and improved performance. This involved re-architecting applications for cloud-native deployment.',
  //   images: [
  //     'https://placehold.co/1200x800/E5F7E0/000000?text=Cloud+Architecture',
  //     'https://placehold.co/1200x800/D5F0D0/000000?text=Migration+Process',
  //     'https://placehold.co/1200x800/C5E8C0/000000?text=Cost+Optimization',
  //   ],
  // },
  // {
  //   id: '4', // Ensure this is a string '4'
  //   title: 'Enterprise Cybersecurity Audit',
  //   category: 'Cybersecurity',
  //   description: 'Conducted a comprehensive cybersecurity audit for a large enterprise, identifying vulnerabilities and implementing robust security protocols and employee training programs. Enhanced overall security posture and compliance.',
  //   images: [
  //     'https://placehold.co/1200x800/FFFBE0/000000?text=Security+Dashboard',
  //     'https://placehold.co/1200x800/F7F0D0/000000?text=Vulnerability+Scan',
  //     'https://placehold.co/1200x800/EFE0C0/000000?text=Compliance+Report',
  //   ],
  // },
  // {
  //   id: '5', // Ensure this is a string '5'
  //   title: 'Custom CRM System Development',
  //   category: 'IT Services',
  //   description: 'Designed and developed a tailored CRM solution to streamline client management, sales pipelines, and customer support for a growing mid-sized business. Features include lead tracking, customer history, and automated workflows.',
  //   images: [
  //     'https://placehold.co/1200x800/F0E0F7/000000?text=CRM+Dashboard',
  //     'https://placehold.co/1200x800/E0D0F0/000000?text=Client+Profile',
  //     'https://placehold.co/1200x800/D0C0E0/000000?text=Sales+Pipeline',
  //   ],
  // },
  // {
  //   id: '6', // Ensure this is a string '6'
  //   title: 'Advanced Data Analytics Dashboard',
  //   category: 'Data Analytics',
  //   description: 'Created an interactive data dashboard using advanced analytics tools to visualize key business metrics, enabling data-driven decision-making and strategic planning. Provided actionable insights from complex datasets.',
  //   images: [
  //     'https://placehold.co/1200x800/E0F7F7/000000?text=Analytics+Dashboard+1',
  //     'https://placehold.co/1200x800/D0F0F0/000000?text=Analytics+Dashboard+2',
  //   ],
  // },
];

// Renamed component to match the route's expectation OR update the route
const ProjectDetailsGalleryMain = () => { // Keep this name if App.js imports ProjectDetailsGalleryMain
  const { id } = useParams(); // <--- CHANGED: Destructure 'id' to match route parameter
  const [project, setProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ProjectDetailsGalleryMain useEffect triggered.');
    console.log('id from URL params:', id, ' (Type:', typeof id, ')'); // Log 'id' now

    const foundProject = mockProjectsData.find(p => {
      console.log(`Comparing project ID '${p.id}' (Type: ${typeof p.id}) with URL id '${id}' (Type: ${typeof id})`);
      return p.id === id; // <--- CHANGED: Compare with 'id'
    });

    if (foundProject) {
      console.log('Project found:', foundProject.title);
      setProject(foundProject);
      setLoading(false);
      setCurrentImageIndex(0); // Reset index when project changes
    } else {
      console.log('Project NOT found for id:', id); // Log 'id' now
      setError('Project not found.');
      setLoading(false);
    }
  }, [id]); // Depend on 'id' now

  const handlePrevImage = () => {
    if (project && project.images && project.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex === 0 ? project.images.length - 1 : prevIndex - 1)
      );
    }
  };

  const handleNextImage = () => {
    if (project && project.images && project.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex === project.images.length - 1 ? 0 : prevIndex + 1)
      );
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
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
          {/* <Link to="/app/projects" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 mb-6">
            <ChevronLeft className="w-5 h-5 mr-2" /> Back to All Projects
          </Link> */}

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 border-b-2 border-blue-100 pb-3">
            {project.title}
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {project.description}
          </p>

          {project.images && project.images.length > 0 ? (
            <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg mb-6">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x800/cccccc/000000?text=Image+Load+Error"; }}
              />

              {project.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
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
                    index === currentImageIndex ? 'border-blue-600 shadow-md transform scale-105' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => handleThumbnailClick(index)}
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

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">More About This Project</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Category:</strong> {project.category}</li>
              <li><strong>Technologies Used:</strong> React, Node.js, MongoDB, Tailwind CSS, Nodemailer</li>
              <li><strong>Client Industry:</strong> Education</li>
              <li><strong>Outcome:</strong> Improved user engagement, reduced operational costs, scalable solution.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetailsGalleryMain;
