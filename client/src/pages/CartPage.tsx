import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';
import EmptyState from '../components/EmptyState';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const subtotal = getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <>
      <Helmet><title>Cart | Asian Cinematics</title></Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Browse our products and add items to your cart."
            action={<Link to="/products" className="btn-primary mt-2">Browse Products</Link>}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="card flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.product.images[0] ? (
                      <img src={`/uploads/${item.product.images[0]}`} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product.slug}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">₹{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50" aria-label="Decrease">
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50" aria-label="Increase">
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.product._id)} className="text-red-500 hover:text-red-600 p-1" aria-label="Remove">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}

              <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600">
                Clear Cart
              </button>
            </div>

            <div className="card h-fit sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="font-medium">₹{subtotal.toLocaleString()}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Tax (18%)</dt><dd className="font-medium">₹{tax.toLocaleString()}</dd></div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <dt className="font-semibold text-gray-900">Total</dt>
                  <dd className="font-bold text-lg text-gray-900">₹{total.toLocaleString()}</dd>
                </div>
              </dl>
              {subtotal < 999 && (
                <p className="text-xs text-green-600 mt-3">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!</p>
              )}
              <Link to="/checkout" className="btn-primary w-full mt-6 flex items-center justify-center space-x-2">
                <span>Proceed to Checkout</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
