// src/lib/strapi.ts

// 1. Get the URL from .env (fallback to localhost if missing)
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// 2. Helper to get the full image URL
// Strapi returns images as "/uploads/image.jpg", so we need to add the domain
export function getStrapiURL(path = "") {
  return `${STRAPI_URL}${path}`;
}

// 3. Helper to get the full Media URL (for images)
export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return null;
  }

  // Return the full URL if it's already an external link (e.g. AWS S3)
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  // Otherwise prepend the Strapi URL
  return `${STRAPI_URL}${url}`;
}