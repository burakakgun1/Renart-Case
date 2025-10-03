export interface ProductImages {
  yellow: string;
  rose: string;
  white: string;
}

export interface Product {
  name: string;
  popularityScore: number;
  weight: number;
  images: ProductImages;
  price?: number;
  starRating?: number;
  goldPrice?: number;
}

export interface ApiResponse {
  success: boolean;
  data: Product[];
  goldPrice: number;
  count: number;
  message?: string;
  error?: string;
}

export type ColorOption = 'yellow' | 'rose' | 'white';
