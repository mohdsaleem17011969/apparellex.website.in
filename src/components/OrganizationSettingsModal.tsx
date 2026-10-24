import React, { useState, useEffect } from 'react';
import { 
  SiteSettings, 
  BoardMember, 
  MicroHubInfo 
} from '../data/siteSettings';
import { 
  X, 
  Building2, 
  Sparkles, 
  Briefcase, 
  Layers, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  MapPin, 
  Bike, 
  Clock, 
  Phone, 
  Mail,
  Image as ImageIcon
} from 'lucide-react';

export interface OrganizationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onSave: (updated: SiteSettings) => void;
}

type OrgTab = 'company' | 'founder' | 'directors' | 'logistics';

export const OrganizationSettingsModal: React.FC<OrganizationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<OrgTab>('company');
  const [formData, setFormData] = useState<SiteSettings>(settings);

  // Editing Director inline state
  const [editingDirectorIndex, setEditingDirectorIndex] = useState<number | null>(null);
  const [newDirector, setNewDirector] = useState<BoardMember>({
    name: '',
    role: '',
    department: 'Executive Board',
    bio: '',
    image: '',
    email: '',
    linkedin: '',
    appointedYear: '2025',
  });

  // Editing Micro-Hub inline state
  const [editingHubId, setEditingHubId] = useState<string | null>(null);
  const [newHub, setNewHub] = useState<MicroHubInfo>({
    id: '',
    name: '',
    code: '',
    address: '',
    serviceRadiusKm: 4.0,
    activeCouriers: 4,
    electricFleetCount: 6,
    avgFulfillmentMins: 8.5,
    status: 'Fully Operational',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
    }
  }, [isOpen, settings]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Director operations
  const handleAddDirector = () => {
    if (!newDirector.name.trim() || !newDirector.role.trim()) {
      alert('Please enter director name and role.');
      return;
    }
    const dir: BoardMember = {
      ...newDirector,
      id: `dir-${Date.now()}`,
      image: newDirector.image?.trim() || 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80',
    };
    setFormData((prev) => ({
      ...prev,
      directors: [...prev.directors, dir],
    }));
    setNewDirector({
      name: '',
      role: '',
      department: 'Executive Board',
      bio: '',
      image: '',
      email: '',
      linkedin: '',
      appointedYear: '2025',
    });
  };

  const handleRemoveDirector = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      directors: prev.directors.filter((_, i) => i !== index),
    }));
    if (editingDirectorIndex === index) {
      setEditingDirectorIndex(null);
    }
  };

  // Micro-hub operations
  const handleAddHub = () => {
    if (!newHub.name.trim() || !newHub.code.trim()) {
      alert('Please enter hub name and unique code.');
      return;
    }
    const hub: MicroHubInfo = {
      ...newHub,
      id: `hub-${Date.now()}`,
      code: newHub.code.toUpperCase().trim(),
    };
    setFormData((prev) => ({
      ...prev,
      microHubs: [...(prev.microHubs || []), hub],
    }));
    setNewHub({
      id: '',
      name: '',
      code: '',
      address: '',
      serviceRadiusKm: 4.0,
      activeCouriers: 4,
      electricFleetCount: 6,
      avgFulfillmentMins: 8.5,
      status: 'Fully Operational',
    });
  };

  const handleRemoveHub = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      microHubs: (prev.microHubs || []).filter((h) => h.id !== id),
    }));
    if (editingHubId === id) {
      setEditingHubId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111113]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF5757] flex items-center justify-center text-white shadow-lg shadow-[#FF5757]/20">
              <Building2 className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Organization Master Settings
              </h2>
              <p className="text-xs text-stone-400">
                Configure corporate identity, founder biography, board of directors, and logistics micro-hubs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-white/10 flex items-center gap-2 bg-[#121214] overflow-x-auto">
          {[
            { id: 'company', label: 'Company Identity', icon: Building2 },
            { id: 'founder', label: 'Founder & Bio', icon: Sparkles },
            { id: 'directors', label: 'Board of Directors', icon: Briefcase, count: formData.directors.length },
            { id: 'logistics', label: 'Logistics Micro-Hubs', icon: Layers, count: formData.microHubs?.length || 0 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as OrgTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#FF5757] text-[#FF5757] bg-white/5 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF5757]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-[#FF5757]/20 text-[#FF5757]' : 'bg-white/5 text-stone-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-stone-800 text-xs">
          
          {/* 1. COMPANY TAB */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Company Name & Corporate Profile
                </h3>
                <p className="text-stone-400 text-xs mt-0.5">
                  General brand identity, legal entity name, and customer communication channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Company Brand Name (Header & Storefront Wordmark)
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-[#FF5757] focus:outline-none"
                    placeholder="Apparellex"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Legal Registered Entity Name
                  </label>
                  <input
                    type="text"
                    value={formData.legalName || ''}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF5757] focus:outline-none"
                    placeholder="Apparellex Technologies Private Limited"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Brand Tagline / Mission Motto
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF5757] focus:outline-none"
                    placeholder="Hyperlocal 10-Minute Curated Luxury & Streetwear"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Support Care Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#FF5757] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Customer Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF5757] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Registration Identification Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber || ''}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#FF5757] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Tax EIN / Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.taxIdentification || ''}
                    onChange={(e) => setFormData({ ...formData, taxIdentification: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#FF5757] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Corporate Headquarters Address
                  </label>
                  <input
                    type="text"
                    value={formData.headquarters || ''}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF5757] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. FOUNDER & BIO TAB */}
          {activeTab === 'founder' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Founder Biography & Brand Story
                </h3>
                <p className="text-stone-400 text-xs mt-0.5">
                  Executive leadership presentation, portrait imagery, and the core brand manifesto.
                </p>
              </div>

              {/* Founder Image Live Preview + URL input */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-stone-800 shrink-0 border border-white/20 shadow-md">
                  <img
                    src={formData.founderImage}
                    alt={formData.founderName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 w-full space-y-1">
                  <label className="block text-stone-300 text-[11px] font-semibold">
                    Founder Portrait Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.founderImage}
                    onChange={(e) => setFormData({ ...formData, founderImage: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-[11px] focus:border-[#FF5757] focus:outline-none"
                    placeholder="https://..."
                  />
                  <p className="text-[10px] text-stone-400">
                    Live preview updates automatically. Displayed on the homepage and About Us story spotlight.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Founder & CEO Name
                  </label>
                  <input
                    type="text"
                    value={formData.founderName}
                    onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-sm focus:border-[#FF5757] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Executive Role / Official Title
                  </label>
                  <input
                    type="text"
                    value={formData.founderRole}
                    onChange={(e) => setFormData({ ...formData, founderRole: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#FF5757] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                    Founder Quote / Personal Vision Statement
                  </label>
                  <textarea
                    rows={2}
                    value={formData.founderQuote || ''}
                    onChange={(e) => setFormData({ ...formData, founderQuote: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white italic focus:border-[#FF5757] focus:outline-none"
                    placeholder="Short executive quote shown under the portrait..."
                  />
                </div>

                <div className="sm:col-span-2 space-y-3 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                      About Us Section Headline
                    </label>
                    <input
                      type="text"
                      value={formData.aboutTitle}
                      onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-bold focus:border-[#FF5757] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                      Founder Bio / Brand Origin Story
                    </label>
                    <textarea
                      rows={3}
                      value={formData.aboutIntro}
                      onChange={(e) => setFormData({ ...formData, aboutIntro: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white leading-relaxed focus:border-[#FF5757] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1 font-semibold">
                      Full Brand Manifesto & Mission Statement
                    </label>
                    <textarea
                      rows={4}
                      value={formData.aboutBody}
                      onChange={(e) => setFormData({ ...formData, aboutBody: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white leading-relaxed focus:border-[#FF5757] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. BOARD OF DIRECTORS TAB */}
          {activeTab === 'directors' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Board of Directors Roster
                  </h3>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Add, edit, or adjust directors, bios, and executive board credentials.
                  </p>
                </div>
                <span className="text-xs font-mono text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                  {formData.directors.length} Directors Appointed
                </span>
              </div>

              {/* Add New Director Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#FF5757]" />
                  <span>Appoint New Director</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-400 text-[10px] mb-1">Director Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Amelia Hart"
                      value={newDirector.name}
                      onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[10px] mb-1">Board Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Board Director & Strategy"
                      value={newDirector.role}
                      onChange={(e) => setNewDirector({ ...newDirector, role: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[10px] mb-1">Portrait Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newDirector.image || ''}
                      onChange={(e) => setNewDirector({ ...newDirector, image: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-stone-400 text-[10px] mb-1">Executive Biography</label>
                    <input
                      type="text"
                      placeholder="Summary of experience, advisory mandate, or strategic focus..."
                      value={newDirector.bio || ''}
                      onChange={(e) => setNewDirector({ ...newDirector, bio: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAddDirector}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Board</span>
                  </button>
                </div>
              </div>

              {/* Existing Directors List */}
              <div className="space-y-3">
                {formData.directors.map((dir, idx) => (
                  <div
                    key={dir.id || idx}
                    className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={dir.image || 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80'}
                        alt={dir.name}
                        className="w-12 h-14 rounded-lg object-cover bg-stone-800 shrink-0 border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        {editingDirectorIndex === idx ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={dir.name}
                              onChange={(e) => {
                                const copy = [...formData.directors];
                                copy[idx] = { ...copy[idx], name: e.target.value };
                                setFormData({ ...formData, directors: copy });
                              }}
                              className="bg-black/60 border border-white/20 rounded px-2 py-1 text-white text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={dir.role}
                              onChange={(e) => {
                                const copy = [...formData.directors];
                                copy[idx] = { ...copy[idx], role: e.target.value };
                                setFormData({ ...formData, directors: copy });
                              }}
                              className="bg-black/60 border border-white/20 rounded px-2 py-1 text-white text-xs block"
                            />
                            <input
                              type="text"
                              value={dir.image || ''}
                              placeholder="Image URL"
                              onChange={(e) => {
                                const copy = [...formData.directors];
                                copy[idx] = { ...copy[idx], image: e.target.value };
                                setFormData({ ...formData, directors: copy });
                              }}
                              className="bg-black/60 border border-white/20 rounded px-2 py-1 text-white text-[10px] font-mono block w-full"
                            />
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold text-white text-sm">{dir.name}</h4>
                            <p className="text-xs text-[#FF5757] font-semibold">{dir.role}</p>
                            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{dir.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setEditingDirectorIndex(editingDirectorIndex === idx ? null : idx)
                        }
                        className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition ${
                          editingDirectorIndex === idx
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {editingDirectorIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveDirector(idx)}
                        className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                        title="Remove Director"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. LOGISTICS & MICRO-HUBS TAB */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Logistics & Micro-Hub Dark Stores
                  </h3>
                  <p className="text-stone-400 text-xs mt-0.5">
                    Manage hyperlocal fulfillment centers, courier counts, and guaranteed delivery radii.
                  </p>
                </div>
                <span className="text-xs font-mono text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                  {(formData.microHubs || []).length} Hubs Commissioned
                </span>
              </div>

              {/* Add New Hub Card */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#FF5757]" />
                  <span>Commission New Micro-Hub</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-stone-400 text-[10px] mb-1">Hub Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Midtown East Micro-Hub"
                      value={newHub.name}
                      onChange={(e) => setNewHub({ ...newHub, name: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[10px] mb-1">Hub Code</label>
                    <input
                      type="text"
                      placeholder="HUB-MDT-04"
                      value={newHub.code}
                      onChange={(e) => setNewHub({ ...newHub, code: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[10px] mb-1">Coverage Radius (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newHub.serviceRadiusKm}
                      onChange={(e) => setNewHub({ ...newHub, serviceRadiusKm: Number(e.target.value) })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[10px] mb-1">Active Couriers</label>
                    <input
                      type="number"
                      min="1"
                      value={newHub.activeCouriers}
                      onChange={(e) => setNewHub({ ...newHub, activeCouriers: Number(e.target.value) })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-stone-400 text-[10px] mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="Physical dark store street location..."
                      value={newHub.address}
                      onChange={(e) => setNewHub({ ...newHub, address: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleAddHub}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Hub</span>
                  </button>
                </div>
              </div>

              {/* Existing Micro-Hubs List */}
              <div className="space-y-3">
                {(formData.microHubs || []).map((hub) => (
                  <div
                    key={hub.id}
                    className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#FF5757] bg-black/60 px-2 py-0.5 rounded border border-white/5">
                          {hub.code}
                        </span>
                        <h4 className="font-bold text-white text-sm">{hub.name}</h4>
                      </div>
                      <p className="text-xs text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{hub.address}</span>
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                        <span>Radius: <b className="text-white font-mono">{hub.serviceRadiusKm} km</b></span>
                        <span>Couriers: <b className="text-white font-mono">{hub.activeCouriers}</b></span>
                        <span>Avg SLA: <b className="text-emerald-400 font-mono">{hub.avgFulfillmentMins}m</b></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={hub.status}
                        onChange={(e) => {
                          const copy = (formData.microHubs || []).map((h) =>
                            h.id === hub.id ? { ...h, status: e.target.value as MicroHubInfo['status'] } : h
                          );
                          setFormData({ ...formData, microHubs: copy });
                        }}
                        className="bg-black/60 text-white rounded px-2 py-1 text-xs border border-white/10 focus:outline-none"
                      >
                        <option value="Fully Operational">Fully Operational</option>
                        <option value="High Demand">High Demand</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                      <button
                        onClick={() => handleRemoveHub(hub.id)}
                        className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                        title="Remove Hub"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-white/10 flex items-center justify-between bg-[#111113]">
          <span className="text-xs text-stone-400">
            Changes will update site settings and reflect in real time.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Organization Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
