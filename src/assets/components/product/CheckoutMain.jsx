// frontend/src/components/checkout/Checkout.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context-api/cart/UseCart';
import { useUser } from '../../context-api/user-context/UseUser';
import { FaSpinner, FaShoppingCart, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const CheckoutMain = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, error: cartError, formatPrice, clearCart } = useCart();
  const { user } = useUser();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria', // Default country
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '', // Name on card
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [showPaymentFields, setShowPaymentFields] = useState(false); // State to toggle payment fields visibility

  // Prefill shipping address if user has one
  useEffect(() => {
    if (user && user.shippingAddress) {
      setShippingAddress({
        fullName: user.name || '', // Assuming user.name is available
        address1: user.shippingAddress.address1 || '',
        address2: user.shippingAddress.address2 || '',
        city: user.shippingAddress.city || '',
        state: user.shippingAddress.state || '',
        zipCode: user.shippingAddress.zipCode || '',
        country: user.shippingAddress.country || 'Nigeria',
      });
    }
  }, [user]);

  // Calculate totals
  const subtotal = cart?.items?.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0) || 0;
  const estimatedShipping = 1500; // Mock shipping cost
  const totalAmount = subtotal + estimatedShipping;

  const handleShippingChange = useCallback((e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentChange = useCallback((e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  // Mock checkout process
  const processCheckout = async () => {
    setIsProcessing(true);
    setCheckoutError(null);
    setCheckoutSuccess(false);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(Math.random() * 1000 + 500, resolve)); // 0.5s to 1.5s delay

      // Mock validation (can be more robust)
      if (!shippingAddress.fullName || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
        throw new Error('Please fill in all required shipping details.');
      }
      if (showPaymentFields && (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv)) {
        throw new Error('Please fill in all required payment details.');
      }
      if (!cart || cart.items.length === 0) {
        throw new Error('Your cart is empty. Please add items to proceed.');
      }

      // Here you would typically send data to your backend's order API:
      // const orderData = {
      //   shippingAddress,
      //   paymentDetails: showPaymentFields ? paymentDetails : null, // Only send if payment is selected
      //   cartItems: cart.items.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.price })),
      //   totalAmount,
      //   // ... other necessary data
      // };
      // const response = await fetch(`${API_URL}/api/orders`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`, // If you use an order API requiring auth
      //   },
      //   body: JSON.stringify(orderData),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to process order.');
      // }

      // Simulate success
      setCheckoutSuccess(true);
      clearCart(); // Clear the cart after successful checkout

      // Redirect to a success page after a short delay
      setTimeout(() => {
        navigate('/app/order-success'); // Navigate to a dedicated order success page
      }, 2000);

    } catch (err) {
      setCheckoutError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render loading state for cart
  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50 p-6 rounded-lg shadow-md">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mr-3" />
        <p className="text-xl text-gray-700">Loading your cart for checkout...</p>
      </div>
    );
  }

  // Handle errors specific to cart loading or if user isn't authenticated
  if (cartError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative min-h-[60vh] flex items-center justify-center text-center">
        <strong className="font-bold mr-2">Error loading cart:</strong>
        <span className="block sm:inline">{cartError}</span>
        <p className="mt-2 text-sm">Please try again or contact support.</p>
      </div>
    );
  }

//   if (!isAuthenticated) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-8 rounded-lg shadow-xl text-gray-700">
//         <FaExclamationCircle className="text-red-500 text-6xl mb-6" />
//         <h2 className="text-3xl font-bold mb-3">Authentication Required</h2>
//         <p className="text-lg text-center mb-6">
//           Please log in to proceed with the checkout.
//         </p>
//         <Link
//           to="/app/login"
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
//         >
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

  // If cart is empty (after loading and auth checks)
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-8 rounded-lg shadow-xl text-gray-700">
        <FaShoppingCart className="text-gray-400 text-6xl mb-6" />
        <h2 className="text-3xl font-bold mb-3">Your Cart is Empty</h2>
        <p className="text-lg text-center mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/app/shop"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Start Shopping!
        </Link>
      </div>
    );
  }

  // Render success state after checkout
  if (checkoutSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-green-50 p-8 rounded-lg shadow-xl text-green-800">
        <FaCheckCircle className="text-green-500 text-7xl mb-6 animate-bounce" />
        <h2 className="text-4xl font-extrabold mb-4 text-center">Order Placed Successfully!</h2>
        <p className="text-lg text-center mb-8 max-w-md">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
        <Link
          to="/app/orders" // Link to a hypothetical orders history page
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          View Your Orders
        </Link>
        <Link
          to="/app/shop"
          className="mt-4 text-blue-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Checkout</h1>

      {checkoutError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold mr-2">Checkout Error!</strong>
          <span className="block sm:inline">{checkoutError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment Forms */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6 space-y-8">
          {/* Shipping Address Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Shipping Information</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text" id="fullName" name="fullName"
                  value={shippingAddress.fullName} onChange={handleShippingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1*</label>
                <input
                  type="text" id="address1" name="address1"
                  value={shippingAddress.address1} onChange={handleShippingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text" id="address2" name="address2"
                  value={shippingAddress.address2} onChange={handleShippingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                <input
                  type="text" id="city" name="city"
                  value={shippingAddress.city} onChange={handleShippingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Region*</label>
                <input
                  type="text" id="state" name="state"
                  value={shippingAddress.state} onChange={handleShippingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal Code*</label>
                <input
                  type="text" id="zipCode" name="zipCode"
                  value={shippingAddress.zipCode} onChange={handleShippingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                <select
                  id="country" name="country"
                  value={shippingAddress.country} onChange={handleShippingChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
            </form>
          </div>

          {/* Payment Method Section (Mock) */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Payment Method</h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="usePayment"
                checked={showPaymentFields}
                onChange={() => setShowPaymentFields(!showPaymentFields)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="usePayment" className="ml-2 block text-base font-medium text-gray-700">
                Pay with Credit/Debit Card
              </label>
            </div>

            {showPaymentFields && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number*</label>
                  <input
                    type="text" id="cardNumber" name="cardNumber"
                    value={paymentDetails.cardNumber} onChange={handlePaymentChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength="19" // Including spaces for formatting
                    required
                  />
                </div>
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)*</label>
                  <input
                    type="text" id="expiryDate" name="expiryDate"
                    value={paymentDetails.expiryDate} onChange={handlePaymentChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                  <input
                    type="text" id="cvv" name="cvv"
                    value={paymentDetails.cvv} onChange={handlePaymentChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="XXX"
                    maxLength="4"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card*</label>
                  <input
                    type="text" id="cardName" name="cardName"
                    value={paymentDetails.cardName} onChange={handlePaymentChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Order Summary</h2>

          {/* Items List */}
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {cart.items.map(item => (
              <div key={item.productId} className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <img
                    src={item.image || '/placehold.co/50x50/CCCCCC/000000?text=No+Image'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <span>
                    {item.name} <span className="text-gray-500">x {item.quantity}</span>
                  </span>
                </div>
                <span>{formatPrice(parseFloat(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-lg text-gray-700">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-700">
              <span>Shipping:</span>
              <span>{formatPrice(estimatedShipping)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 border-t border-gray-300 pt-3 mt-3">
              <span>Order Total:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={processCheckout}
            disabled={isProcessing || !cart || cart.items.length === 0}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-center transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMain;
