"use client";
import '@/app/globals.css';
import { GetServerSideProps } from "next";
import { createClient } from "@sanity/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Star } from 'lucide-react';
import Navbar from '@/app/Homepage/Navbar';
import NavMobile from '@/app/Homepage/MobileNav';
import { IoBagCheckOutline } from "react-icons/io5";

const sanity = createClient({
  projectId: "gs2jqrlc",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: true,
});

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
  size: string;
  color: string;
}

interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductPage: React.FC<ProductPageProps> = ({ product, relatedProducts }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const [showNav, setShowNav] = useState(false);
  const itemsPerPage = 4; // Number of products per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(relatedProducts.length / itemsPerPage);

  const paginatedProducts = relatedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const sizes = ['XS', 'L', 'XL'];
  const colors = [
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'black', class: 'bg-black' },
    { name: 'gold', class: 'bg-yellow-600' }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      ...product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    };

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item._id === product._id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingItemIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, cartItem];
    });

    setShowPopup(true); // Show popup on add to cart
    setTimeout(() => setShowPopup(false), 4000); // Auto-hide popup after 3 seconds
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${i < product.reviews ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <main>
      <div className="overflow-x-hidden ">
        <NavMobile showNav={showNav} closeNav={() => setShowNav(false)} />   
        <Navbar openNav={() => setShowNav(true)} />
    </div>
    {/*Popup*/}
    <div className="min-h-screen bg-white font-family">
    <div
  className={`fixed top-10 right-10 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-4 transition-transform transform ${
    showPopup ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
  } duration-300 ease-out`}
>
<IoBagCheckOutline  className="text-3xl" />
  <div>
    <p className="font-bold text-lg">Success!</p>
    <p className="text-sm">Item has been added to your cart.</p>
  </div>
  <button
    onClick={() => setShowPopup(false)}
    className="ml-auto text-md bg-white text-sky-400 rounded-full px-4 py-2 hover:shadow-white shadow-md hover:bg-sky-600 hover:text-white transition"
  >
    Close
  </button>
</div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-sky-500">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-sky-500">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-sky-400">{product.title}</span>
        </div>
      </div>

      {/* Product Section */}
      {/* Product Content */}
      <main className=" mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left column - Images */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="w-25 h-40 bg-gray-100 rounded-lg ">
                    <Image
                      src={product?.imageUrl || '/placeholder.png'}
                      alt={product?.title || 'Thumbnail'}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover rounded-lg border-4 border-sky-300/50 shadow-md shadow-gray-500/50"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-gray-50 rounded-lg">
                <Image
                  src={product?.imageUrl || '/placeholder.png'}
                  alt={product?.title || 'Main product'}
                  width={500}
                  height={500}
                  className="w-[650px] h-[750px] object-cover rounded-lg border-4 border-sky-300/50 shadow-lg shadow-gray-500/60"
                />
              </div>
            </div>
          </div>

          {/* Right column - Product Info */}
          <div className="space-y-6">
            <h1 className="text-[3rem] text-sky-500 font-bold mb-4">{product?.title}</h1>

            {/* Price and Rating */}
            <div className="mb-6">
              <p className="text-xl font-medium mb-2">Rs. {product?.price}</p>
              <div className="flex items-center gap-2">
                {renderStars().map((star, index) => (
                  <span key={index} className="text-yellow-500">{star}</span>
                ))}
                <span className="text-gray-500">{product?.reviews}| Customer Review</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 mb-6">{product?.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <p className="text-md text-sky-500 font-medium mb-2">Size</p>
              <div className="flex gap-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-10 h-10 rounded-lg shadow-lg shadow-gray-500/60 border ${
                      selectedSize === size
                        ? 'border-sky-500 bg-sky-400 text-white'
                        : 'border-gray-300 bg-gray-200 text-gray-900'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium text-sky-500">Color</h3>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        selectedColor === color.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      onClick={() => setSelectedColor(color.name)}
                    />
                  ))}
                </div>
              </div>

            {/* Quantity and Actions */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg shadow-md shadow-gray-500/60">
                <button className="p-2" onClick={() => setQuantity(quantity - 1)}>
                  -
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button className="p-2" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-sky-400 text-white rounded-lg  hover:scale-110 hover:bg-sky-500 border-2 border-sky-500 shadow-md shadow-gray-500/60"
              >
                Add To Cart
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 space-y-2 text-sm text-gray-500">
              <div className="flex gap-2">
                <span>SKU</span>
                <span>:</span>
                <span>{product?._id}</span>
              </div>
              <div className="flex gap-2">
                <span>Category</span>
                <span>:</span>
                <span>Sofas</span>
              </div>
              <div className="flex gap-2">
                <span>Tags</span>
                <span>:</span>
                <span>Sofa, Chair, Home, Shop</span>
              </div>
              <div className="flex gap-2">
                <span>Share</span>
                <span>:</span>
                <div className="flex gap-4">
                  <button className="hover:text-black">Facebook</button>
                  <button className="hover:text-black">LinkedIn</button>
                  <button className="hover:text-black">Pinterest</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        {/* Related Products Section */}
        <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      {relatedProducts && relatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((related) => (
              <div
                key={related._id}
                className="border border-gray-200 rounded-lg p-4 shadow-gray-500/60 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={related.imageUrl || "/placeholder.png"}
                  alt={related.title}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-4">{related.title}</h3>
                <p className="text-gray-500">Rs. {related.price}</p>
                <div className="flex items-center mt-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < related.reviews ? "text-yellow-500" : "text-yellow-600"
                        }`}
                      />
                    ))}
                </div>
                <Link
                  href={`/product/${related._id}`}
                  className="text-sky-500 mt-4 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-sky-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-sky-400`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No related products available.</p>
      )}
    </section>

      </main>
    </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const productQuery = `
    *[_type == "product" && _id == "${id}"] {
      _id,
      title,
      price,
      description,
      "imageUrl": productImage.asset->url,
      reviews
    }[0]
  `;
  const relatedProductsQuery = `
    *[_type == "product" && _id != "${id}" && title != "${context.query.title}"] | order(title asc) {
      _id,
      title,
      price,
      "imageUrl": productImage.asset->url,
      reviews
    }
  `;

  const product = await sanity.fetch(productQuery);
  const relatedProducts = (await sanity.fetch(relatedProductsQuery)) || [];

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product, relatedProducts },
  };
};



export default ProductPage;
