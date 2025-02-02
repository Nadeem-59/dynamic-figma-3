"use client";
import '@/app/globals.css';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsCart3 } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoHome } from "react-icons/io5";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
  color: string;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleRemoveFromCart = (itemIndex: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart.splice(itemIndex, 1);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
     <nav className="container mx-auto px-6 py-4 flex justify-between items-center bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 shadow-lg rounded-lg">
  {/* Brand */}
  <h1 className="text-2xl font-bold text-white tracking-wider hover:text-yellow-300 transition duration-300">
    Bandage
  </h1>

  {/* Navigation Links */}
  <div className="space-x-6 inline-flex items-center">
    {/* Home Icon */}
    <Link href="/" className="group">
      <div className="flex items-center gap-2 text-white hover:text-yellow-300 transition duration-300">
        <IoHome className="text-2xl group-hover:scale-125 transform transition-transform duration-300" />
        <span className="hidden md:inline-block text-lg font-medium">
          Home
        </span>
      </div>
    </Link>

    {/* Cart Icon */}
    <Link href="/Cart" className="group relative">
      <div className="flex items-center gap-2 text-white hover:text-yellow-300 transition duration-300">
        <BsCart3 className="text-2xl group-hover:scale-125 transform transition-transform duration-300" />
        <span className="hidden md:inline-block text-lg font-medium">
          Cart
        </span>
      </div>
      {/* Cart Item Count */}
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
          {cart.length}
        </span>
      )}
    </Link>
  </div>
</nav>


<div className="container mx-auto px-4 py-8 font-family">
  <h2 className="text-3xl font-bold mb-6 text-sky-500 tracking-wide text-center">
    Your Cart
  </h2>

  {cart.length > 0 ? (
    <div className="space-y-8">
      {/* Cart Items */}
      <ul className="space-y-6">
        {cart.map((item, index) => (
          <li
            key={index}
            className="flex w-[80%] mx-auto justify-between items-center bg-gradient-to-r from-sky-500 to-blue-500 shadow-lg rounded-lg p-5 transform transition hover:scale-105"
          >
            {/* Item Details */}
            <div className="flex items-center space-x-6">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={50}
                height={50}
                className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-200">
                  Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                </p>
                <p className="text-lg font-medium text-white">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveFromCart(index)}
              className="text-red-600 hover:text-red-400 transition-transform transform hover:scale-125"
            >
              <MdDelete className="text-3xl" />
            </button>
          </li>
        ))}
      </ul>

      {/* Cart Summary */}
      <div className="border-t border-gray-300 pt-6">
        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <span>Total:</span>
          <span className="text-sky-500">Rs {calculateTotal().toFixed(2)}</span>
        </div>
        {/* Buttons */}
        <div className="flex gap-6 w-[50%] items-center justify-center mx-auto">
          <Link
            href="/Shop"
            className="flex-1  px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center transition"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => alert("Proceeding to Checkout")}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-600 space-y-4">
      <p className="text-lg font-medium">Your cart is empty. Add items to your cart to see them here.</p>
      <Link
        href="/Shop"
        className="text-sky-500 hover:text-sky-600 font-bold text-lg hover:underline transition"
      >
        Go to Shop
      </Link>
    </div>
  )}
</div>
</div>
  );
};

export default CartPage;
