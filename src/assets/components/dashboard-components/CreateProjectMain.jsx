import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { X, UploadCloud, Monitor, Smartphone, Cloud, ShieldCheck, Lightbulb, BarChart2, Code, Database, Server, Settings, Users, Layers, Globe, Image as ImageIcon, Undo2 } from 'lucide-react'; 
import { Link } from 'react-router-dom';

// Import all Lucide icons that you might use for project categories/types
// This object maps string names (from your backend) to the actual React components
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


const CreateProjectMain = () => {
  const queryClient = useQueryClient(); // Get query client to invalidate queries

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [technologyUsed, setTechnologyUsed] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');
  const [link, setLink] = useState('');
  const [icon, setIcon] = useState(''); // Stores the string name of the icon
  const [selectedFiles, setSelectedFiles] = useState([]); // Stores File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Stores URL.createObjectURL for previews

  const fileInputRef = useRef(null); // Ref for file input to clear it

  // Mutation for creating a project
  const createProjectMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_BASE_URL}/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          // Assuming you have an auth token in localStorage or context
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']); // Invalidate projects list to refetch
      // Reset form on success
      setTitle('');
      setCategory('');
      setDescription('');
      setTechnologyUsed('');
      setClientIndustry('');
      setLink('');
      setIcon('');
      setSelectedFiles([]);
      setImagePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
      }
      alert('Project created successfully!'); // Use a custom modal in production
    },
    onError: (error) => {
      console.error('Error creating project:', error.response?.data || error.message);
      alert(`Failed to create project: ${error.response?.data?.message || error.message}`); // Use a custom modal
    },
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => {
      URL.revokeObjectURL(prevPreviews[indexToRemove]); // Clean up URL object
      return prevPreviews.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert('Please upload at least one image for the project.'); // Use a custom modal
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('technologyUsed', technologyUsed);
    formData.append('clientIndustry', clientIndustry);
    formData.append('link', link);
    formData.append('icon', icon); // Append the string name of the icon

    selectedFiles.forEach((file) => {
      formData.append('images', file); // 'images' must match the field name in upload.array() in backend
    });

    createProjectMutation.mutate(formData);
  };

  return (
    <>
      <section className="py-8 sm:py-12 bg-gray-50 font-inter antialiased">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
            <Link to="/app/allproject" className=''>
              <div className='flex flex-row justify-start items-center gap-2 text-blue-800 font-semibold'><Undo2 /> Back to Projects</div>
            </Link>
            <h2 className="text-[18px] sm:text-[24px] font-extrabold text-gray-900 mb-6 text-center mt-2">
              Create New Project
            </h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              Fill in the details below to add a new completed project to your portfolio.
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
                  disabled={createProjectMutation.isLoading}
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={createProjectMutation.isLoading} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
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
                  disabled={createProjectMutation.isLoading}
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
                  disabled={createProjectMutation.isLoading}
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
                  disabled={createProjectMutation.isLoading}
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
                  disabled={createProjectMutation.isLoading}
                />
              </div>

              {/* Icon (Lucide Icon Name) */}
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Name (e.g., Monitor, Smartphone) <span className="text-red-500">*</span>
                </label>
                <select name="icon" id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={createProjectMutation.isLoading}>
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Images <span className="text-red-500">*</span> (Max 10)
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => !createProjectMutation.isLoading && fileInputRef.current.click()}
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
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          accept="image/*"
                          disabled={createProjectMutation.isLoading || selectedFiles.length >= 10}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 10MB each</p>
                  </div>
                </div>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-full h-24 rounded-md overflow-hidden shadow-md group">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          disabled={createProjectMutation.isLoading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {imagePreviews.length === 0 && (
                    <div className="mt-4 text-center text-gray-500 text-sm">
                        <ImageIcon className="inline-block w-5 h-5 mr-1" /> No images selected.
                    </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150 flex items-center justify-center"
                disabled={createProjectMutation.isLoading}
              >
                {createProjectMutation.isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Creating Project...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateProjectMain;
