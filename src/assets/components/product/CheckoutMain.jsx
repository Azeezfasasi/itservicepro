import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCart } from '../../context-api/cart/UseCart';
import { useUser } from '../../context-api/user-context/UseUser';
import { FaSpinner, FaShoppingCart, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config/api';

const CheckoutMain = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { cart, loading: cartLoading, formatPrice, clearCart } = useCart();
  const { user, token } = useUser();
  const [showPaymentFields, setShowPaymentFields] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user && user.shippingAddress) {
      setShippingAddress({
        fullName: user.name || '',
        address1: user.shippingAddress.address1 || '',
        address2: user.shippingAddress.address2 || '',
        city: user.shippingAddress.city || '',
        state: user.shippingAddress.state || '',
        zipCode: user.shippingAddress.zipCode || '',
        country: user.shippingAddress.country || 'Nigeria',
      });
    } else if (user) {
        setShippingAddress(prev => ({ ...prev, fullName: user.name || '' }));
    }
  }, [user]);

  const subtotal = cart?.items?.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0) || 0;
  const estimatedShipping = 1500;
  const taxRate = 0.075;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + estimatedShipping + taxAmount;

  const handleShippingChange = useCallback((e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handlePaymentChange = useCallback((e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const createOrderApi = async (orderData) => {
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || 'Failed to create order');
    }
    return responseData;
  };

  const {
    mutate,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: createOrderApi,
    onSuccess: (orderResponse) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });

      navigate('/app/ordersuccess', {
        state: { orderId: orderResponse.order._id },
      });
    },
    onError: (err) => {
      console.error("Checkout mutation error:", err.message);
    },
  });

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!shippingAddress.address1.trim()) errors.address1 = 'Address Line 1 is required.';
    if (!shippingAddress.city.trim()) errors.city = 'City is required.';
    if (!shippingAddress.state.trim()) errors.state = 'State/Region is required.';
    if (!shippingAddress.zipCode.trim()) errors.zipCode = 'Zip/Postal Code is required.';
    if (!shippingAddress.country.trim()) errors.country = 'Country is required.';

    if (showPaymentFields) {
      if (!paymentDetails.cardNumber.trim()) errors.cardNumber = 'Card Number is required.';
      if (!paymentDetails.expiryDate.trim()) errors.expiryDate = 'Expiry Date is required.';
      if (!paymentDetails.cvv.trim()) errors.cvv = 'CVV is required.';
      if (!paymentDetails.cardName.trim()) errors.cardName = 'Name on Card is required.';
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      errors.cart = 'Your cart is empty. Please add items to proceed.';
    } else {
        // Validate each item in the cart to ensure productId is valid
        const hasInvalidProductData = cart.items.some(item => {
            const currentProductId = (typeof item.productId === 'object' && item.productId !== null)
                                    ? item.productId._id
                                    : item.productId;
            return !currentProductId; // Checks for null, undefined, or empty string (if it becomes string)
        });

        if (hasInvalidProductData) {
            errors.cartItems = 'Some items in your cart have invalid product data (missing ID). Please review and re-add them.';
        }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitCheckout = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Filter out items that have invalid productId before sending to backend
    // This is a defensive measure; the ideal fix is to prevent them from entering the cart.
    const validOrderItems = cart.items.map(item => {
        let pId;
        if (typeof item.productId === 'object' && item.productId !== null && item.productId._id) {
            pId = item.productId._id;
        } else if (typeof item.productId === 'string') {
            pId = item.productId;
        } else {
            // This item has an invalid productId, return null to filter it out
            return null;
        }

        return {
            productId: pId,
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            image: item.image,
        };
    }).filter(item => item !== null); // Filter out null items

    if (validOrderItems.length === 0) {
        setValidationErrors(prev => ({ ...prev, cartItems: 'Your cart contains no valid products after filtering. Please add valid items.' }));
        return;
    }


    const orderData = {
      orderItems: validOrderItems, // Use the filtered valid order items
      shippingAddress: shippingAddress,
      paymentMethod: showPaymentFields ? 'Credit Card' : 'Cash on Delivery',
      itemsPrice: subtotal,
      taxPrice: taxAmount,
      shippingPrice: estimatedShipping,
      totalPrice: totalAmount,
    };

    mutate(orderData);
  };

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50 p-6 rounded-lg shadow-md">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mr-3" />
        <p className="text-xl text-gray-700">Loading your cart for checkout...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-8 rounded-lg shadow-xl text-gray-700">
        <FaExclamationCircle className="text-red-500 text-6xl mb-6" />
        <h2 className="text-3xl font-bold mb-3">Authentication Required</h2>
        <p className="text-lg text-center mb-6">
          Please log in to proceed with the checkout.
        </p>
        <Link
          to="/app/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Go to Login
        </Link>
      </div>
    );
  }

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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-green-50 p-8 rounded-lg shadow-xl text-green-800">
        <FaCheckCircle className="text-green-500 text-7xl mb-6 animate-bounce" />
        <h2 className="text-4xl font-extrabold mb-4 text-center">Order Placed Successfully!</h2>
        <p className="text-lg text-center mb-8 max-w-md">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
        <Link
          to="/app/orders"
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

      {(isError || Object.keys(validationErrors).length > 0) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold mr-2">
            {isError ? 'Checkout Error!' : 'Please fix the following errors!'}
          </strong>
          {isError && <span className="block sm:inline">{error?.message || 'An unknown error occurred.'}</span>}
          {Object.keys(validationErrors).length > 0 && (
            <ul className="mt-2 list-disc list-inside">
              {Object.values(validationErrors).map((errMsg, index) => errMsg && <li key={index}>{errMsg}</li>)}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text" id="fullName" name="fullName"
                  value={shippingAddress.fullName} onChange={handleShippingChange}
                  className={`w-full border ${validationErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {validationErrors.fullName && <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1*</label>
                <input
                  type="text" id="address1" name="address1"
                  value={shippingAddress.address1} onChange={handleShippingChange}
                  className={`w-full border ${validationErrors.address1 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {validationErrors.address1 && <p className="text-red-500 text-xs mt-1">{validationErrors.address1}</p>}
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
                  className={`w-full border ${validationErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {validationErrors.city && <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Region*</label>
                <input
                  type="text" id="state" name="state"
                  value={shippingAddress.state} onChange={handleShippingChange}
                  className={`w-full border ${validationErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {validationErrors.state && <p className="text-red-500 text-xs mt-1">{validationErrors.state}</p>}
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal Code*</label>
                <input
                  type="text" id="zipCode" name="zipCode"
                  value={shippingAddress.zipCode} onChange={handleShippingChange}
                  className={`w-full border ${validationErrors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {validationErrors.zipCode && <p className="text-red-500 text-xs mt-1">{validationErrors.zipCode}</p>}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                <select
                  id="country" name="country"
                  value={shippingAddress.country} onChange={handleShippingChange}
                  className={`w-full border ${validationErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">United Kingdom</option>
                  {/* Add more countries as needed */}
                </select>
                {validationErrors.country && <p className="text-red-500 text-xs mt-1">{validationErrors.country}</p>}
              </div>
            </div>
          </div>

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
                Pay with Credit/Debit Card (Mock)
              </label>
            </div>

            {showPaymentFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number*</label>
                  <input
                    type="text" id="cardNumber" name="cardNumber"
                    value={paymentDetails.cardNumber} onChange={handlePaymentChange}
                    className={`w-full border ${validationErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength="19"
                    required
                  />
                  {validationErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.cardNumber}</p>}
                </div>
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (MM/YY)*</label>
                  <input
                    type="text" id="expiryDate" name="expiryDate"
                    value={paymentDetails.expiryDate} onChange={handlePaymentChange}
                    className={`w-full border ${validationErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                  {validationErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{validationErrors.expiryDate}</p>}
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                  <input
                    type="text" id="cvv" name="cvv"
                    value={paymentDetails.cvv} onChange={handlePaymentChange}
                    className={`w-full border ${validationErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="XXX"
                    maxLength="4"
                    required
                  />
                  {validationErrors.cvv && <p className="text-red-500 text-xs mt-1">{validationErrors.cvv}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card*</label>
                  <input
                    type="text" id="cardName" name="cardName"
                    value={paymentDetails.cardName} onChange={handlePaymentChange}
                    className={`w-full border ${validationErrors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  {validationErrors.cardName && <p className="text-red-500 text-xs mt-1">{validationErrors.cardName}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6 h-fit sticky top-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Order Summary</h2>

          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {cart.items.map((item, index) => { 
                const itemKey = (typeof item.productId === 'string' && item.productId) ? item.productId : (typeof item.productId === 'object' && item.productId !== null && item.productId._id) ? item.productId._id : `${item.name || 'unknown'}-${index}`;
                return (
                  <div key={itemKey} className="flex items-center justify-between text-sm text-gray-700">
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
                );
            })}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between text-lg text-gray-700">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-700">
              <span>Shipping:</span>
              <span>{formatPrice(estimatedShipping)}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-700">
              <span>Tax ({taxRate * 100}%):</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 border-t border-gray-300 pt-3 mt-3">
              <span>Order Total:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md text-center transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutMain;
