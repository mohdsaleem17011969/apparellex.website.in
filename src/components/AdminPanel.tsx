import React, { useMemo, useState } from 'react';
import { Product } from '../data/products';
import { SiteSettings, DEFAULT_SITE_SETTINGS, BoardMember, TeamMember, SocialLink } from '../data/siteSettings';
import { 
  Building2, 
  ShoppingBag, 
  Users, 
  Briefcase, 
  Share2, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw 
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  settings?: SiteSettings;
  onUpdateSiteSettings?: (updated: SiteSettings) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (id: string, product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetDefaultProducts: () => void;
}

type AdminTab = 'catalog' | 'company' | 'directors' | 'employees' | 'social';

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
  const category = product.category || 'urban-street';
  const categoryLabel = product.categoryLabel?.trim() || getCategoryLabel(category);
  const price = Math.max(1, Number(product.price) || 1);
  const originalPrice =
    product.originalPrice !== undefined && product.originalPrice !== null && product.originalPrice > 0
      ? Math.max(price, Number(product.originalPrice))
      : undefined;

  return {
    ...product,
    id: product.id?.trim() || `prod-${Date.now()}`,
    name: product.name?.trim() || 'Untitled Product',
    category,
    categoryLabel,
    gender: product.gender || 'unisex',
    price,
    originalPrice,
    rating: Math.min(5, Math.max(1, Number(product.rating) || 4.8)),
    reviewsCount: Math.max(0, Math.floor(Number(product.reviewsCount) || 0)),
    estDeliveryMins: Math.max(1, Math.floor(Number(product.estDeliveryMins) || 10)),
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
  settings = DEFAULT_SITE_SETTINGS,
  onUpdateSiteSettings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaultProducts,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('catalog');
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);

  // Product Form State
  const [form, setForm] = useState<Product>(defaultProduct());
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Director temporary form
  const [newDirector, setNewDirector] = useState<BoardMember>({ name: '', role: '', bio: '' });
  // New Employee temporary form
  const [newEmployee, setNewEmployee] = useState<TeamMember>({ name: '', role: '', image: '' });
  // New Social Link temporary form
  const [newSocial, setNewSocial] = useState<SocialLink>({ label: '', url: '' });

  const productCount = useMemo(() => products.length, [products]);

  const resetForm = () => {
    setForm(defaultProduct());
    setEditingId(null);
  };

  const handleChange = <K extends keyof Product>(field: K, value: Product[K]) => {
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
    setActiveTab('catalog');
  };

  const handleSaveSettings = () => {
    if (onUpdateSiteSettings) {
      onUpdateSiteSettings(siteForm);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  // Director operations
  const handleAddDirector = () => {
    if (!newDirector.name.trim() || !newDirector.role.trim()) return;
    setSiteForm((prev) => ({
      ...prev,
      directors: [...prev.directors, { ...newDirector }],
    }));
    setNewDirector({ name: '', role: '', bio: '' });
  };

  const handleRemoveDirector = (index: number) => {
    setSiteForm((prev) => ({
      ...prev,
      directors: prev.directors.filter((_, i) => i !== index),
    }));
  };

  // Employee operations
  const handleAddEmployee = () => {
    if (!newEmployee.name.trim() || !newEmployee.role.trim()) return;
    setSiteForm((prev) => ({
      ...prev,
      employees: [
        ...prev.employees,
        {
          ...newEmployee,
          image: newEmployee.image?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
        },
      ],
    }));
    setNewEmployee({ name: '', role: '', image: '' });
  };

  const handleRemoveEmployee = (index: number) => {
    setSiteForm((prev) => ({
      ...prev,
      employees: prev.employees.filter((_, i) => i !== index),
    }));
  };

  // Social link operations
  const handleAddSocial = () => {
    if (!newSocial.label.trim() || !newSocial.url.trim()) return;
    setSiteForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { ...newSocial }],
    }));
    setNewSocial({ label: '', url: '' });
  };

  const handleRemoveSocial = (index: number) => {
    setSiteForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-sm border border-black/10 bg-[#FEFCF5] shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 border-b border-black/10 bg-[#FAF8F2] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF5757]">
                Master Administration Suite
              </p>
            </div>
            <h2 className="text-2xl font-black text-[#1a1a1a] font-fashion">
              {siteForm.companyName} Operations Hub
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {savedNotice && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-sm">
                <Check className="w-4 h-4" /> Changes Applied
              </span>
            )}
            {activeTab !== 'catalog' && (
              <button
                onClick={handleSaveSettings}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                Save Site Data
              </button>
            )}
            <div className="rounded-sm bg-white px-3 py-2 text-xs font-bold text-black/70 border border-black/10">
              {productCount} Products
            </div>
            <button
              onClick={onResetDefaultProducts}
              className="bg-black hover:bg-stone-800 text-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Catalog
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-black/10 bg-white px-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'catalog'
                ? 'border-[#FF5757] text-[#FF5757]'
                : 'border-transparent text-black/60 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Product Catalog
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'company'
                ? 'border-[#FF5757] text-[#FF5757]'
                : 'border-transparent text-black/60 hover:text-black'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Company & Founder
          </button>
          <button
            onClick={() => setActiveTab('directors')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'directors'
                ? 'border-[#FF5757] text-[#FF5757]'
                : 'border-transparent text-black/60 hover:text-black'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Board of Directors
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'employees'
                ? 'border-[#FF5757] text-[#FF5757]'
                : 'border-transparent text-black/60 hover:text-black'
            }`}
          >
            <Users className="w-4 h-4" />
            Employees & Team
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'social'
                ? 'border-[#FF5757] text-[#FF5757]'
                : 'border-transparent text-black/60 hover:text-black'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Social Media & Links
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FEFCF5]">
          {/* TAB 1: Product Catalog */}
          {activeTab === 'catalog' && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="border-b border-black/10 pb-2">
                  <h3 className="text-base font-black uppercase tracking-wider text-black">
                    {editingId ? `Edit Product (${editingId})` : 'Add New Runway / Streetwear Piece'}
                  </h3>
                  <p className="text-xs text-black/50">Manage pricing, delivery SLAs, sizes, and specs.</p>
                </div>

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
                    Gender
                    <select
                      value={form.gender}
                      onChange={(e) => handleChange('gender', e.target.value as Product['gender'])}
                      className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                    >
                      <option value="unisex">Unisex</option>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </label>

                  <label className="text-xs font-semibold text-black/70">
                    Price ($)
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => handleChange('price', Number(e.target.value))}
                      className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                    />
                  </label>

                  <label className="text-xs font-semibold text-black/70">
                    Original Price ($)
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
                    Reviews Count
                    <input
                      type="number"
                      value={form.reviewsCount}
                      onChange={(e) => handleChange('reviewsCount', Number(e.target.value))}
                      className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                    />
                  </label>

                  <label className="text-xs font-semibold text-black/70">
                    Guaranteed Delivery (Minutes)
                    <input
                      type="number"
                      value={form.estDeliveryMins}
                      onChange={(e) => handleChange('estDeliveryMins', Number(e.target.value))}
                      className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                    />
                  </label>

                  <label className="text-xs font-semibold text-black/70">
                    Tag / Badge (e.g. NEW, HOT, VIP)
                    <input
                      value={form.tag ?? ''}
                      onChange={(e) => handleChange('tag', e.target.value || undefined)}
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
                      rows={2}
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
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

                  <label className="text-xs font-semibold text-black/70 flex items-center gap-2 pt-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.isNewDrop ?? false}
                      onChange={(e) => handleChange('isNewDrop', e.target.checked)}
                      className="w-4 h-4 rounded text-[#FF5757]"
                    />
                    <span>Highlight as Special Drop / Vault Item</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-3 border-t border-black/10">
                  <button
                    onClick={handleAddOrUpdate}
                    className="bg-[#FF5757] hover:bg-[#e04545] px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-sm transition shadow"
                  >
                    {editingId ? 'Update Product' : 'Add to Catalog'}
                  </button>

                  <button
                    onClick={resetForm}
                    className="bg-white border border-black/15 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black rounded-sm hover:bg-stone-50"
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {/* Product List Right Column */}
              <div className="rounded-sm border border-black/10 bg-white p-4">
                <div className="mb-3 flex items-center justify-between border-b border-black/10 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-black/80">Current Catalog Items</h3>
                  <span className="text-xs text-black/40">{productCount} active</span>
                </div>

                <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                  {products.map((product) => (
                    <div key={product.id} className="rounded-sm border border-black/10 p-3 bg-[#FAF8F2] hover:border-black/30 transition">
                      <div className="flex items-start gap-3">
                        <img src={product.image} alt={product.name} className="h-16 w-16 rounded-sm object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#FF5757]">{product.categoryLabel}</p>
                          <h4 className="truncate text-sm font-bold text-[#1a1a1a]">{product.name}</h4>
                          <p className="mt-1 text-xs font-semibold text-black/70">${product.price}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-black hover:bg-stone-800 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white rounded-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Company & Founder */}
          {activeTab === 'company' && (
            <div className="max-w-4xl space-y-6">
              <div className="border-b border-black/10 pb-2">
                <h3 className="text-base font-black uppercase tracking-wider text-black">Company & Leadership Information</h3>
                <p className="text-xs text-black/50">Manage corporate brand profile, executive summary, and story narrative.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-black/70">
                  Company / Brand Name
                  <input
                    value={siteForm.companyName}
                    onChange={(e) => setSiteForm({ ...siteForm, companyName: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>

                <label className="text-xs font-semibold text-black/70">
                  Official Contact Email
                  <input
                    value={siteForm.email}
                    onChange={(e) => setSiteForm({ ...siteForm, email: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>

                <label className="text-xs font-semibold text-black/70">
                  Founder & CEO Name
                  <input
                    value={siteForm.founderName}
                    onChange={(e) => setSiteForm({ ...siteForm, founderName: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>

                <label className="text-xs font-semibold text-black/70">
                  Founder Role / Title
                  <input
                    value={siteForm.founderRole}
                    onChange={(e) => setSiteForm({ ...siteForm, founderRole: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>

                <label className="text-xs font-semibold text-black/70 sm:col-span-2">
                  Founder Portrait Image URL
                  <input
                    value={siteForm.founderImage}
                    onChange={(e) => setSiteForm({ ...siteForm, founderImage: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>

                <label className="text-xs font-semibold text-black/70 sm:col-span-2">
                  About Section Title
                  <input
                    value={siteForm.aboutTitle}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutTitle: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>

                <label className="text-xs font-semibold text-black/70 sm:col-span-2">
                  About Story - Introduction
                  <textarea
                    rows={3}
                    value={siteForm.aboutIntro}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutIntro: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>

                <label className="text-xs font-semibold text-black/70 sm:col-span-2">
                  About Story - Extended Vision / Body
                  <textarea
                    rows={3}
                    value={siteForm.aboutBody}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutBody: e.target.value })}
                    className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" /> Save Company Details
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Directors & Governance */}
          {activeTab === 'directors' && (
            <div className="max-w-4xl space-y-6">
              <div className="border-b border-black/10 pb-2">
                <h3 className="text-base font-black uppercase tracking-wider text-black">Board of Directors & Governance</h3>
                <p className="text-xs text-black/50">Manage executive board members, roles, and governance briefs.</p>
              </div>

              {/* Add Director Form */}
              <div className="bg-[#FAF8F2] border border-black/10 p-4 rounded-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5757] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add New Director
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Director Name (e.g. Shaikh Kamran)"
                    value={newDirector.name}
                    onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                  <input
                    placeholder="Role (e.g. Founder & CEO, Operations Director)"
                    value={newDirector.role}
                    onChange={(e) => setNewDirector({ ...newDirector, role: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                  <input
                    placeholder="Biography / Governance focus summary"
                    value={newDirector.bio || ''}
                    onChange={(e) => setNewDirector({ ...newDirector, bio: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757] sm:col-span-2"
                  />
                </div>
                <button
                  onClick={handleAddDirector}
                  className="bg-black hover:bg-stone-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Director to Roster
                </button>
              </div>

              {/* List Directors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/70">
                  Active Directors ({siteForm.directors.length})
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {siteForm.directors.map((dir, idx) => (
                    <div key={idx} className="bg-white border border-black/10 p-4 rounded-sm flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-sm text-[#1a1a1a]">{dir.name}</h5>
                        <p className="text-xs text-[#FF5757] font-semibold">{dir.role}</p>
                        {dir.bio && <p className="text-xs text-black/60 mt-2 leading-relaxed">{dir.bio}</p>}
                      </div>
                      <button
                        onClick={() => handleRemoveDirector(idx)}
                        className="text-black/40 hover:text-red-600 transition p-1"
                        title="Remove Director"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" /> Save Board Roster
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Employees & Team */}
          {activeTab === 'employees' && (
            <div className="max-w-4xl space-y-6">
              <div className="border-b border-black/10 pb-2">
                <h3 className="text-base font-black uppercase tracking-wider text-black">Team Members & Employees</h3>
                <p className="text-xs text-black/50">Manage key company personnel, creative leads, and specialists.</p>
              </div>

              {/* Add Employee Form */}
              <div className="bg-[#FAF8F2] border border-black/10 p-4 rounded-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5757] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add New Team Member
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    placeholder="Full Name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                  <input
                    placeholder="Role (e.g. Lead Stylist, Micro-Hub Lead)"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                  <input
                    placeholder="Photo Image URL (optional)"
                    value={newEmployee.image || ''}
                    onChange={(e) => setNewEmployee({ ...newEmployee, image: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </div>
                <button
                  onClick={handleAddEmployee}
                  className="bg-black hover:bg-stone-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Member to Directory
                </button>
              </div>

              {/* List Employees */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/70">
                  Key Employees & Leads ({siteForm.employees.length})
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {siteForm.employees.map((emp, idx) => (
                    <div key={idx} className="bg-white border border-black/10 p-3 rounded-sm flex items-center gap-3">
                      {emp.image ? (
                        <img src={emp.image} alt={emp.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-sm text-[#1a1a1a] truncate">{emp.name}</h5>
                        <p className="text-xs text-[#FF5757] font-semibold truncate">{emp.role}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveEmployee(idx)}
                        className="text-black/40 hover:text-red-600 transition p-1"
                        title="Remove Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" /> Save Team Directory
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Social Media & Links */}
          {activeTab === 'social' && (
            <div className="max-w-4xl space-y-6">
              <div className="border-b border-black/10 pb-2">
                <h3 className="text-base font-black uppercase tracking-wider text-black">Social Media & Digital Outlets</h3>
                <p className="text-xs text-black/50">Manage public social networks and brand links displayed to shoppers.</p>
              </div>

              {/* Add Social Link Form */}
              <div className="bg-[#FAF8F2] border border-black/10 p-4 rounded-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF5757] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add New Channel / Link
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Platform Label (e.g. Instagram, TikTok, LinkedIn, Discord)"
                    value={newSocial.label}
                    onChange={(e) => setNewSocial({ ...newSocial, label: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                  <input
                    placeholder="Channel URL (e.g. https://instagram.com/apparellex)"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    className="border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5757]"
                  />
                </div>
                <button
                  onClick={handleAddSocial}
                  className="bg-black hover:bg-stone-800 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Channel
                </button>
              </div>

              {/* List Social Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black/70">
                  Configured Channels ({siteForm.socialLinks.length})
                </h4>
                <div className="space-y-2">
                  {siteForm.socialLinks.map((soc, idx) => (
                    <div key={idx} className="bg-white border border-black/10 p-3 rounded-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-4 h-4 text-[#FF5757]" />
                        <div>
                          <span className="font-bold text-xs uppercase tracking-wider text-black">{soc.label}</span>
                          <a
                            href={soc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-blue-600 hover:underline truncate max-w-md"
                          >
                            {soc.url}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSocial(idx)}
                        className="text-black/40 hover:text-red-600 transition p-1"
                        title="Remove Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm transition flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" /> Save Social Channels
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
