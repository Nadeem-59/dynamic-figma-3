"use client";
import React, { useEffect, useState } from "react";
import createClient from "@sanity/client";
import Image from "next/image";
import Link from "next/link";
import { Star } from 'lucide-react';

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
  discountPercentage: number;
  imageUrl: string;
  reviews: number;
  tags: string[];
}

const ProductCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = async () => {
    try {
      const query = `
        *[_type == "product"] {
          _id,
          title,
          price,
          discountPercentage,
          "imageUrl": productImage.asset->url,
          reviews,
          tags
        }
      `;
      const data = await sanity.fetch(query);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main>
      <h1 className="text-4xl font-bold mb-4 text-center mt-4">Products List</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Here is the list of my amazing high-quality rated shop products
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {paginatedProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-gray-500/60 hover:shadow-gray-600/50 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/product/${product._id}`} legacyBehavior>
              <a className="block">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-gray-800 font-bold">${product.price}</p>
                      {product.discountPercentage > 0 && (
                        <p className="text-sm text-green-600">
                          {product.discountPercentage}% Off
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-200 text-gray-800 rounded-full px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center mt-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < product.reviews ? "text-yellow-500" : "text-yellow-600"
                          }`}
                        />
                      ))}
                  </div>
                  <Link href={`/product/${product._id}`} className="text-sky-500">View Details</Link>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-2 mb-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-sky-500 text-white"
                : "bg-gray-300 text-black hover:bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 rounded-md bg-gray-100 text-black hover:bg-gray-200"
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
};

export default ProductCards;