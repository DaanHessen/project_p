# Cache Busting Guide for daanhessen.nl

## Problem
Users with cached versions of the site see old content even after new deployments.

## Solutions Implemented

### 1. HTML Cache Headers (vercel.json)
- Added `no-cache, no-store, must-revalidate` headers for all HTML files
- Forces browsers to always check for new versions of HTML
- Assets (JS/CSS/images) still cached aggressively with hashes

### 2. Service Worker Auto-Update
- Configured PWA to automatically reload when updates are detected
- Added `skipWaiting` and `clientsClaim` for immediate updates
- Users get new content without manual refresh

### 3. Asset Versioning
- Vite automatically adds content hashes to JS/CSS filenames
- Example: `main-abc123.js` changes to `main-def456.js` on updates
- Browsers always fetch new versions

## For Users with Cached Versions

Users can force clear cache:
- **Chrome/Edge**: Ctrl+Shift+Delete → Clear cache
- **Firefox**: Ctrl+Shift+Delete → Clear cache
- **Safari**: Cmd+Option+E
- **Mobile**: Clear browser cache in settings

## After Deployment

After your next `git push` and Vercel deployment:
1. All HTML files will have no-cache headers
2. Service worker will auto-update on visit
3. New users always get latest version
4. Returning users auto-reload on next visit

## Monitoring

Check if caching works correctly:
1. Open DevTools → Network tab
2. Look for `Cache-Control` headers on HTML files
3. Should see: `no-cache, no-store, must-revalidate`

## Emergency: Force All Users to Update

If you need to force everyone to update immediately:
1. Change the `version` in `package.json`
2. Deploy to Vercel
3. Service worker will detect version change
4. Users auto-reload on next page interaction
