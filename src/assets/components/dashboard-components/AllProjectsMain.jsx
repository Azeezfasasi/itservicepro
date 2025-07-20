// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { API_BASE_URL } from '../../../config/api';
// import { FaSpinner, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
// import { Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
// import { Helmet } from 'react-helmet';

// // Simple Confirmation Modal Component (can be extracted to its own file later)
// const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, isDeleting }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
//         <p className="text-gray-700 mb-6">{message}</p>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onCancel}
//             disabled={isDeleting}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isDeleting}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
//           >
//             {isDeleting ? (
//               <>
//                 <FaSpinner className="animate-spin mr-2" /> Deleting...
//               </>
//             ) : (
//               'Delete'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// const AllProjectsMain = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // State for confirmation modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [projectIdToDelete, setProjectIdToDelete] = useState(null);
//   const [projectTitleToDelete, setProjectTitleToDelete] = useState('');

//   // Query to fetch all projects
//   const {
//     data: projects,
//     isLoading: isProjectsLoading,
//     isError: isProjectsError,
//     error: projectsError,
//     refetch // Allows manual refetching
//   } = useQuery({
//     queryKey: ['projects'],
//     queryFn: async () => {
//       const response = await axios.get(`${API_BASE_URL}/projects`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`, // Auth for admin endpoint
//         },
//       });
//       return response.data;
//     },
//     staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
//     cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
//   });

//   // Mutation for deleting a project
//   const deleteProjectMutation = useMutation({
//     mutationFn: async (projectId) => {
//       await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['projects']); // Invalidate the list to refetch
//       alert('Project deleted successfully!'); // Replace with custom modal
//       setShowDeleteModal(false); // Close modal
//       setProjectIdToDelete(null);
//       setProjectTitleToDelete('');
//     },
//     onError: (error) => {
//       console.error('Error deleting project:', error.response?.data || error.message);
//       alert(`Failed to delete project: ${error.response?.data?.message || error.message}`); // Replace with custom modal
//       setShowDeleteModal(false); // Close modal
//       setProjectIdToDelete(null);
//       setProjectTitleToDelete('');
//     },
//   });

//   // Handler to open the delete confirmation modal
//   const handleDeleteClick = (projectId, projectTitle) => {
//     setProjectIdToDelete(projectId);
//     setProjectTitleToDelete(projectTitle);
//     setShowDeleteModal(true);
//   };

//   // Handler to confirm deletion
//   const confirmDelete = () => {
//     if (projectIdToDelete) {
//       deleteProjectMutation.mutate(projectIdToDelete);
//     }
//   };

//   // Handler to cancel deletion
//   const cancelDelete = () => {
//     setShowDeleteModal(false);
//     setProjectIdToDelete(null);
//     setProjectTitleToDelete('');
//   };


//   // Loading state
//   if (isProjectsLoading) {
//     return (
//       <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex items-center justify-center min-h-[calc(100vh-120px)]">
//         <FaSpinner className="animate-spin text-blue-600 text-4xl" />
//         <p className="ml-3 text-lg text-gray-700">Loading projects...</p>
//       </section>
//     );
//   }

//   // Error state
//   if (isProjectsError) {
//     return (
//       <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-red-600">
//         <FaTimesCircle className="text-5xl mb-4" />
//         <p className="text-xl font-semibold mb-2">Error loading projects!</p>
//         <p className="text-lg text-center">{projectsError.message || 'Something went wrong while fetching projects.'}</p>
//         <button
//           onClick={() => refetch()} // Allow user to retry fetching
//           className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
//         >
//           Retry
//         </button>
//       </section>
//     );
//   }

//   // No projects found state
//   if (!projects || projects.length === 0) {
//     return (
//       <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-gray-600">
//         <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
//         <p className="text-xl font-semibold">No projects found.</p>
//         <p className="text-lg text-center mt-2">Start by creating a new project!</p>
//         <Link
//           to="/admin/projects/create"
//           className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
//         >
//           Create New Project
//         </Link>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
//               Manage Projects
//             </h2>
//             <Link
//               to="/admin/projects/create"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 flex items-center"
//             >
//               <Edit className="w-4 h-4 mr-2" /> Add New Project
//             </Link>
//           </div>

//           <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Industry</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {projects.map((project) => (
//                     <tr key={project._id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {project.images && project.images.length > 0 ? (
//                           <img
//                             src={project.images[0].url}
//                             alt={project.title}
//                             className="h-16 w-16 object-cover rounded-md shadow-sm"
//                             onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/cccccc/000000?text=No+Img"; }}
//                           />
//                         ) : (
//                           <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
//                             No Img
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {project.title}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {project.category}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {project.technologyUsed}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {project.clientIndustry}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <Link
//                             to={`/app/projectdetailsgallery/${project._id}`} // Link to public details page
//                             className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
//                             title="View Details"
//                           >
//                             <Eye className="w-5 h-5" />
//                           </Link>
//                           <Link
//                             to={`/app/updateproject/${project._id}`} // Link to edit page
//                             className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition-colors"
//                             title="Edit Project"
//                           >
//                             <Edit className="w-5 h-5" />
//                           </Link>
//                           <button
//                             onClick={() => handleDeleteClick(project._id, project.title)}
//                             className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
//                             title="Delete Project"
//                             disabled={deleteProjectMutation.isLoading}
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </section>

//       <ConfirmationModal
//         isOpen={showDeleteModal}
//         message={`Are you sure you want to delete the project "${projectTitleToDelete}"? This action cannot be undone.`}
//         onConfirm={confirmDelete}
//         onCancel={cancelDelete}
//         isDeleting={deleteProjectMutation.isLoading}
//       />
//     </>
//   );
// };

// export default AllProjectsMain;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { FaSpinner, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { Edit, Trash2, Eye, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'; // Added ChevronLeft, ChevronRight
import { Helmet } from 'react-helmet';

// Simple Confirmation Modal Component (can be extracted to its own file later)
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Action</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
          >
            {isDeleting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


const AllProjectsMain = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState(10); // You can make this dynamic if needed

  // State for confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [projectTitleToDelete, setProjectTitleToDelete] = useState('');

  // Query to fetch projects with pagination parameters
  const { 
    data: paginationData, // Renamed to paginationData to hold the entire response object
    isLoading: isProjectsLoading, 
    isError: isProjectsError, 
    error: projectsError,
    refetch 
  } = useQuery({
    queryKey: ['projects', currentPage, projectsPerPage], // Query key now includes pagination params
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        params: {
          page: currentPage,
          limit: projectsPerPage,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data; // This will be { projects, currentPage, totalPages, totalProjects }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true, // Keep previous data while fetching new page
  });

  // Destructure data from paginationData
  const projects = paginationData?.projects || [];
  const totalPages = paginationData?.totalPages || 1;
  const totalProjects = paginationData?.totalProjects || 0;

  // Mutation for deleting a project
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId) => {
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate the specific query key for the current page to refetch
      queryClient.invalidateQueries(['projects', currentPage, projectsPerPage]);
      // Also invalidate the general 'projects' key if you have other components
      // that fetch all projects without pagination, to keep them consistent.
      queryClient.invalidateQueries(['projects']); 
      
      alert('Project deleted successfully!'); // Replace with custom modal
      setShowDeleteModal(false);
      setProjectIdToDelete(null);
      setProjectTitleToDelete('');
      // If the last item on a page was deleted, and it's not the first page,
      // navigate to the previous page.
      if (projects.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    },
    onError: (error) => {
      console.error('Error deleting project:', error.response?.data || error.message);
      alert(`Failed to delete project: ${error.response?.data?.message || error.message}`);
      setShowDeleteModal(false);
      setProjectIdToDelete(null);
      setProjectTitleToDelete('');
    },
  });

  // Handlers for pagination
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for display
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Show current page, and a few around it
    const maxPagesToShow = 5; // e.g., 1 ... 4 5 [6] 7 8 ... 10
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((num, index) => (
      num === '...' ? (
        <span key={index} className="px-3 py-1 text-gray-700">...</span>
      ) : (
        <button
          key={num}
          onClick={() => goToPage(num)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            num === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors duration-200`}
          disabled={isProjectsLoading || deleteProjectMutation.isLoading}
        >
          {num}
        </button>
      )
    ));
  };


  // Handler to open the delete confirmation modal
  const handleDeleteClick = (projectId, projectTitle) => {
    setProjectIdToDelete(projectId);
    setProjectTitleToDelete(projectTitle);
    setShowDeleteModal(true);
  };

  // Handler to confirm deletion
  const confirmDelete = () => {
    if (projectIdToDelete) {
      deleteProjectMutation.mutate(projectIdToDelete);
    }
  };

  // Handler to cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectIdToDelete(null);
    setProjectTitleToDelete('');
  };


  // Loading state
  if (isProjectsLoading && !projects.length) { // Only show full loading if no data is present
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex items-center justify-center min-h-[calc(100vh-120px)]">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading projects...</p>
      </section>
    );
  }

  // Error state
  if (isProjectsError) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-red-600">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error loading projects!</p>
        <p className="text-lg text-center">{projectsError.message || 'Something went wrong while fetching projects.'}</p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Retry
        </button>
      </section>
    );
  }

  // No projects found state
  if (!projects || projects.length === 0) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-gray-600">
        <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-xl font-semibold">No projects found.</p>
        <p className="text-lg text-center mt-2">Start by creating a new project!</p>
        <Link
          to="/admin/projects/create"
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Create New Project
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Manage Projects
            </h2>
            <Link
              to="/app/createproject"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" /> Add New Project
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Industry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {project.images && project.images.length > 0 ? (
                          <img
                            src={project.images[0].url}
                            alt={project.title}
                            className="h-16 w-16 object-cover rounded-md shadow-sm"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/cccccc/000000?text=No+Img"; }}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {project.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {project.technologyUsed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {project.clientIndustry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/app/projectdetailsgallery/${project._id}`}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/app/updateproject/${project._id}`}
                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(project._id, project.title)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                            title="Delete Project"
                            disabled={deleteProjectMutation.isLoading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="py-4 px-6 bg-gray-50 flex justify-between items-center border-t border-gray-200">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1 || isProjectsLoading || deleteProjectMutation.isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </button>
                <div className="flex space-x-1">
                  {renderPageNumbers()}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || isProjectsLoading || deleteProjectMutation.isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <ConfirmationModal
        isOpen={showDeleteModal}
        message={`Are you sure you want to delete the project "${projectTitleToDelete}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={deleteProjectMutation.isLoading}
      />
    </>
  );
};

export default AllProjectsMain;
