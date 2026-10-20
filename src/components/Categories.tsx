import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategoriesProps {
  onSelectCategory: (category: 'urban-street' | 'minimalist-zen' | 'unique-trends') => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const [imgErrors, setImgErrors] = useState<{ [key: string]: boolean }>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const categories = [
    {
      id: 'urban-street' as const,
      title: 'URBAN STREET',
      tagline: 'Oversized hoodies & limited drops.',
      imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
      itemCount: '18 Drops Available',
      badge: 'HIGH DEMAND',
    },
    {
      id: 'minimalist-zen' as const,
      title: 'MINIMALIST ZEN',
      tagline: 'Clean lines, premium fabrics.',
      imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      itemCount: '14 Drops Available',
      badge: 'PURE LUXURY',
    },
    {
      id: 'unique-trends' as const,
      title: 'UNIQUE TRENDS',
      tagline: 'Statement pieces for the bold.',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      itemCount: '11 Drops Available',
      badge: 'RUNWAY EDIT',
    },
  ];

  return (
    <section id="categories" className="py-20 md:py-28 container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-[#FF5757] font-bold block mb-2">
            Curated Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-fashion tracking-tight text-[#1a1a1a]">
            EXPLORE CATEGORIES
          </h2>
        </div>
        <p className="text-xs md:text-sm text-black/60 max-w-md mt-4 md:mt-0 leading-relaxed font-light">
          Each line is produced in limited batches and stocked in neighborhood micro-hubs for instantaneous 10-minute dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative overflow-hidden h-[460px] md:h-[520px] rounded-sm cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-neutral-900"
          >
            {/* Background Image or CSS Fallback */}
            {!imgErrors[cat.id] ? (
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={() => handleImgError(cat.id)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-stone-800 to-zinc-950 flex items-center justify-center p-8">
                <span className="text-2xl font-bold font-fashion text-white/50">{cat.title}</span>
              </div>
            )}

            {/* Measured Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 transition-colors duration-300" />

            {/* Top Subtle Label */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs text-white/80">
              <span className="text-[11px] uppercase tracking-widest font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded">
                {cat.badge}
              </span>
              <span className="text-[11px] tracking-wide text-white/70">
                {cat.itemCount}
              </span>
            </div>

            {/* Card Content & Action */}
            <div className="absolute inset-0 flex items-end p-8">
              <div className="w-full">
                <h3 className="text-white text-3xl font-extrabold font-fashion tracking-tight mb-1 group-hover:text-[#FF5757] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-white/80 text-sm mb-5 font-light">
                  {cat.tagline}
                </p>

                <div className="inline-flex items-center gap-2 text-white border-b-2 border-white pb-1 group-hover:border-[#FF5757] group-hover:text-[#FF5757] transition-all text-xs uppercase tracking-widest font-bold">
                  <span>View Collection</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
