import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../context-api/product-context/ProductContext'; // Original path
import { ShoppingCart, Eye } from 'lucide-react'; // Using Lucide icons for a modern look

const ProductListForCustomers = () => {
  // Access product-related state and functions from ProductContext
  const {
    products,
    // loading,
    error,
    fetchProducts,
    totalPages,
    currentPage,
    formatPrice,
    calculateSalePrice
  } = useContext(ProductContext);

  // State to manage current page for fetching
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Fetch products when the component mounts or the page changes
  useEffect(() => {
    // Pass the current page to the fetchProducts function
    fetchProducts({ page: page, limit: 12 }); // Fetch 12 products per page
  }, [page, fetchProducts]); // Re-run effect when page or fetchProducts (context) changes

  // Function to handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0); // Scroll to top on page change for better UX
    }
  };

  // Function to navigate to product detail page
  const handleViewDetails = (id) => {
    navigate(`/app/productdetails/slug/${id}`); // Navigate to a product detail route
  };

  // --- Render Logic ---
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//         </svg>
//         <p className="ml-3 text-lg text-gray-700">Loading products...</p>
//       </div>
//     );
//   }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 text-red-700 rounded-lg shadow-md mt-8">
        <h3 className="font-bold text-xl mb-2">Error Loading Products</h3>
        <p>{error}</p>
        <p className="text-sm mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 text-gray-600 rounded-lg shadow-md mt-8">
        <h3 className="font-bold text-xl mb-2">No Products Found</h3>
        <p>It looks like there are no products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
        Our Products
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
                       transform transition duration-300 hover:scale-105 hover:shadow-xl
                       flex flex-col" // Use flex-col to stack image and content
          >
            {/* Product Image */}
            <div className="relative w-full h-48 sm:h-56 overflow-hidden">
              <img
                src={product.thumbnail || '/placehold.co/400x400/CCCCCC/000000?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = '/placehold.co/400x400/CCCCCC/000000?text=No+Image'; // Fallback
                }}
              />
              {product.onSale && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                  SALE {product.discountPercentage ? `- ${product.discountPercentage}%` : ''}
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow"> {/* flex-grow to push button to bottom */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={product.name}>
                {product.name}
              </h2>
              {product.category && (
                <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
              )}

              {/* Price Display */}
              <div className="flex items-center mb-4">
                {product.onSale ? (
                  <>
                    <p className="text-lg font-bold text-red-600 mr-2">
                      {formatPrice(calculateSalePrice(product.price, product.discountPercentage))}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
                {product.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleViewDetails(product.slug)}
                  className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg
                             hover:bg-blue-700 transition duration-300 ease-in-out
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Details
                </button>
                {/* Placeholder for Add to Cart - you can implement this later */}
                <button
                  className="flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded-lg
                             hover:bg-gray-200 transition duration-300 ease-in-out border border-gray-300
                             focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-blue-600 transition-colors duration-200"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200
                          ${currentPage === pageNumber
                            ? 'bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-blue-600 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListForCustomers;
