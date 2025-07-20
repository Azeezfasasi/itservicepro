import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { X, UploadCloud, Monitor, Smartphone, Cloud, ShieldCheck, Lightbulb, BarChart2, Code, Database, Server, Settings, Users, Undo2, Layers, Globe, Image as ImageIcon } from 'lucide-react'; 

// Import all Lucide icons that you might use for project categories/types
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

const UpdateProjectMain = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [technologyUsed, setTechnologyUsed] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');
  const [link, setLink] = useState('');
  const [icon, setIcon] = useState('');

  // Image states
  const [existingImages, setExistingImages] = useState([]); // Array of { url, public_id }
  const [newlySelectedFiles, setNewlySelectedFiles] = useState([]); // Array of File objects for new uploads
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Array of URL.createObjectURL for new previews

  const fileInputRef = useRef(null);

  // 1. Query to fetch existing project data
  const { 
    data: projectData, 
    isLoading: isProjectLoading, 
    isError: isProjectError, 
    error: projectError 
  } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID is missing for update.');
      const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run if ID is available
    staleTime: 0, // Always refetch when component mounts for update
    cacheTime: 0, // Don't keep stale data for long for update forms
  });

  // 2. Effect to populate form fields when projectData is loaded
  useEffect(() => {
    if (projectData) {
      setTitle(projectData.title || '');
      setCategory(projectData.category || '');
      setDescription(projectData.description || '');
      setTechnologyUsed(projectData.technologyUsed || '');
      setClientIndustry(projectData.clientIndustry || '');
      setLink(projectData.link || '');
      setIcon(projectData.icon || '');
      setExistingImages(projectData.images || []); // Set existing images
      setNewlySelectedFiles([]); // Clear any previous new selections
      setNewImagePreviews([]); // Clear any previous new previews
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
      }
    }
  }, [projectData]);

  // 3. Mutation for updating the project
  const updateProjectMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(`${API_BASE_URL}/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']); // Invalidate all projects list
      queryClient.invalidateQueries(['project', id]); // Invalidate specific project details
      alert('Project updated successfully!'); // Replace with custom modal
      navigate('/app/allprojects'); // Redirect to projects list or details page
    },
    onError: (error) => {
      console.error('Error updating project:', error.response?.data || error.message);
      alert(`Failed to update project: ${error.response?.data?.message || error.message}`); // Replace with custom modal
    },
  });

  // Handlers for new image uploads
  const handleNewFileChange = (event) => {
    const files = Array.from(event.target.files);
    setNewlySelectedFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeNewImage = (indexToRemove) => {
    setNewlySelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setNewImagePreviews(prevPreviews => {
      URL.revokeObjectURL(prevPreviews[indexToRemove]); 
      return prevPreviews.filter((_, index) => index !== indexToRemove);
    });
  };

  // Handlers for existing images
  const removeExistingImage = (publicIdToRemove) => {
    setExistingImages(prevImages => prevImages.filter(img => img.public_id !== publicIdToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine all images (existing ones to keep, and newly uploaded ones)
    const allImagesToKeep = existingImages.map(img => img.public_id);
    
    // Basic validation: Ensure at least one image will be present after update
    if (allImagesToKeep.length === 0 && newlySelectedFiles.length === 0) {
      alert('A project must have at least one image. Please upload new images or ensure existing ones are not all removed.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('technologyUsed', technologyUsed);
    formData.append('clientIndustry', clientIndustry);
    formData.append('link', link);
    formData.append('icon', icon);
    
    // Send public IDs of existing images that should be KEPT
    formData.append('existingImagePublicIds', JSON.stringify(allImagesToKeep));

    // Append newly selected files under 'newImages' field name (matches backend route)
    newlySelectedFiles.forEach((file) => {
      formData.append('newImages', file); 
    });

    updateProjectMutation.mutate(formData);
  };

  // Loading and Error states for fetching the project
  if (isProjectLoading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex items-center justify-center min-h-[calc(100vh-120px)]">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading project data...</p>
      </section>
    );
  }

  if (isProjectError) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-red-600">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error loading project!</p>
        <p className="text-lg text-center">{projectError.message || 'Something went wrong while fetching project details.'}</p>
        <button
          onClick={() => navigate('/admin/projects')}
          className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Back to Projects
        </button>
      </section>
    );
  }

  // If projectData is null/undefined after loading (e.g., 404 not found)
  if (!projectData) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-gray-600">
        <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-xl font-semibold">Project not found.</p>
        <p className="text-lg text-center mt-2">The project you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/admin/projects')}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Back to Projects
        </button>
      </section>
    );
  }

  // Determine if the form is currently submitting or fetching initial data
  const isSubmitting = updateProjectMutation.isLoading;
  const isDisabled = isSubmitting || isProjectLoading; // Disable fields if either is true

  return (
    <>
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
            <Link to="/app/allproject" className=''>
              <div className='flex flex-row justify-start items-center gap-2 text-blue-800 font-semibold'><Undo2 /> Back to Projects</div>
            </Link>
            <h2 className="text-[18px] sm:text-[24px] font-extrabold text-gray-900 mb-6 text-center mt-4">
              Update Project: {projectData.title}
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Modify the details of this project and update its images.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter project title'
                  required
                  disabled={isDisabled}
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isDisabled} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Choose Category</option>
                  <option value="Website Development">Website Development</option>
                  <option value="App Development">App Development</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Laptop Repair">Laptop Repair</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Enter the project description'
                  required
                  disabled={isDisabled}
                ></textarea>
              </div>

              {/* Technology Used */}
              <div>
                <label htmlFor="technologyUsed" className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies Used <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="technologyUsed"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder='Enter the technology/tools used, separate with comma'
                  value={technologyUsed}
                  onChange={(e) => setTechnologyUsed(e.target.value)}
                  required
                  disabled={isDisabled}
                />
              </div>

              {/* Client Industry */}
              <div>
                <label htmlFor="clientIndustry" className="block text-sm font-medium text-gray-700 mb-1">
                  Client Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="clientIndustry"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder='E.g, Education, Ecommerce, Business'
                  value={clientIndustry}
                  onChange={(e) => setClientIndustry(e.target.value)}
                  required
                  disabled={isDisabled}
                />
              </div>

              {/* Link (Optional) */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link (Optional)
                </label>
                <input
                  type="url"
                  id="link"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder='E.g. https://example.com'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={isDisabled}
                />
              </div>

              {/* Icon (Lucide Icon Name) */}
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Name (e.g., Monitor, Smartphone) <span className="text-red-500">*</span>
                </label>
                <select name="icon" id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={isDisabled}>
                  <option value="">Choose Icon</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Cloud">Cloud</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Lightbulb">Lightbulb</option>
                  <option value="BarChart2">BarChart2</option>
                  <option value="Code">Code</option>
                  <option value="Database">Database</option>
                  <option value="Server">Server</option>
                  <option value="Settings">Settings</option>
                  <option value="Users">Users</option>
                  <option value="Globe">Globe</option>
                  <option value="Layers">Layers</option>
                </select>
                {icon && LucideIcons[icon] && (
                  <div className="mt-2 text-blue-600 flex items-center">
                    Preview: {React.createElement(LucideIcons[icon], { className: "w-5 h-5 ml-2" })}
                  </div>
                )}
                {!LucideIcons[icon] && icon && (
                  <p className="text-red-500 text-sm mt-1">Invalid icon name. Please use a valid Lucide icon name.</p>
                )}
              </div>

              {/* Existing Images Display */}
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Existing Images ({existingImages.length})
                  </label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {existingImages.map((img) => (
                      <div key={img.public_id} className="relative w-full h-24 rounded-md overflow-hidden shadow-md group">
                        <img src={img.url} alt="Existing Project Image" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.public_id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          disabled={isDisabled}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload New Images (Max {10 - existingImages.length} more)
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => !isDisabled && newlySelectedFiles.length + existingImages.length < 10 && fileInputRef.current.click()}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleNewFileChange}
                          ref={fileInputRef}
                          accept="image/*"
                          disabled={isDisabled || newlySelectedFiles.length + existingImages.length >= 10}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 10MB each</p>
                  </div>
                </div>
                
                {/* New Image Previews */}
                {newImagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-full h-24 rounded-md overflow-hidden shadow-md group">
                        <img src={preview} alt={`New Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          disabled={isDisabled}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {newImagePreviews.length === 0 && existingImages.length === 0 && (
                    <div className="mt-4 text-center text-gray-500 text-sm">
                        <ImageIcon className="inline-block w-5 h-5 mr-1" /> No images selected.
                    </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 flex items-center justify-center"
                disabled={isDisabled}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Updating Project...
                  </>
                ) : (
                  'Update Project'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateProjectMain;
