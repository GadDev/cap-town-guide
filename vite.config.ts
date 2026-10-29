import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icons/icon.svg','icons/icon-192.png','icons/icon-512.png','guides/*.pdf','maps/*.svg'],
    manifest: { name: 'Cape Town Explorer — Family Field Notes', short_name: 'Cape Explorer', description: '12 days in Cape Town, even offline', theme_color: '#153936', background_color: '#f9f5ed', display: 'standalone', start_url: '/', scope: '/', icons: [ {src:'/icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'}, {src:'/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}, {src:'/icons/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'} ] },
    workbox: { navigateFallback: '/index.html', globPatterns:['**/*.{js,css,html,svg,png,webp,avif,woff2,pdf,json}'], maximumFileSizeToCacheInBytes: 12 * 1024 * 1024, cleanupOutdatedCaches:true, clientsClaim:true, skipWaiting:true,
      runtimeCaching:[{urlPattern:/^https:\/\/images\.unsplash\.com\//,handler:'CacheFirst',options:{cacheName:'destination-photography',expiration:{maxEntries:24,maxAgeSeconds:60*60*24*21},cacheableResponse:{statuses:[0,200]}}}]
    }
  })],
  build:{target:'es2022'}
});
