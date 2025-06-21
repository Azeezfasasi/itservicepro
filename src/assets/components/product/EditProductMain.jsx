import { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../../context-api/product-context/UseProduct'
import { FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa'; 
import { RICHT_TEXT_API } from '../../../config/richText';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    product,
    fetchProductById,
    updateProduct,
    loading, // Access loading state
    error,   // Access error state
    success,  // Access success state
    categories, fetchCategories
  } = useProduct();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    richDescription: '',
    brand: '',
    price: '',
    originalPrice: '',
    category: '', // This will be category ID
    stockQuantity: '',
    colors: [],   // Now an array
    sizes: [],    // Now an array
    tags: [],     // Now an array
    status: 'draft',
    isFeatured: false,
    onSale: false, // Corrected from isOnSale to onSale to match backend schema
    discountPercentage: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    // No need for categoryId or userId in formData for update, backend uses token
  });

  const [imageFiles, setImageFiles] = useState([]); // For newly selected image files
  const [currentImages, setCurrentImages] = useState([]); // To manage existing images (url and public_id)
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // fetchCategories is stable due to useCallback in ProductProvider

  // Fetch product data for editing
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]); // fetchProductById is stable due to useCallback

  // Populate form data when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        richDescription: product.richDescription || '',
        brand: product.brand || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category?._id || '', // Use category._id
        stockQuantity: product.stockQuantity || '',
        colors: Array.isArray(product.colors) ? product.colors : (product.colors ? product.colors.split(',').map(s => s.trim()).filter(s => s !== '') : []),
        sizes: Array.isArray(product.sizes) ? product.sizes : (product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : []),
        tags: Array.isArray(product.tags) ? product.tags : (product.tags ? product.tags.split(',').map(s => s.trim()).filter(s => s !== '') : []),
        sku: product.sku || '',
        weight: product.weight || '',
        dimensions: {
          length: product.dimensions?.length || '',
          width: product.dimensions?.width || '',
          height: product.dimensions?.height || ''
        },
        status: product.status || 'draft',
        isFeatured: product.isFeatured || false,
        onSale: product.onSale || false, // Ensure this matches backend
        discountPercentage: product.discountPercentage || '',
      });
      // Set current images for display and deletion management
      setCurrentImages(product.images || []);
      setImageFiles([]); // Clear any previously selected new files
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkboxes
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
    // Handle nested dimensions object
    else if (name.startsWith('dimensions.')) {
      const dimKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimKey]: value,
        },
      }));
    }
    // Handle array fields (colors, sizes, tags) - convert comma-separated string to array
    else if (['colors', 'sizes', 'tags'].includes(name)) {
        setFormData(prev => ({
            ...prev,
            [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
        }));
    }
    // Handle all other input types
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleDeleteExistingImage = (imageToDeleteUrl) => {
    setCurrentImages(prevImages => prevImages.filter(img => img.url !== imageToDeleteUrl));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.description.trim()) errors.description = 'Product description is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) errors.price = 'Valid price is required';
    if (!formData.stockQuantity || isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0) errors.stockQuantity = 'Valid stock quantity is required';
    if (!formData.category) errors.category = 'Category is required';

    // Optional validation for richDescription if needed
    // if (!formData.richDescription.trim()) errors.richDescription = 'Rich description is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        window.scrollTo(0, 0); // Scroll to top to show errors
        return;
    }

    const productDataForSubmission = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      isFeatured: Boolean(formData.isFeatured),
      onSale: Boolean(formData.onSale),
      discountPercentage: formData.discountPercentage ? Number(formData.discountPercentage) : 0,
      weight: formData.weight ? Number(formData.weight) : undefined,
      dimensions: {
        length: formData.dimensions.length ? Number(formData.dimensions.length) : undefined,
        width: formData.dimensions.width ? Number(formData.dimensions.width) : undefined,
        height: formData.dimensions.height ? Number(formData.dimensions.height) : undefined,
      },
      // Pass both new files and URLs of existing images to keep
      images: imageFiles, // These are the File objects for new uploads
      existingImageUrls: currentImages.map(img => img.url), // These are the URLs of existing images to retain
    };

    const result = await updateProduct(id, productDataForSubmission);

    if (result) {
      setTimeout(() => {
        navigate('/app/products');
      }, 1500); // Navigate back after a short delay
    }
  };

  // Base URL for Cloudinary images (assuming your backend serves them directly or via a proxy)
  const API_URL_BASE = import.meta.env.VITE_API_URL;

  const editorRef = useRef(null);
  const handleEditorChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  return (
    <div className='max-w-4xl mx-auto p-4 bg-white rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Edit Product: {product?.name || 'Loading...'}</h2>

      {loading && <p className="text-blue-600 mb-4">Loading product data...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {(!product && !loading) ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Product not found or an error occurred.</p>
          <button
            onClick={() => navigate('/app/products')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Go Back to Products
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-15 lg:6">
          {/* Name and Description */}
          <div>
            <label htmlFor="name" className='block text-lg font-medium mb-2'>Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              name="name"
              className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
            />
            {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="description" className='block text-lg font-medium mb-2'>Description:</label>
            <Editor
              apiKey={RICHT_TEXT_API}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={formData.richDescription || formData.description}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks |' + 'bold italic forecolor | alignleft aligncenter alignright alignjustify |' + '| bullist numlist outdent indent | ' + 'removeformat | help',
              }}
              onEditorChange={handleEditorChange}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
            )}
          </div>

          {/* Brand, Price, Discounted Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="brand" className='block text-lg font-medium mb-2'>Brand:</label>
              <input
                type="text"
                id="brand"
                value={formData.brand}
                onChange={handleChange}
                name="brand"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>
            <div>
              <label htmlFor="price" className='block text-lg font-medium mb-2'>Price:</label>
              <input
                type="number" // Changed to number type for better input control
                id="price"
                value={formData.price}
                onChange={handleChange}
                name="price"
                step="0.01"
                min="0"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              />
              {validationErrors.price && <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>}
            </div>
            <div>
              <label htmlFor="originalPrice" className='block text-lg font-medium mb-2'>Original Price:</label>
              <input
                type="number" // Changed to number type
                id="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                name="originalPrice"
                step="0.01"
                min="0"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>
            <div>
              <label htmlFor="discountPercentage" className='block text-lg font-medium mb-2'>Discount Percentage (%):</label>
              <input
                type="number"
                id="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                name="discountPercentage"
                min="0"
                max="100"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>
          </div>

          {/* Category, Stock, SKU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className='block text-lg font-medium mb-2'>Category:</label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              >
                <option value="">Choose Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {validationErrors.category && <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>}
            </div>
            <div>
              <label htmlFor="stockQuantity" className='block text-lg font-medium mb-2'>Stock Quantity:</label>
              <input
                type="number" // Changed to number type
                id="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                name="stockQuantity"
                min="0"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              />
              {validationErrors.stockQuantity && <p className="text-red-500 text-sm mt-1">{validationErrors.stockQuantity}</p>}
            </div>
            <div>
              <label htmlFor="sku" className='block text-lg font-medium mb-2'>SKU:</label>
              <input
                type="text"
                id="sku"
                value={formData.sku}
                onChange={handleChange}
                name="sku"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              />
            </div>
          </div>

          {/* Colors, Sizes, Tags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="colors" className='block text-lg font-medium mb-2'>Colors (comma-separated):</label>
              <input
                type="text"
                id="colors"
                value={Array.isArray(formData.colors) ? formData.colors.join(', ') : formData.colors || ''} // Ensure it handles string or array initially
                onChange={handleChange}
                name="colors"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
                placeholder="e.g., Red, Blue, Black"
              />
            </div>
            <div>
              <label htmlFor="sizes" className='block text-lg font-medium mb-2'>Sizes (comma-separated):</label>
              <input
                type="text"
                id="sizes"
                value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes || ''} // Ensure it handles string or array initially
                onChange={handleChange}
                name="sizes"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
                placeholder="e.g., S, M, L, XL"
              />
            </div>
            <div>
              <label htmlFor="tags" className='block text-lg font-medium mb-2'>Tags (comma-separated):</label>
              <input
                type="text"
                id="tags"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} // Ensure it handles string or array initially
                onChange={handleChange}
                name="tags"
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
                placeholder="e.g., electronics, new, durable"
              />
            </div>
          </div>

          {/* Weight and Dimensions */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Physical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="weight" className='block text-lg font-medium mb-2'>Weight (kg):</label>
                <input
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  name="weight"
                  step="0.01"
                  min="0"
                  className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
                />
              </div>
              <div>
                <label htmlFor="dimensions.length" className='block text-lg font-medium mb-2'>Length (cm):</label>
                <input
                  type="number"
                  id="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleChange}
                  name="dimensions.length"
                  step="0.01"
                  min="0"
                  className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
                />
              </div>
              <div>
                <label htmlFor="dimensions.width" className='block text-lg font-medium mb-2'>Width (cm):</label>
                <input
                  type="number"
                  id="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleChange}
                  name="dimensions.width"
                  step="0.01"
                  min="0"
                  className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
                />
              </div>
              <div>
                <label htmlFor="dimensions.height" className='block text-lg font-medium mb-2'>Height (cm):</label>
                <input
                  type="number"
                  id="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleChange}
                  name="dimensions.height"
                  step="0.01"
                  min="0"
                  className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Image Management */}
          <div>
            <label htmlFor="images" className='block text-lg font-medium mb-2'>Product Images:</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              accept="image/*"
            />
            <p className="mt-1 text-sm text-gray-500">Upload new images (max 10MB each).</p>

            {/* Display newly selected images (before upload) */}
            {imageFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-md font-medium text-gray-700">New images to upload:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                      <img src={URL.createObjectURL(file)} alt={`New Image ${index}`} className="w-full h-full object-cover" />
                      {/* No delete here, as these are not yet uploaded */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display existing product images */}
            {currentImages.length > 0 && (
              <div className="mt-4">
                <p className="text-md font-medium text-gray-700">Current product images:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentImages.map((image, index) => (
                    <div key={image.url} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                      <img src={image.url} alt={`Existing Image ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(image.url)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-md p-1 text-xs opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove this image"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(currentImages.length === 0 && product?.images?.length > 0) && (
              <p className="text-orange-500 text-sm mt-2">All original images have been marked for removal. Add new ones or they will be deleted upon save.</p>
            )}
          </div>

          {/* Status and Feature/Sale Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className='block text-lg font-medium mb-2'>Status:</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center space-x-4 mt-8 md:mt-auto">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Is Featured?</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="onSale"
                        name="onSale"
                        checked={formData.onSale}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="onSale" className="ml-2 block text-sm text-gray-900">Is On Sale?</label>
                </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className='flex flex-row justify-start items-center gap-5 mt-6'>
            <button
              type="submit"
              className="flex justify-center items-center gap-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-[200px]"
              disabled={loading}
            >
              {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/products')}
              className="flex justify-center items-center gap-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-gray-500 w-[200px]"
            >
              <FaArrowLeft /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProduct;


// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ProductContext } from '../../context-api/product-context/ProductContext';
// import { FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa'; // Added FaTrash for image deletion

// const EditProduct = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const {
//     product,
//     fetchProductById,
//     updateProduct,
//     categories, 
//     fetchCategories,
//     loading,
//     error,
//     success,
    
//   } = useContext(ProductContext);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     richDescription: '',
//     brand: '',
//     price: '',
//     originalPrice: '',
//     category: '', // This will be category ID
//     stockQuantity: '',
//     colors: [],
//     sizes: [],
//     tags: [],
//     sku: '', // Added SKU to formData for consistency
//     status: 'draft',
//     isFeatured: false,
//     onSale: false,
//     discountPercentage: '',
//     weight: '',
//     dimensions: {
//       length: '',
//       width: '',
//       height: ''
//     },
//   });

//   const [imageFiles, setImageFiles] = useState([]); // For newly selected image files
//   const [currentImages, setCurrentImages] = useState([]); // To manage existing images (url and public_id)
//   const [validationErrors, setValidationErrors] = useState({});

//   // Fetch categories when component mounts
//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   // Fetch product data for editing
//   useEffect(() => {
//     if (id) {
//       fetchProductById(id);
//     }
//   }, [id, fetchProductById]);

//   // Populate form data when product is loaded
//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         richDescription: product.richDescription || '',
//         brand: product.brand || '',
//         price: product.price || '',
//         originalPrice: product.originalPrice || '',
//         category: product.category?._id || '',
//         stockQuantity: product.stockQuantity || '',
//         colors: Array.isArray(product.colors) ? product.colors : (product.colors ? product.colors.split(',').map(s => s.trim()).filter(s => s !== '') : []),
//         sizes: Array.isArray(product.sizes) ? product.sizes : (product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : []),
//         tags: Array.isArray(product.tags) ? product.tags : (product.tags ? product.tags.split(',').map(s => s.trim()).filter(s => s !== '') : []),
//         sku: product.sku || '',
//         weight: product.weight || '',
//         dimensions: {
//           length: product.dimensions?.length || '',
//           width: product.dimensions?.width || '',
//           height: product.dimensions?.height || ''
//         },
//         status: product.status || 'draft',
//         isFeatured: product.isFeatured || false,
//         onSale: product.onSale || false,
//         discountPercentage: product.discountPercentage || '',
//       });
//       // Set current images for display and deletion management
//       // Ensure product.images is an array of objects, if not, convert it.
//       setCurrentImages(product.images || []);
//       setImageFiles([]); // Clear any previously selected new files
//     }
//   }, [product]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     }
//     else if (name.startsWith('dimensions.')) {
//       const dimKey = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         dimensions: {
//           ...prev.dimensions,
//           [dimKey]: value,
//         },
//       }));
//     }
//     else if (['colors', 'sizes', 'tags'].includes(name)) {
//         setFormData(prev => ({
//             ...prev,
//             [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
//         }));
//     }
//     else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e) => {
//     // FIX: Concatenate new files with existing ones
//     setImageFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
//   };

//   const handleDeleteNewImage = (indexToDelete) => {
//     setImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete));
//   };

//   const handleDeleteExistingImage = (imageToDeleteUrl) => {
//     setCurrentImages(prevImages => prevImages.filter(img => img.url !== imageToDeleteUrl));
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.name.trim()) errors.name = 'Product name is required';
//     if (!formData.description.trim()) errors.description = 'Product description is required';
//     if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) errors.price = 'Valid price is required';
//     if (!formData.stockQuantity || isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0) errors.stockQuantity = 'Valid stock quantity is required';
//     if (!formData.category) errors.category = 'Category is required';

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//         window.scrollTo(0, 0);
//         return;
//     }

//     // FIX: Create FormData object for mixed data (files + text)
//     const dataToSend = new FormData();

//     // Append all text fields
//     for (const key in formData) {
//       if (Object.prototype.hasOwnProperty.call(formData, key)) {
//         if (key === 'dimensions') {
//           // Append dimensions as separate fields or a stringified JSON
//           // Backend expects length, width, height as separate fields in req.body
//           if (formData.dimensions.length !== '') dataToSend.append('dimensions.length', Number(formData.dimensions.length));
//           if (formData.dimensions.width !== '') dataToSend.append('dimensions.width', Number(formData.dimensions.width));
//           if (formData.dimensions.height !== '') dataToSend.append('dimensions.height', Number(formData.dimensions.height));
//         } else if (Array.isArray(formData[key])) {
//           // For array fields like colors, sizes, tags, send as comma-separated string
//           // Backend is already expecting this format for parsing if sent via FormData
//           dataToSend.append(key, formData[key].join(','));
//         } else if (typeof formData[key] === 'boolean') {
//           dataToSend.append(key, formData[key] ? 'true' : 'false');
//         } else if (formData[key] !== null && formData[key] !== undefined) {
//           dataToSend.append(key, formData[key]);
//         }
//       }
//     }

//     // Append new image files
//     imageFiles.forEach((file) => {
//       dataToSend.append('images', file); // 'images' must match the Multer field name in backend
//     });

//     // Append URLs of existing images to keep
//     // Backend expects 'existingImageUrls' as an array of URLs
//     // Stringify the array before appending to FormData
//     dataToSend.append('existingImageUrls', JSON.stringify(currentImages.map(img => img.url)));


//     const result = await updateProduct(id, dataToSend); // Send FormData object

//     if (result) {
//       setTimeout(() => {
//         navigate('/app/products');
//       }, 1500);
//     }
//   };

//   const API_URL_BASE = import.meta.env.VITE_API_URL;

//   return (
//     <div className='max-w-4xl mx-auto p-4 bg-white rounded-md shadow-md'>
//       <h2 className='text-2xl font-bold mb-4'>Edit Product: {product?.name || 'Loading...'}</h2>

//       {loading && <p className="text-blue-600 mb-4">Loading product data...</p>}
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       {success && <p className="text-green-600 mb-4">{success}</p>}

//       {(!product && !loading) ? (
//         <div className="text-center py-8">
//           <p className="text-gray-600">Product not found or an error occurred.</p>
//           <button
//             onClick={() => navigate('/app/products')}
//             className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//           >
//             Go Back to Products
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-15 lg:6">
//           {/* Name and Description */}
//           <div>
//             <label htmlFor="name" className='block text-lg font-medium mb-2'>Name:</label>
//             <input
//               type="text"
//               id="name"
//               value={formData.name}
//               onChange={handleChange}
//               name="name"
//               className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//             />
//             {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
//           </div>
//           <div>
//             <label htmlFor="description" className='block text-lg font-medium mb-2'>Description:</label>
//             <textarea
//               name="description"
//               id="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//             ></textarea>
//             {validationErrors.description && <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>}
//           </div>
//           <div>
//             <label htmlFor="richDescription" className="block text-lg font-medium mb-2">Rich Description (HTML allowed):</label>
//             <textarea
//               id="richDescription"
//               name="richDescription"
//               value={formData.richDescription}
//               onChange={handleChange}
//               rows="6"
//               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//               placeholder="Enter detailed HTML description here..."
//             ></textarea>
//           </div>

//           {/* Brand, Price, Discounted Price */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label htmlFor="brand" className='block text-lg font-medium mb-2'>Brand:</label>
//               <input
//                 type="text"
//                 id="brand"
//                 value={formData.brand}
//                 onChange={handleChange}
//                 name="brand"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               />
//             </div>
//             <div>
//               <label htmlFor="price" className='block text-lg font-medium mb-2'>Price:</label>
//               <input
//                 type="number"
//                 id="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 name="price"
//                 step="0.01"
//                 min="0"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               />
//               {validationErrors.price && <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>}
//             </div>
//             <div>
//               <label htmlFor="originalPrice" className='block text-lg font-medium mb-2'>Original Price:</label>
//               <input
//                 type="number"
//                 id="originalPrice"
//                 value={formData.originalPrice}
//                 onChange={handleChange}
//                 name="originalPrice"
//                 step="0.01"
//                 min="0"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               />
//             </div>
//             <div>
//               <label htmlFor="discountPercentage" className='block text-lg font-medium mb-2'>Discount Percentage (%):</label>
//               <input
//                 type="number"
//                 id="discountPercentage"
//                 value={formData.discountPercentage}
//                 onChange={handleChange}
//                 name="discountPercentage"
//                 min="0"
//                 max="100"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               />
//             </div>
//           </div>

//           {/* Category, Stock, SKU */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label htmlFor="category" className='block text-lg font-medium mb-2'>Category:</label>
//               <select
//                 name="category"
//                 id="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               >
//                 <option value="">Choose Category</option>
//                 {categories.map(cat => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//               {validationErrors.category && <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>}
//             </div>
//             <div>
//               <label htmlFor="stockQuantity" className='block text-lg font-medium mb-2'>Stock Quantity:</label>
//               <input
//                 type="number"
//                 id="stockQuantity"
//                 value={formData.stockQuantity}
//                 onChange={handleChange}
//                 name="stockQuantity"
//                 min="0"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               />
//               {validationErrors.stockQuantity && <p className="text-red-500 text-sm mt-1">{validationErrors.stockQuantity}</p>}
//             </div>
//             <div>
//               <label htmlFor="sku" className='block text-lg font-medium mb-2'>SKU:</label>
//               <input
//                 type="text"
//                 id="sku"
//                 value={formData.sku}
//                 onChange={handleChange}
//                 name="sku"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               />
//             </div>
//           </div>

//           {/* Colors, Sizes, Tags */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label htmlFor="colors" className='block text-lg font-medium mb-2'>Colors (comma-separated):</label>
//               <input
//                 type="text"
//                 id="colors"
//                 value={Array.isArray(formData.colors) ? formData.colors.join(', ') : formData.colors || ''}
//                 onChange={handleChange}
//                 name="colors"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//                 placeholder="e.g., Red, Blue, Black"
//               />
//             </div>
//             <div>
//               <label htmlFor="sizes" className='block text-lg font-medium mb-2'>Sizes (comma-separated):</label>
//               <input
//                 type="text"
//                 id="sizes"
//                 value={Array.isArray(formData.sizes) ? formData.sizes.join(', ') : formData.sizes || ''}
//                 onChange={handleChange}
//                 name="sizes"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//                 placeholder="e.g., S, M, L, XL"
//               />
//             </div>
//             <div>
//               <label htmlFor="tags" className='block text-lg font-medium mb-2'>Tags (comma-separated):</label>
//               <input
//                 type="text"
//                 id="tags"
//                 value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
//                 onChange={handleChange}
//                 name="tags"
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//                 placeholder="e.g., electronics, new, durable"
//               />
//             </div>
//           </div>

//           {/* Weight and Dimensions */}
//           <div>
//             <h3 className="text-xl font-semibold mb-3">Physical Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div>
//                 <label htmlFor="weight" className='block text-lg font-medium mb-2'>Weight (kg):</label>
//                 <input
//                   type="number"
//                   id="weight"
//                   value={formData.weight}
//                   onChange={handleChange}
//                   name="weight"
//                   step="0.01"
//                   min="0"
//                   className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="dimensions.length" className='block text-lg font-medium mb-2'>Length (cm):</label>
//                 <input
//                   type="number"
//                   id="dimensions.length"
//                   value={formData.dimensions.length}
//                   onChange={handleChange}
//                   name="dimensions.length"
//                   step="0.01"
//                   min="0"
//                   className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="dimensions.width" className='block text-lg font-medium mb-2'>Width (cm):</label>
//                 <input
//                   type="number"
//                   id="dimensions.width"
//                   value={formData.dimensions.width}
//                   onChange={handleChange}
//                   name="dimensions.width"
//                   step="0.01"
//                   min="0"
//                   className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="dimensions.height" className='block text-lg font-medium mb-2'>Height (cm):</label>
//                 <input
//                   type="number"
//                   id="dimensions.height"
//                   value={formData.dimensions.height}
//                   onChange={handleChange}
//                   name="dimensions.height"
//                   step="0.01"
//                   min="0"
//                   className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Image Management */}
//           <div>
//             <label htmlFor="images" className='block text-lg font-medium mb-2'>Product Images:</label>
//             <input
//               type="file"
//               id="images"
//               name="images"
//               multiple
//               onChange={handleImageChange}
//               className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
//               accept="image/*"
//             />
//             <p className="mt-1 text-sm text-gray-500">Upload new images (max 10MB each).</p>

//             {/* Display newly selected images (before upload) */}
//             {imageFiles.length > 0 && (
//               <div className="mt-3">
//                 <p className="text-md font-medium text-gray-700">New images to upload:</p>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {imageFiles.map((file, index) => (
//                     <div key={file.name + index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
//                       <img src={URL.createObjectURL(file)} alt={`New Image ${index}`} className="w-full h-full object-cover" />
//                       <button
//                         type="button"
//                         onClick={() => handleDeleteNewImage(index)} // Allow deleting newly selected images
//                         className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-md p-1 text-xs opacity-80 hover:opacity-100 transition-opacity"
//                         title="Remove this new image"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Display existing product images */}
//             {currentImages.length > 0 && (
//               <div className="mt-4">
//                 <p className="text-md font-medium text-gray-700">Current product images:</p>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {currentImages.map((image, index) => (
//                     <div key={image.url} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
//                       <img src={image.url} alt={`Existing Image ${index}`} className="w-full h-full object-cover" />
//                       <button
//                         type="button"
//                         onClick={() => handleDeleteExistingImage(image.url)}
//                         className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-md p-1 text-xs opacity-80 hover:opacity-100 transition-opacity"
//                         title="Remove this image"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {(currentImages.length === 0 && product?.images?.length > 0 && imageFiles.length === 0) && (
//               <p className="text-orange-500 text-sm mt-2">All original images have been marked for removal. No new images selected. If you save now, this product will have no images.</p>
//             )}
//              {(currentImages.length === 0 && product?.images?.length > 0 && imageFiles.length > 0) && (
//               <p className="text-green-500 text-sm mt-2">Original images marked for removal. New images have been selected for upload.</p>
//             )}
//           </div>

//           {/* Status and Feature/Sale Checkboxes */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="status" className='block text-lg font-medium mb-2'>Status:</label>
//               <select
//                 name="status"
//                 id="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="block w-full p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
//               >
//                 <option value="draft">Draft</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//             <div className="flex items-center space-x-4 mt-8 md:mt-auto">
//                 <div className="flex items-center">
//                     <input
//                         type="checkbox"
//                         id="isFeatured"
//                         name="isFeatured"
//                         checked={formData.isFeatured}
//                         onChange={handleChange}
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Is Featured?</label>
//                 </div>
//                 <div className="flex items-center">
//                     <input
//                         type="checkbox"
//                         id="onSale"
//                         name="onSale"
//                         checked={formData.onSale}
//                         onChange={handleChange}
//                         className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor="onSale" className="ml-2 block text-sm text-gray-900">Is On Sale?</label>
//                 </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className='flex flex-row justify-start items-center gap-5 mt-6'>
//             <button
//               type="submit"
//               className="flex justify-center items-center gap-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-[200px]"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate('/app/products')}
//               className="flex justify-center items-center gap-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-gray-500 w-[200px]"
//             >
//               <FaArrowLeft /> Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default EditProduct;

