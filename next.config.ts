import type { NextConfig } from "next";
import { mod } from "three/tsl";

const nextConfig: NextConfig = {

  images: {
    domains: ["images.unsplash.com", "picsum.photos", "placeimg.com", "storage.googleapis.com", "cdn.worldvectorlogo.com", "git-scm.com", "encrypted-tbn0.gstatic.com", "upload.wikimedia.org", "images.icon-icons.com", "media.istockphoto.com", "cdn-icons-png.flaticon.com"]
  },

  serverExternalPackages: ['@react-pdf/renderer', '@prisma/client', 'prisma'],
};

// module.exports = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// }

export default nextConfig;
