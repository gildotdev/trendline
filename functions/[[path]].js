// Catch-all route handler for client-side routing
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  // If it's an API request, let it through to the API handlers
  if (pathname.startsWith('/api/')) {
    return context.next();
  }
  
  // If it's a static asset request (has file extension like .js, .css, .png, etc), let it through
  const hasExtension = pathname.match(/\.[a-zA-Z0-9]+$/);
  if (hasExtension) {
    return context.next();
  }
  
  // For all other routes (including /p/*), serve index.html
  // This enables client-side routing
  const response = await context.env.ASSETS.fetch(new URL('/index.html', url.origin));
  
  // Return a new response with the correct status code
  return new Response(response.body, {
    status: 200,
    headers: response.headers
  });
}
