// const APP_PREFIX = 'my-site-cache-';
// const VERSION = 'v1';
// const CACHE_NAME = APP_PREFIX + VERSION;

// const FILES_TO_CACHE = [
//   './index.html',
//   './css/styles.css',
//   './js/idb.js',
//   './js/index.js'
// ];

// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       console.log(`Installing Cache: ${CACHE_NAME}`)
//       return cache.addAll(FILES_TO_CACHE)
//     })
//   )
// });

// self.addEventListener('activate', function(e) {
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       let cacheKeepList = keyList.filter(function(key) {
//         return key.indexOf(APP_PREFIX)
//       })
//       cacheKeepList.push(CACHE_NAME)
//       return Promise.all(keyList.map(function(key, i) {
//         if (cacheKeepList.indexOf(key) === -1) {
//           console.log(`Deleting Cache: ${keyList[i]}`)
//           return caches.delete(keyList[i])
//         }
//       }))
//     })
//   )
// });

// self.addEventListener('fetch', function(event) {
//   if (event.request.url.includes('/api/')) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then(function(cache) {
//         return fetch(event.request)
//           .then(function(response) {
//             if (response.status = 200) {
//               cache.put(event.request.url, response.clone())
//             }
//             return response
//           })
//           .catch(err => {
//             return cache.match(event.request)
//           })
//       })
//         .catch(err => console.log(err))
//     )
//     return
//   }
//   event.respondWith(
//     fetch(event.request).catch(function() {
//       return caches.match(event.request)
//         .then(function(response) {
//           if (response) {
//             return response
//           } else if (event.request.headers.get('accept').includes('text/html')) {
//             return caches.match('/')
//           }
//         })
//     })
//   )
// });

// Service workers do NOT need webpack to work. Because the application is already using webpack, 
// we'll only need to prepend the names of the JavaScript files to cache in the dist/ folder. 
// Other than that, the steps to add a service worker to an application without webpack are 
// exactly the same.

const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// Note that we didn't include the images in assets. This was intentional. Every browser has a cache 
// limit, which can range anywhere from 50 MB to 250 MB. We've prioritized caching the JavaScript and 
// HTML files so that the site is at least functional.
const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js"
];

// service workers run before the window object has even been created. So instead we use the self 
// keyword to instantiate listeners on the service worker. The context of self here refers to the 
// service worker object.
self.addEventListener('install', function (e) {

    // We use e.waitUntil to tell the browser to wait until the work is complete before terminating 
    // the service worker. This ensures that the service worker doesn't move on from the installing 
    // phase until it's finished executing all of its code.
    e.waitUntil(

        // We use caches.open to find the specific cache by name, then add every file in the 
        // FILES_TO_CACHE array to the cache
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// In the activation step, we clear out any old data from the cache and, in the same step, 
// tell the service worker how to manage caches.
self.addEventListener('activate', function (e) {
    e.waitUntil(
        // .keys() returns an array of all cache names, which we're calling keyList. 
        caches.keys().then(function (keyList) {
            // Because we may host many sites from the same URL, we should filter out caches that have 
            // the app prefix. We'll capture the ones that have that prefix, stored in APP_PREFIX, and 
            // save them to an array called cacheKeeplist using the .filter() method.
            let cacheKeeplist = keyList.filter(function (key) {
            return key.indexOf(APP_PREFIX);
            });
            // add the current cache to the keeplist in the activate event listener.
            cacheKeeplist.push(CACHE_NAME);
            // returns a Promise that resolves once all old versions of the cache have been deleted.
            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i] );
                    return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

// listen for the fetch event, log the URL of the requested resource, and then begin to define how 
// we will respond to the request.
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    // check to see if the request is stored in the cache or not. If it is stored in the cache, 
    // e.respondWith will deliver the resource directly from the cache; otherwise the resource 
    // will be retrieved normally
    e.respondWith(
        // use .match() to determine if the resource already exists in caches
        caches.match(e.request).then(function (request) {
            // If it does, we'll log the URL to the console with a message and then return the cached resource
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            //  if the resource is not in caches, we allow the resource to be retrieved from the online network as usual
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        // You can omit if/else for console.log & put one line below like this too.
        // return request || fetch(e.request)
        })
    )
})