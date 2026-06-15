/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // These packages use Node.js-only APIs — must not be bundled for browser/edge.
    serverComponentsExternalPackages: ['@react-pdf/renderer', 'pdf-parse', 'mammoth'],
  },
};

export default nextConfig;
