import React, { useMemo, useState } from 'react';
import { Product } from '../data/products';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (id: string, product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetDefaultProducts: () => void;
}

const getCategoryLabel = (category: Product['category']): string => {
  switch (category) {
    case 'minimalist-zen':
      return 'Minimalist Zen';
    case 'unique-trends':
      return 'Unique Trends';
    case 'urban-street':
    default:
      return 'Urban Street';
  }
};

const defaultProduct = (): Product => ({
  id: `prod-${Date.now()}`,
  name: 'New Product',
  category: 'urban-street',
  categoryLabel: 'Urban Street',
  gender: 'unisex',
  price: 99,
  originalPrice: 129,
  rating: 4.8,
  reviewsCount: 10,
  estDeliveryMins: 10,
  image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  description: 'Simple product description',
  fabric: 'Cotton blend',
  fit: 'Regular fit',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [{ name: 'Black', hex: '#111111' }],
  tag: 'NEW',
  isNewDrop: true,
});

const parseSizes = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseColors = (value: string): { name: string; hex: string }[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((color) => {
      const [name, hex] = color.split(':').map((part) => part.trim());
      return {
        name: name || 'Color',
        hex: hex || '#111111',
      };
    });

const normalizeProductForm = (product: Product): Product => {
  const nextCategory = product.category || 'urban-street';
  const nextCategoryLabel = (product.categoryLabel || '').trim() || getCategoryLabel(nextCategory);

  return {
    ...product,
    id: String(product.id || '').trim() || `prod-${Date.now()}`,
    name: String(product.name || '').trim() || 'Untitled Product',
    category: nextCategory,
    categoryLabel: nextCategoryLabel,
    gender: product.gender || 'unisex',
    price: Number(product.price) || 0,
    originalPrice: Number(product.originalPrice ?? product.price) || 0,
    rating: Number(product.rating) || 0,
    reviewsCount: Number(product.reviewsCount) || 0,
    estDeliveryMins: Number(product.estDeliveryMins) || 0,
    image: String(product.image || '').trim() || defaultProduct().image,
    description: String(product.description || '').trim() || 'No description provided',
    fabric: String(product.fabric || '').trim() || 'Cotton blend',
    fit: String(product.fit || '').trim() || 'Regular fit',
    sizes: Array.isArray(product.sizes) && product.sizes.length ? product.sizes.map((size) => String(size).trim()).filter(Boolean) : ['S', 'M', 'L', 'XL'],
    colors:
      Array.isArray(product.colors) && product.colors.length
        ? product.colors.map((color) => ({
            name: String(color?.name || '').trim() || 'Color',
            hex: String(color?.hex || '').trim() || '#111111',
          }))
        : [{ name: 'Black', hex: '#111111' }],
    tag: product.tag?.trim() || undefined,
    isNewDrop: Boolean(product.isNewDrop),
  };
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaultProducts,
}) => {
  const [form, setForm] = useState<Product>(defaultProduct());
  const [editingId, setEditingId] = useState<string | null>(null);

  const productCount = useMemo(() => products.length, [products]);

  const resetForm = () => {
    setForm(defaultProduct());
    setEditingId(null);
  };

  const handleChange = (field: keyof Product, value: string | number | boolean | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (nextCategory: Product['category']) => {
    setForm((prev) => ({
      ...prev,
      category: nextCategory,
      categoryLabel:
        prev.categoryLabel && prev.categoryLabel.trim() && prev.categoryLabel !== getCategoryLabel(prev.category)
          ? prev.categoryLabel
          : getCategoryLabel(nextCategory),
    }));
  };

  const handleAddOrUpdate = () => {
    const safeForm = normalizeProductForm(form);

    if (editingId) {
      onUpdateProduct(editingId, safeForm);
    } else {
      onAddProduct(safeForm);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({ ...product, categoryLabel: product.categoryLabel || getCategoryLabel(product.category) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-sm border border-black/10 bg-[#FEFCF5] p-6 shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF5757]">Owner access</p>
            <h2 className="text-2xl font-black text-[#1a1a1a]">Catalogue Admin</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-sm bg-white px-3 py-2 text-xs font-bold text-black/70 border border-black/10">
              {productCount} items
            </div>
            <button
              onClick={onResetDefaultProducts}
              className="bg-black text-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm"
            >
              Reset Sample
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-black/70">
                Product Name
                <input
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Product ID
                <input
                  value={form.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Category
                <select
                  value={form.category}
                  onChange={(e) => {
                    const value = e.target.value as Product['category'];
                    handleCategoryChange(value);
                  }}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                >
                  <option value="urban-street">Urban Street</option>
                  <option value="minimalist-zen">Minimalist Zen</option>
                  <option value="unique-trends">Unique Trends</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-black/70">
                Category Label
                <input
                  value={form.categoryLabel || ''}
                  onChange={(e) => handleChange('categoryLabel', e.target.value)}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Gender
                <select
                  value={form.gender}
                  onChange={(e) => handleChange('gender', e.target.value as Product['gender'])}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </label>

              <label className="text-xs font-semibold text-black/70">
                Price
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Original Price
                <input
                  type="number"
                  value={form.originalPrice ?? ''}
                  onChange={(e) => handleChange('originalPrice', Number(e.target.value || 0))}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Rating
                <input
                  type="number"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => handleChange('rating', Number(e.target.value))}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Reviews
                <input
                  type="number"
                  value={form.reviewsCount}
                  onChange={(e) => handleChange('reviewsCount', Number(e.target.value))}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Delivery Minutes
                <input
                  type="number"
                  value={form.estDeliveryMins}
                  onChange={(e) => handleChange('estDeliveryMins', Number(e.target.value))}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70 sm:col-span-2">
                Image URL
                <input
                  value={form.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70 sm:col-span-2">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="mt-1 min-h-[90px] w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Fabric
                <input
                  value={form.fabric}
                  onChange={(e) => handleChange('fabric', e.target.value)}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Fit
                <input
                  value={form.fit}
                  onChange={(e) => handleChange('fit', e.target.value)}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Sizes (comma separated)
                <input
                  value={form.sizes.join(', ')}
                  onChange={(e) => handleChange('sizes', parseSizes(e.target.value))}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Colors (name:#hex, name:#hex)
                <input
                  value={form.colors.map((color) => `${color.name}:${color.hex}`).join(', ')}
                  onChange={(e) => handleChange('colors', parseColors(e.target.value))}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70">
                Tag
                <input
                  value={form.tag ?? ''}
                  onChange={(e) => handleChange('tag', e.target.value || undefined)}
                  className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                />
              </label>

              <label className="text-xs font-semibold text-black/70 flex items-center gap-2 pt-7">
                <input
                  type="checkbox"
                  checked={form.isNewDrop ?? false}
                  onChange={(e) => handleChange('isNewDrop', e.target.checked)}
                />
                New drop
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddOrUpdate}
                className="bg-[#FF5757] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-sm"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </button>

              <button
                onClick={resetForm}
                className="bg-white border border-black/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black rounded-sm"
              >
                Clear Form
              </button>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-white p-3">
            <div className="mb-3 flex items-center justify-between border-b border-black/10 pb-2">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-black/70">Current catalog</h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {products.map((product) => (
                <div key={product.id} className="rounded-sm border border-black/10 p-3 bg-[#FAF8F2]">
                  <div className="flex items-start gap-3">
                    <img src={product.image} alt={product.name} className="h-16 w-16 rounded-sm object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-black/60">{product.categoryLabel}</p>
                      <h4 className="truncate text-sm font-bold text-[#1a1a1a]">{product.name}</h4>
                      <p className="mt-1 text-xs text-black/60">${product.price}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-black px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="flex-1 bg-[#FF5757] px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
