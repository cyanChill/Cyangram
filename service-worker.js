import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                    Handling Imported Fonts
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const fontRegex = /.*fonts\.googleapis\.com.*$/;
registerRoute(
  ({ url }) => url.origin.match(fontRegex),
  new StaleWhileRevalidate({
    cacheName: "fonts",
    // Refreshes cache once a month
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 30 })],
  })
);

/* 
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
                       Handling Images
  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
*/
const imgRegex = /_next\/(?:image).*$/;
registerRoute(
  ({ url }) => url.pathname.match(imgRegex),
  new StaleWhileRevalidate({
    cacheName: "images",
    // Refreshes cache every 3 days
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 3 })],
  })
);

/* 
  Seeing what's uncaught
*/
registerRoute(
  ({ url }) => {
    console.log(url);
    return false;
  },
  // firebaseImagesRegex,
  new StaleWhileRevalidate({
    cacheName: "uncaught",
    // Refreshes cache once every 3 days
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 3 })],
  })
);
