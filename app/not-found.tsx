'use client';

// Fallback for requests outside any locale (the middleware normally redirects those).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#F5F2EE', color: '#1E1F22', padding: 48 }}>
        <h1>Page not found</h1>
        <p>
          <a href="/en" style={{ color: '#8F5524' }}>Premium Hammer by Tomstroj</a>
        </p>
      </body>
    </html>
  );
}
