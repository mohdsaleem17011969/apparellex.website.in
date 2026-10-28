export interface Product {
  id: string;
  name: string;
  category: 'urban-street' | 'minimalist-zen' | 'unique-trends';
  categoryLabel: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  estDeliveryMins: number;
  image: string;
  description: string;
  fabric: string;
  fit: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  tag?: string;
  isNewDrop?: boolean;
  releaseDate?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Heavyweight Raw-Edge Hoodie',
    category: 'urban-street',
    categoryLabel: 'Urban Street',
    gender: 'unisex',
    price: 2999,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 142,
    estDeliveryMins: 9,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80',
    description: 'Constructed from 480 GSM organic French terry cotton. Drop-shoulder silhouette with raw destroyed hemline and architectural oversized hood.',
    fabric: '100% GOTS Certified French Terry (480 GSM)',
    fit: 'Boxy Drop-Shoulder Oversized',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Charcoal', hex: '#262626' },
      { name: 'Bone White', hex: '#F3EFE6' },
      { name: 'Crimson Red', hex: '#FF5757' }
    ],
    tag: 'LIMITED RUN',
    isNewDrop: true,
    releaseDate: '2026-10-25',
  },
  {
    id: 'prod-2',
    name: 'Architectural Poplin Relaxed Shirt',
    category: 'minimalist-zen',
    categoryLabel: 'Minimalist Zen',
    gender: 'men',
    price: 2499,
    originalPrice: 3299,
    rating: 4.8,
    reviewsCount: 88,
    estDeliveryMins: 8,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    description: 'Clean-line silhouette crafted from double-twisted compact cotton poplin. Mother-of-pearl tonal buttons with concealed placket.',
    fabric: '100% Egyptian Giza Compact Cotton',
    fit: 'Relaxed Tailored',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Chalk White', hex: '#FAF9F6' },
      { name: 'Oatmeal Taupe', hex: '#C2B8A3' }
    ],
    tag: 'ESSENTIAL',
    isNewDrop: false,
    releaseDate: '2026-09-18',
  },
  {
    id: 'prod-3',
    name: 'Sculptural Asymmetric Runway Coat',
    category: 'unique-trends',
    categoryLabel: 'Unique Trends',
    gender: 'women',
    price: 5999,
    originalPrice: 7999,
    rating: 5.0,
    reviewsCount: 64,
    estDeliveryMins: 11,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    description: 'High-octane statement piece designed for runway impact. Dynamic sculptural collar with magnetic quick-closure and waist belt cinch.',
    fabric: 'Bonded Tech Wool Blend with Water-Repellent Nano Coating',
    fit: 'Sculptural Tailored',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Signature Apparellex Red', hex: '#FF5757' },
      { name: 'Midnight Onyx', hex: '#111111' }
    ],
    tag: 'RUNWAY EXCLUSIVE',
    isNewDrop: true,
    releaseDate: '2026-10-24',
  },
  {
    id: 'prod-4',
    name: 'Modular Technical Cargo Trousers',
    category: 'urban-street',
    categoryLabel: 'Urban Street',
    gender: 'men',
    price: 3499,
    originalPrice: 4499,
    rating: 4.9,
    reviewsCount: 119,
    estDeliveryMins: 10,
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80',
    description: 'Built with durable ripstop fabric, waterproof zip enclosures, articulated knee darts, and magnetic cinch straps at the ankles.',
    fabric: 'Cordura Ripstop Nylon Blend',
    fit: 'Tapered Utility Cargo',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Matte Black', hex: '#181818' },
      { name: 'Military Olive', hex: '#4A5340' }
    ],
    tag: 'BESTSELLER',
    isNewDrop: false,
    releaseDate: '2026-10-02',
  },
  {
    id: 'prod-5',
    name: 'Pleated Zen Flow Wide Pant',
    category: 'minimalist-zen',
    categoryLabel: 'Minimalist Zen',
    gender: 'women',
    price: 2899,
    originalPrice: 3699,
    rating: 4.8,
    reviewsCount: 76,
    estDeliveryMins: 9,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    description: 'Fluid drape with precision front pleats. Designed for effortless grace, day-to-night movement, and all-season luxury comfort.',
    fabric: 'Sustainable TENCEL™ Modal & Virgin Wool Weave',
    fit: 'High-Rise Wide Leg',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sand Dune', hex: '#E0D7C6' },
      { name: 'Onyx', hex: '#1A1A1A' }
    ],
    tag: 'NEW ARRIVAL',
    isNewDrop: true,
    releaseDate: '2026-10-27',
  },
  {
    id: 'prod-6',
    name: 'Cybernetic Chrome Oversized Bomber',
    category: 'unique-trends',
    categoryLabel: 'Unique Trends',
    gender: 'unisex',
    price: 4999,
    originalPrice: 6499,
    rating: 4.9,
    reviewsCount: 93,
    estDeliveryMins: 12,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
    description: 'Liquid metallic sheen with thermal insulated lining. Heavy-gauge metal zipper, utility sleeve pocket, and rib-knit cuffs.',
    fabric: 'Reflective Polyamide Shell with Primaloft Micro Insulation',
    fit: 'Voluminous Bomber Fit',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Gunmetal Silver', hex: '#9E9E9E' },
      { name: 'Pitch Black', hex: '#0B0B0B' }
    ],
    tag: 'DROPPING FAST',
    isNewDrop: true,
    releaseDate: '2026-10-28',
  },
  {
    id: 'prod-7',
    name: 'Heavy Ribbed Cashmere Mockneck',
    category: 'minimalist-zen',
    categoryLabel: 'Minimalist Zen',
    gender: 'unisex',
    price: 3999,
    originalPrice: 5199,
    rating: 5.0,
    reviewsCount: 52,
    estDeliveryMins: 8,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80',
    description: 'Pure Mongolian grade-A cashmere. Ribbed neck, hem, and cuffs engineered to maintain shape over decades of wear.',
    fabric: '100% Grade-A Mongolian Cashmere (7-Gauge)',
    fit: 'Relaxed Classic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory Cream', hex: '#FDFBF7' },
      { name: 'Heather Smoke', hex: '#7D7D7D' }
    ],
    tag: 'PREMIUM LUXURY',
    isNewDrop: false,
    releaseDate: '2026-09-28',
  },
  {
    id: 'prod-8',
    name: 'Acid Washed Deconstructed Denim Jacket',
    category: 'urban-street',
    categoryLabel: 'Urban Street',
    gender: 'men',
    price: 3799,
    originalPrice: 4899,
    rating: 4.7,
    reviewsCount: 110,
    estDeliveryMins: 10,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80',
    description: '14oz rigid Japanese selvedge denim. Individually hand-distressed with vintage acid enzyme wash and matte black custom hardware.',
    fabric: '14oz Japanese Kuroki Selvedge Denim',
    fit: 'Slightly Cropped Boxy Cut',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Acid Indigo', hex: '#4B6584' },
      { name: 'Vintage Stone Black', hex: '#2C3A47' }
    ],
    tag: 'HAND FINISHED',
    isNewDrop: false,
    releaseDate: '2026-09-10',
  },
  {
    id: 'prod-9',
    name: 'Draped Kinetic High-Neck Midi Dress',
    category: 'unique-trends',
    categoryLabel: 'Unique Trends',
    gender: 'women',
    price: 4499,
    originalPrice: 5799,
    rating: 4.9,
    reviewsCount: 84,
    estDeliveryMins: 9,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
    description: 'Sculpted drape that shifts dynamically with every stride. Dramatic high neckline with concealed side zip and asymmetrical hem.',
    fabric: 'Fluid Crepe de Chine with Double Weft',
    fit: 'Fluid Architectural Fit',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Apparellex Coral', hex: '#FF5757' },
      { name: 'Night Obsidian', hex: '#161616' }
    ],
    tag: 'EXCLUSIVE DROP',
    isNewDrop: true,
    releaseDate: '2026-10-26',
  }
];

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}
