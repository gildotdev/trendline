// Catch-all route handler for client-side routing
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // If it's an API request, let it through to the API handlers
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }
  
  // If it's a static asset request (has file extension), let it through
  if (url.pathname.match(/\.\w+$/)) {
    return context.next();
  }
  
  // For all other routes (including /p/*), serve index.html
  return context.env.ASSETS.fetch(new URL('/index.html', url.origin));
}
