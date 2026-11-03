/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Proxy API calls so the HTTPOnly JWT cookie (set by this app) is sent to Express on the same origin.
    return [{ source: "/server/:path*", destination: `${process.env.API_URL || "http://localhost:5000"}/:path*` }];
  },
};
export default nextConfig;
