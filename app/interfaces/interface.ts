export interface ImageFormat {
  thumbnail?: { url: string };
  small?: { url: string };
  medium?: { url: string };
  large?: { url: string };
}

export interface Image {
  id: number;
  url: string;
  formats?: ImageFormat;
}


// --- Types ---
interface Product {
  id: number;
  attributes: {
    title: string;
    price: number;
    description: string;
    slug: string;
  };
}