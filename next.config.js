const withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  // PWA Settings
  pwa: {
    dest: "public",
    sw: "/service-worker.js",
    swSrc: "service-worker.js",
    fallbacks: {
      image: "/static/images/error-image.png",
    },
  },
});
