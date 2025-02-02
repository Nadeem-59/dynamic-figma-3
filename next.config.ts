/** @type {import('next').NextConfig} */
const config: import('next').NextConfig = {
  images: {
    domains: ["cdn.sanity.io"], // Add Sanity's image CDN domain here
  },
};

module.exports = config;
