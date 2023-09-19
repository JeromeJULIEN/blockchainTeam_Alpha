/** @type {import('next').NextConfig} */
const nextConfig = {
    // to allow any image source from internet
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
      },
}

module.exports = nextConfig
