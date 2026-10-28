import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '../data/products';
import { 
  SiteSettings, 
  DEFAULT_SITE_SETTINGS, 
  BoardMember, 
  TeamMember, 
  SocialLink,
  PromoCoupon,
  MicroHubInfo,
  AdminUserAccount,
  AuditLogItem
} from '../data/siteSettings';
import { PastOrderRecord } from './UserProfileModal';
import { OrganizationSettingsModal } from './OrganizationSettingsModal';
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
  RotateCcw,
  X,
  BarChart3,
  Truck,
  Package,
  Shield,
  Tag,
  Search,
  Globe,
  FileText,
  Settings,
  Download,
  Upload,
  Eye,
  AlertTriangle,
  Key,
  Clock,
  Phone,
  Mail,
  MapPin,
  Bike,
  Sparkles,
  Filter,
  Zap,
  RefreshCw,
  Layers,
  ChevronRight,
  Sliders,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  settings?: SiteSettings;
  orders?: PastOrderRecord[];
  onClose?: () => void;
  onUpdateSiteSettings?: (updated: SiteSettings) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (id: string, product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetDefaultProducts: () => void;
  onUpdateOrderHistory?: (orders: PastOrderRecord[]) => void;
}

type AdminSection = 
  | 'overview'
  | 'catalog'
  | 'orders'
  | 'customers'
  | 'employees'
  | 'directors'
  | 'microhubs'
  | 'promos'
  | 'company'
  | 'social'
  | 'seo_legal'
  | 'admins'
  | 'system';

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
  name: 'New Hyper-Drop Garment',
  category: 'urban-street',
  categoryLabel: 'Urban Street',
  gender: 'unisex',
  price: 110,
  originalPrice: 145,
  rating: 4.9,
  reviewsCount: 14,
  estDeliveryMins: 10,
  image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  description: 'Heavyweight compact Japanese cotton with architectural drape and 10-minute micro-courier fulfillment.',
  fabric: '480 GSM French Terry Cotton',
  fit: 'Relaxed Drop-Shoulder Fit',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: [{ name: 'Onyx Black', hex: '#111111' }, { name: 'Bone White', hex: '#F5F5F0' }],
  tag: 'NEW DROP',
  isNewDrop: true,
});

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  settings = DEFAULT_SITE_SETTINGS,
  orders = [],
  onClose,
  onUpdateSiteSettings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaultProducts,
  onUpdateOrderHistory,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Synchronize siteForm if external settings prop updates
  useEffect(() => {
    setSiteForm(settings);
  }, [settings]);


  // Product Catalog State
  const [productForm, setProductForm] = useState<Product>(defaultProduct());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('all');
  const [productSizesInput, setProductSizesInput] = useState('S, M, L, XL');
  const [productColorsInput, setProductColorsInput] = useState('Onyx Black:#111111, Bone White:#F5F5F0');

  // Orders State
  const [orderList, setOrderList] = useState<PastOrderRecord[]>(orders);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<PastOrderRecord | null>(null);

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  // Customer Management Search
  const [customerSearch, setCustomerSearch] = useState('');

  // =========================================================
  // DEDICATED EDIT MODAL STATES FOR ORGANIZATION & STOREFRONT
  // =========================================================
  // 1. Staff / Employee Edit Modal
  const [editingEmployeeIndex, setEditingEmployeeIndex] = useState<number | null>(null);
  const [employeeEditForm, setEmployeeEditForm] = useState<TeamMember | null>(null);

  // 2. Board of Directors Edit Modal
  const [editingDirectorIndex, setEditingDirectorIndex] = useState<number | null>(null);
  const [directorEditForm, setDirectorEditForm] = useState<BoardMember | null>(null);

  // 3. Logistics / Micro-Hub Edit Modal
  const [editingHubId, setEditingHubId] = useState<string | null>(null);
  const [hubEditForm, setHubEditForm] = useState<MicroHubInfo | null>(null);

  // 4. Company Info Edit Modal
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyEditForm, setCompanyEditForm] = useState<Partial<SiteSettings>>({});

  // 5. Founder Details Edit Modal
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);
  const [founderEditForm, setFounderEditForm] = useState<Partial<SiteSettings>>({});

  // 6. Organization Master Settings Modal
  const [isOrgSettingsModalOpen, setIsOrgSettingsModalOpen] = useState(false);

  // Temporary forms for new entity creation
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
  const [newEmployee, setNewEmployee] = useState<TeamMember>({
    name: '',
    role: 'Electric Courier',
    department: 'Logistics Fleet',
    assignedHub: 'Downtown Flagship Hub #1',
    phone: '',
    status: 'Available at Hub',
    vehicle: 'Super73 Electric Cargo',
    image: '',
  });
  const [newCoupon, setNewCoupon] = useState<PromoCoupon>({
    id: '',
    code: '',
    discountPercentage: 15,
    minOrderValue: 75,
    description: '',
    isActive: true,
    usageCount: 0,
    expiryDate: '2026-12-31',
  });
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
  const [newAdmin, setNewAdmin] = useState<AdminUserAccount>({
    id: '',
    name: '',
    email: '',
    role: 'Store Manager',
    status: 'Active',
    lastActive: 'Just added',
  });
  const [newSocial, setNewSocial] = useState<SocialLink>({
    label: '',
    url: '',
    handle: '',
    enabled: true,
  });

  // Handle Escape key to close any active modal or panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isProductModalOpen) {
          setIsProductModalOpen(false);
        } else if (isOrgSettingsModalOpen) {
          setIsOrgSettingsModalOpen(false);
        } else if (editingEmployeeIndex !== null) {
          setEditingEmployeeIndex(null);
        } else if (editingDirectorIndex !== null) {
          setEditingDirectorIndex(null);
        } else if (editingHubId !== null) {
          setEditingHubId(null);
        } else if (isCompanyModalOpen) {
          setIsCompanyModalOpen(false);
        } else if (isFounderModalOpen) {
          setIsFounderModalOpen(false);
        } else if (selectedOrderDetails) {
          setSelectedOrderDetails(null);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onClose,
    isProductModalOpen,
    isOrgSettingsModalOpen,
    editingEmployeeIndex,
    editingDirectorIndex,
    editingHubId,
    isCompanyModalOpen,
    isFounderModalOpen,
    selectedOrderDetails,
  ]);

  const notify = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const logAudit = (action: string, module: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      operator: 'Super Admin (You)',
      action,
      module,
    };
    setSiteForm((prev) => ({
      ...prev,
      auditLogs: [newLog, ...(prev.auditLogs || [])].slice(0, 30),
    }));
  };

  const handleSaveAllSettings = () => {
    if (onUpdateSiteSettings) {
      onUpdateSiteSettings(siteForm);
      logAudit('Saved master site settings configuration', 'Settings');
      notify('Website and administrative configuration saved successfully!');
    }
  };

  // --- CATALOG ACTIONS ---
  const handleOpenAddProduct = () => {
    const prod = defaultProduct();
    setProductForm(prod);
    setEditingProductId(null);
    setProductSizesInput(prod.sizes.join(', '));
    setProductColorsInput(prod.colors.map((c) => `${c.name}:${c.hex}`).join(', '));
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setProductForm(prod);
    setEditingProductId(prod.id);
    setProductSizesInput(prod.sizes.join(', '));
    setProductColorsInput(prod.colors.map((c) => `${c.name}:${c.hex}`).join(', '));
    setIsProductModalOpen(true);
  };

  const handleSaveProductModal = () => {
    const sizes = productSizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = productColorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const [name, hex] = c.split(':').map((s) => s.trim());
        return { name: name || 'Color', hex: hex || '#111111' };
      });

    const normalized: Product = {
      ...productForm,
      id: editingProductId || `prod-${Date.now()}`,
      name: productForm.name.trim() || 'Untitled Piece',
      price: Math.max(1, Number(productForm.price) || 1),
      originalPrice: productForm.originalPrice ? Math.max(productForm.price, Number(productForm.originalPrice)) : undefined,
      categoryLabel: getCategoryLabel(productForm.category),
      sizes: sizes.length ? sizes : ['S', 'M', 'L', 'XL'],
      colors: colors.length ? colors : [{ name: 'Onyx Black', hex: '#111111' }],
      estDeliveryMins: Math.max(1, Number(productForm.estDeliveryMins) || 10),
      image: productForm.image?.trim() || defaultProduct().image,
    };

    if (editingProductId) {
      onUpdateProduct(editingProductId, normalized);
      logAudit(`Updated product "${normalized.name}"`, 'Catalog');
      notify(`Product "${normalized.name}" updated!`);
    } else {
      onAddProduct(normalized);
      logAudit(`Added new product "${normalized.name}"`, 'Catalog');
      notify(`Product "${normalized.name}" added to catalog!`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProductConfirm = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the product catalogue?`)) {
      onDeleteProduct(id);
      logAudit(`Deleted product "${name}"`, 'Catalog');
      notify(`Product "${name}" deleted.`);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.fabric?.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchCat = catalogCategoryFilter === 'all' || p.category === catalogCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, catalogSearch, catalogCategoryFilter]);

  // --- ORDERS ACTIONS ---
  const handleUpdateOrderStatus = (orderId: string, newStatus: 'delivered' | 'in_transit' | 'try_on_kept') => {
    const updated = orderList.map((ord) => {
      if (ord.orderId === orderId) {
        const text =
          newStatus === 'delivered'
            ? 'Delivered (10 Mins)'
            : newStatus === 'in_transit'
            ? 'Rider Dispatched (En Route)'
            : 'Doorstep Try-On Kept';
        return {
          ...ord,
          statusType: newStatus,
          statusText: text,
        };
      }
      return ord;
    });
    setOrderList(updated);
    if (onUpdateOrderHistory) {
      onUpdateOrderHistory(updated);
    }
    logAudit(`Updated status of order #${orderId} to ${newStatus}`, 'Orders');
    notify(`Order #${orderId} status updated!`);
  };

  const filteredOrders = useMemo(() => {
    return orderList.filter((ord) => {
      const matchSearch =
        ord.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.phone.includes(orderSearch) ||
        ord.address.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || ord.statusType === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orderList, orderSearch, orderStatusFilter]);

  // --- CUSTOMERS DERIVED DATA ---
  const customersList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      address: string;
      orderCount: number;
      totalSpent: number;
      lastOrderDate: string;
      isVip: boolean;
    }>();

    // Seed default VIP members if empty
    map.set('Shaikh Kamran', {
      name: 'Shaikh Kamran',
      phone: '+1 (555) 019-2834',
      address: '742 Evergreen Terrace, Apt 4B, Metro Center',
      orderCount: 3,
      totalSpent: 580,
      lastOrderDate: 'Sep 28, 2026',
      isVip: true,
    });
    map.set('Elena Rostova', {
      name: 'Elena Rostova',
      phone: '+1 (555) 014-8891',
      address: '108 Mercer Street, SoHo, NY 10012',
      orderCount: 5,
      totalSpent: 920,
      lastOrderDate: 'Oct 02, 2026',
      isVip: true,
    });
    map.set('Marcus Vance', {
      name: 'Marcus Vance',
      phone: '+1 (555) 018-7744',
      address: '420 W 23rd St, High Line District',
      orderCount: 2,
      totalSpent: 310,
      lastOrderDate: 'Oct 11, 2026',
      isVip: false,
    });

    orderList.forEach((ord) => {
      const existing = map.get(ord.name);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += ord.totalAmount;
      } else {
        map.set(ord.name, {
          name: ord.name,
          phone: ord.phone,
          address: ord.address,
          orderCount: 1,
          totalSpent: ord.totalAmount,
          lastOrderDate: ord.formattedDate.split('·')[0].trim(),
          isVip: ord.totalAmount > 200,
        });
      }
    });

    return Array.from(map.values()).filter(
      (c) =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch) ||
        c.address.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [orderList, customerSearch]);

  // =========================================================
  // DEDICATED EDIT HANDLERS FOR ORGANIZATION & STOREFRONT
  // =========================================================

  // 1. Employee / Staff Edit Handlers
  const handleOpenEditEmployee = (emp: TeamMember, index: number) => {
    setEditingEmployeeIndex(index);
    setEmployeeEditForm({ ...emp });
  };

  const handleSaveEmployeeEdit = () => {
    if (editingEmployeeIndex === null || !employeeEditForm) return;
    if (!employeeEditForm.name.trim() || !employeeEditForm.role.trim()) {
      alert('Employee name and role are required.');
      return;
    }

    const updatedEmployees = [...siteForm.employees];
    updatedEmployees[editingEmployeeIndex] = {
      ...employeeEditForm,
      name: employeeEditForm.name.trim(),
      role: employeeEditForm.role.trim(),
      image: employeeEditForm.image?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    };

    const newSettings = { ...siteForm, employees: updatedEmployees };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Updated staff profile for "${employeeEditForm.name}"`, 'Staff & Fleet');
    notify(`Staff details for ${employeeEditForm.name} updated!`);
    setEditingEmployeeIndex(null);
    setEmployeeEditForm(null);
  };

  // 2. Director Edit Handlers
  const handleOpenEditDirector = (dir: BoardMember, index: number) => {
    setEditingDirectorIndex(index);
    setDirectorEditForm({ ...dir });
  };

  const handleSaveDirectorEdit = () => {
    if (editingDirectorIndex === null || !directorEditForm) return;
    if (!directorEditForm.name.trim() || !directorEditForm.role.trim()) {
      alert('Director name and board title are required.');
      return;
    }

    const updatedDirectors = [...siteForm.directors];
    updatedDirectors[editingDirectorIndex] = {
      ...directorEditForm,
      name: directorEditForm.name.trim(),
      role: directorEditForm.role.trim(),
      image: directorEditForm.image?.trim() || 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80',
    };

    const newSettings = { ...siteForm, directors: updatedDirectors };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Updated board director profile for "${directorEditForm.name}"`, 'Governance');
    notify(`Board credentials for ${directorEditForm.name} updated!`);
    setEditingDirectorIndex(null);
    setDirectorEditForm(null);
  };

  // 3. Logistics / Micro-Hub Edit Handlers
  const handleOpenEditHub = (hub: MicroHubInfo) => {
    setEditingHubId(hub.id);
    setHubEditForm({ ...hub });
  };

  const handleSaveHubEdit = () => {
    if (!editingHubId || !hubEditForm) return;
    if (!hubEditForm.name.trim() || !hubEditForm.code.trim()) {
      alert('Hub name and code are required.');
      return;
    }

    const updatedHubs = (siteForm.microHubs || []).map((h) =>
      h.id === editingHubId ? { ...hubEditForm, code: hubEditForm.code.toUpperCase().trim() } : h
    );

    const newSettings = { ...siteForm, microHubs: updatedHubs };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Updated logistics parameters for dark store "${hubEditForm.name}"`, 'Logistics');
    notify(`Micro-hub "${hubEditForm.name}" updated!`);
    setEditingHubId(null);
    setHubEditForm(null);
  };

  // 4. Company Info Edit Handlers
  const handleOpenCompanyEditModal = () => {
    setCompanyEditForm({
      companyName: siteForm.companyName,
      legalName: siteForm.legalName,
      tagline: siteForm.tagline,
      registrationNumber: siteForm.registrationNumber,
      taxIdentification: siteForm.taxIdentification,
      headquarters: siteForm.headquarters,
      email: siteForm.email,
      phone: siteForm.phone,
      operatingHours: siteForm.operatingHours,
      guaranteedDeliveryMinutes: siteForm.guaranteedDeliveryMinutes,
      freeShippingThreshold: siteForm.freeShippingThreshold,
      taxRatePercentage: siteForm.taxRatePercentage,
      currency: siteForm.currency,
    });
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompanyEdit = () => {
    const newSettings: SiteSettings = {
      ...siteForm,
      ...companyEditForm,
      companyName: companyEditForm.companyName?.trim() || siteForm.companyName,
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit('Updated corporate identity & headquarters information', 'Storefront');
    notify('Company information updated and applied!');
    setIsCompanyModalOpen(false);
  };

  // 5. Founder Details Edit Handlers
  const handleOpenFounderEditModal = () => {
    setFounderEditForm({
      founderName: siteForm.founderName,
      founderRole: siteForm.founderRole,
      founderImage: siteForm.founderImage,
      founderQuote: siteForm.founderQuote,
      founderEmail: siteForm.founderEmail,
      aboutTitle: siteForm.aboutTitle,
      aboutIntro: siteForm.aboutIntro,
      aboutBody: siteForm.aboutBody,
    });
    setIsFounderModalOpen(true);
  };

  const handleSaveFounderEdit = () => {
    const newSettings: SiteSettings = {
      ...siteForm,
      ...founderEditForm,
      founderName: founderEditForm.founderName?.trim() || siteForm.founderName,
      founderRole: founderEditForm.founderRole?.trim() || siteForm.founderRole,
      founderImage: founderEditForm.founderImage?.trim() || siteForm.founderImage,
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Updated founder details and brand story for "${newSettings.founderName}"`, 'Storefront');
    notify('Founder profile & story updated across the website!');
    setIsFounderModalOpen(false);
  };

  // 6. Organization Master Settings Modal Handler
  const handleSaveOrganizationModal = (updated: SiteSettings) => {
    setSiteForm(updated);
    if (onUpdateSiteSettings) {
      onUpdateSiteSettings(updated);
    }
    logAudit('Updated master organization settings (company, founder, directors, micro-hubs)', 'Organization');
    notify('Organization settings updated in real time!');
  };

  // Creation operations
  const handleAddDirector = () => {
    if (!newDirector.name.trim() || !newDirector.role.trim()) {
      alert('Please provide director name and role.');
      return;
    }
    const dir: BoardMember = {
      ...newDirector,
      id: `dir-${Date.now()}`,
      image: newDirector.image?.trim() || 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80',
    };
    const newSettings = {
      ...siteForm,
      directors: [...siteForm.directors, dir],
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Added director "${dir.name}"`, 'Governance');
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
    notify(`Director "${dir.name}" added to executive board!`);
  };

  const handleRemoveDirector = (index: number) => {
    const dir = siteForm.directors[index];
    if (window.confirm(`Remove director "${dir.name}"?`)) {
      const newSettings = {
        ...siteForm,
        directors: siteForm.directors.filter((_, i) => i !== index),
      };
      setSiteForm(newSettings);
      if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
      logAudit(`Removed director "${dir.name}"`, 'Governance');
      notify('Director removed.');
    }
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name.trim() || !newEmployee.role.trim()) {
      alert('Please provide employee name and role.');
      return;
    }
    const emp: TeamMember = {
      ...newEmployee,
      id: `emp-${Date.now()}`,
      employeeCode: `APX-${Math.floor(100 + Math.random() * 900)}`,
      joinedDate: 'Oct 2026',
      deliveriesCompleted: 0,
      avgSlaMinutes: 8.5,
      rating: 5.0,
      image: newEmployee.image?.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    };
    const newSettings = {
      ...siteForm,
      employees: [...siteForm.employees, emp],
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Added team member "${emp.name}" (${emp.role})`, 'Staff & Fleet');
    setNewEmployee({
      name: '',
      role: 'Electric Courier',
      department: 'Logistics Fleet',
      assignedHub: 'Downtown Flagship Hub #1',
      phone: '',
      status: 'Available at Hub',
      vehicle: 'Super73 Electric Cargo',
      image: '',
    });
    notify(`Team member "${emp.name}" added!`);
  };

  const handleRemoveEmployee = (index: number) => {
    const emp = siteForm.employees[index];
    if (window.confirm(`Remove employee "${emp.name}"?`)) {
      const newSettings = {
        ...siteForm,
        employees: siteForm.employees.filter((_, i) => i !== index),
      };
      setSiteForm(newSettings);
      if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
      logAudit(`Removed employee "${emp.name}"`, 'Staff & Fleet');
      notify('Employee removed.');
    }
  };

  const handleAddCoupon = () => {
    if (!newCoupon.code.trim()) {
      alert('Please enter a voucher code name.');
      return;
    }
    const coup: PromoCoupon = {
      ...newCoupon,
      id: `coup-${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
    };
    const newSettings = {
      ...siteForm,
      coupons: [...(siteForm.coupons || []), coup],
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Created promo coupon "${coup.code}" (${coup.discountPercentage}% off)`, 'Promotions');
    setNewCoupon({
      id: '',
      code: '',
      discountPercentage: 15,
      minOrderValue: 75,
      description: '',
      isActive: true,
      usageCount: 0,
      expiryDate: '2026-12-31',
    });
    notify(`Coupon code "${coup.code}" created!`);
  };

  const handleToggleCoupon = (id: string) => {
    const newSettings = {
      ...siteForm,
      coupons: (siteForm.coupons || []).map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ),
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
    notify('Coupon status toggled.');
  };

  const handleDeleteCoupon = (id: string) => {
    const newSettings = {
      ...siteForm,
      coupons: (siteForm.coupons || []).filter((c) => c.id !== id),
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
    notify('Coupon deleted.');
  };

  const handleAddMicroHub = () => {
    if (!newHub.name.trim() || !newHub.code.trim()) {
      alert('Please provide hub name and unique code.');
      return;
    }
    const hub: MicroHubInfo = {
      ...newHub,
      id: `hub-${Date.now()}`,
      code: newHub.code.toUpperCase().trim(),
    };
    const newSettings = {
      ...siteForm,
      microHubs: [...(siteForm.microHubs || []), hub],
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Added micro-hub "${hub.name}"`, 'Logistics');
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
    notify(`Micro-hub "${hub.name}" registered!`);
  };

  const handleDeleteMicroHub = (id: string) => {
    const newSettings = {
      ...siteForm,
      microHubs: (siteForm.microHubs || []).filter((h) => h.id !== id),
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
    notify('Micro-hub removed.');
  };

  const handleAddAdminUser = () => {
    if (!newAdmin.name.trim() || !newAdmin.email.trim()) {
      alert('Please provide admin name and email.');
      return;
    }
    const adm: AdminUserAccount = {
      ...newAdmin,
      id: `usr-${Date.now()}`,
    };
    const newSettings = {
      ...siteForm,
      adminUsers: [...(siteForm.adminUsers || []), adm],
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);

    logAudit(`Granted ${adm.role} privileges to ${adm.email}`, 'Security');
    setNewAdmin({
      id: '',
      name: '',
      email: '',
      role: 'Store Manager',
      status: 'Active',
      lastActive: 'Just added',
    });
    notify(`Admin account for ${adm.name} created!`);
  };

  const handleDeleteAdminUser = (id: string) => {
    const newSettings = {
      ...siteForm,
      adminUsers: (siteForm.adminUsers || []).filter((u) => u.id !== id),
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
    notify('Admin account removed.');
  };

  const handleAddSocial = () => {
    if (!newSocial.label.trim() || !newSocial.url.trim()) return;
    const newSettings = {
      ...siteForm,
      socialLinks: [
        ...siteForm.socialLinks,
        {
          ...newSocial,
          enabled: true,
        },
      ],
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
    setNewSocial({ label: '', url: '', handle: '', enabled: true });
    notify('Social channel linked!');
  };

  const handleRemoveSocial = (index: number) => {
    const newSettings = {
      ...siteForm,
      socialLinks: siteForm.socialLinks.filter((_, i) => i !== index),
    };
    setSiteForm(newSettings);
    if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
  };

  // --- SYSTEM BACKUP & EXPORT ---
  const handleExportDataJSON = () => {
    const snapshot = {
      version: '2.0-full-admin',
      exportedAt: new Date().toISOString(),
      siteSettings: siteForm,
      products,
      orders: orderList,
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apparellex-store-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logAudit('Exported complete store JSON backup', 'System');
    notify('Store database backup downloaded!');
  };

  const handleImportDataJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.siteSettings) {
          setSiteForm(parsed.siteSettings);
          if (onUpdateSiteSettings) onUpdateSiteSettings(parsed.siteSettings);
        }
        if (Array.isArray(parsed.orders)) {
          setOrderList(parsed.orders);
          if (onUpdateOrderHistory) onUpdateOrderHistory(parsed.orders);
        }
        logAudit('Restored store configuration from backup file', 'System');
        notify('Backup imported successfully!');
      } catch {
        alert('Invalid JSON file format. Please upload a valid Apparellex store backup.');
      }
    };
    reader.readAsText(file);
  };

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview & KPIs', icon: BarChart3, group: 'Operations' },
    { id: 'catalog', label: 'Product Catalog', icon: ShoppingBag, group: 'Operations', badge: products.length },
    { id: 'orders', label: 'Orders & Dispatch', icon: Package, group: 'Operations', badge: orderList.length },
    { id: 'customers', label: 'Customers & VIP', icon: Users, group: 'Operations', badge: customersList.length },
    { id: 'employees', label: 'Staff & Fleet', icon: Bike, group: 'Organization', badge: siteForm.employees.length },
    { id: 'directors', label: 'Board of Directors', icon: Briefcase, group: 'Organization', badge: siteForm.directors.length },
    { id: 'microhubs', label: 'Micro-Hubs Logistics', icon: Layers, group: 'Organization', badge: siteForm.microHubs?.length || 3 },
    { id: 'promos', label: 'Discounts & Coupons', icon: Tag, group: 'Storefront', badge: siteForm.coupons?.length || 3 },
    { id: 'company', label: 'Company & Founder', icon: Building2, group: 'Storefront' },
    { id: 'social', label: 'Social & WhatsApp', icon: Share2, group: 'Storefront' },
    { id: 'seo_legal', label: 'SEO & Store Policies', icon: Globe, group: 'Storefront' },
    { id: 'admins', label: 'Admin Accounts & Roles', icon: Shield, group: 'Security', badge: siteForm.adminUsers?.length || 4 },
    { id: 'system', label: 'Audit Log & Backup', icon: Settings, group: 'Security' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-[#0c0c0e]/95 text-stone-100 backdrop-blur-xl overflow-hidden font-sans">
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="w-64 md:w-72 bg-[#141417] border-r border-white/10 flex flex-col shrink-0">
        {/* Brand & Portal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF5757] flex items-center justify-center text-white shadow-lg shadow-[#FF5757]/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider uppercase text-white font-fashion">
                {siteForm.companyName}
              </h2>
              <p className="text-[10px] text-stone-400 font-medium tracking-widest uppercase">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin scrollbar-thumb-stone-800">
          {['Operations', 'Organization', 'Storefront', 'Security'].map((group) => {
            const items = navItems.filter((item) => item.group === group);
            return (
              <div key={group} className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {group}
                </span>
                <div className="space-y-0.5 pt-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as AdminSection)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                          isActive
                            ? 'bg-[#FF5757] text-white shadow-md shadow-[#FF5757]/20 font-semibold'
                            : 'text-stone-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] tabular-nums font-bold px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-black/30 text-white'
                                : 'bg-white/5 text-stone-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom System Shortcuts */}
        <div className="p-4 border-t border-white/10 bg-[#111113] space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Store Status:</span>
            <button
              onClick={() => {
                const nextState = !siteForm.isStoreLive;
                const newSettings = { ...siteForm, isStoreLive: nextState };
                setSiteForm(newSettings);
                if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
                logAudit(nextState ? 'Opened Store to Customers' : 'Activated Maintenance Mode', 'Storefront');
                notify(nextState ? 'Store is now LIVE and accepting orders!' : 'Store put in Maintenance Mode.');
              }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                siteForm.isStoreLive !== false
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {siteForm.isStoreLive !== false ? '● ONLINE' : '● MAINTENANCE'}
            </button>
          </div>
          <button
            onClick={handleSaveAllSettings}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Changes</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
        {/* Top Operational Bar */}
        <header className="h-16 px-6 border-b border-white/10 bg-[#141417]/80 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-white capitalize flex items-center gap-2">
              <span>{navItems.find((n) => n.id === activeSection)?.label || 'Administration'}</span>
              <span className="text-xs font-normal text-stone-400">· Real-Time Management</span>
            </h1>
            {savedNotice && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                <span>{savedNotice}</span>
              </div>
            )}
          </div>

          {/* Action buttons including explicit CLOSE BUTTON */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOrgSettingsModalOpen(true)}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold rounded-md border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
              title="Open Organization Settings Modal"
            >
              <Building2 className="w-3.5 h-3.5 text-[#FF5757]" />
              <span className="hidden sm:inline">Org Master Settings</span>
            </button>

            <button
              onClick={handleSaveAllSettings}
              className="px-3.5 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-semibold rounded-md shadow flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            {/* Prominent Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold rounded-md border border-white/10 flex items-center gap-2 transition cursor-pointer"
                title="Exit Admin Panel (Esc)"
              >
                <X className="w-4 h-4 text-[#FF5757]" />
                <span className="font-bold">Close Admin</span>
                <span className="hidden sm:inline-block text-[10px] text-stone-300 bg-stone-900 px-1.5 py-0.5 rounded font-mono">
                  ESC
                </span>
              </button>
            )}
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-stone-800">
          
          {/* ========================================================= */}
          {/* 1. OVERVIEW & ANALYTICS SECTION */}
          {/* ========================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Executive KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-[#141417] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Total Store Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black tabular-nums text-white">
                    ₹{(orders.reduce((acc, curr) => acc + curr.totalAmount, 0) + 482000).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span>↑ +18.4%</span>
                    <span className="text-stone-400">vs last 30 days</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#141417] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Total Orders Dispatched</span>
                    <Package className="w-4 h-4 text-[#FF5757]" />
                  </div>
                  <div className="text-2xl font-black tabular-nums text-white">
                    {orderList.length + 184}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    <span className="text-white font-medium">98.6%</span> within 10-min SLA
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#141417] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Active Couriers on Route</span>
                    <Bike className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black tabular-nums text-white">
                    {siteForm.employees.filter((e) => e.status?.includes('Route')).length || 2} / {siteForm.employees.length}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Avg delivery time: <span className="text-white font-medium">8.4 mins</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#141417] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Live Catalogue Items</span>
                    <ShoppingBag className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black tabular-nums text-white">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Across 3 curated collections
                  </div>
                </div>
              </div>

              {/* Quick Operational Controls & Shortcuts */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Storefront Controls
                    </h3>
                    <Sliders className="w-4 h-4 text-stone-400" />
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                      <div>
                        <p className="font-semibold text-white">Announcement Top Bar</p>
                        <p className="text-stone-400 text-[11px]">Show delivery prompt banner</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={siteForm.showAnnouncementBar !== false}
                        onChange={(e) => {
                          const newSettings = { ...siteForm, showAnnouncementBar: e.target.checked };
                          setSiteForm(newSettings);
                          if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
                        }}
                        className="w-4 h-4 accent-[#FF5757] rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                      <div>
                        <p className="font-semibold text-white">Store Maintenance Mode</p>
                        <p className="text-stone-400 text-[11px]">Temporarily pause checkout</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={siteForm.maintenanceMode === true}
                        onChange={(e) => {
                          const newSettings = { ...siteForm, maintenanceMode: e.target.checked };
                          setSiteForm(newSettings);
                          if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
                        }}
                        className="w-4 h-4 accent-[#FF5757] rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                      <div>
                        <p className="font-semibold text-white">Guaranteed SLA Window</p>
                        <p className="text-stone-400 text-[11px]">Instant delivery promise</p>
                      </div>
                      <span className="font-bold text-[#FF5757] font-mono">
                        {siteForm.guaranteedDeliveryMinutes || 10} Mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro-Hubs Quick Status */}
                <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Dark Store Micro-Hubs
                    </h3>
                    <Layers className="w-4 h-4 text-stone-400" />
                  </div>
                  <div className="space-y-2.5">
                    {(siteForm.microHubs || []).map((hub) => (
                      <div
                        key={hub.id}
                        className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{hub.name}</p>
                          <p className="text-[11px] text-stone-400">
                            {hub.activeCouriers} Couriers · {hub.avgFulfillmentMins}m Avg SLA
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {hub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts & Navigation */}
                <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Quick Shortcuts
                    </h3>
                    <Zap className="w-4 h-4 text-[#FF5757]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setIsOrgSettingsModalOpen(true)}
                      className="col-span-2 p-2.5 rounded-lg bg-[#FF5757]/15 hover:bg-[#FF5757]/25 text-white border border-[#FF5757]/30 font-semibold flex items-center justify-center gap-2 transition text-center"
                    >
                      <Building2 className="w-4 h-4 text-[#FF5757]" />
                      <span>Organization Master Settings (All-in-One)</span>
                    </button>
                    <button
                      onClick={handleOpenAddProduct}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex flex-col items-center justify-center gap-1.5 transition text-center"
                    >
                      <Plus className="w-4 h-4 text-[#FF5757]" />
                      <span>Add Product</span>
                    </button>
                    <button
                      onClick={handleOpenCompanyEditModal}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex flex-col items-center justify-center gap-1.5 transition text-center"
                    >
                      <Building2 className="w-4 h-4 text-sky-400" />
                      <span>Edit Company</span>
                    </button>
                    <button
                      onClick={handleOpenFounderEditModal}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex flex-col items-center justify-center gap-1.5 transition text-center"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Edit Founder</span>
                    </button>
                    <button
                      onClick={handleExportDataJSON}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex flex-col items-center justify-center gap-1.5 transition text-center"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Backup Store</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Audit Stream */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Administrative Actions & Audit Feed
                  </h3>
                  <Clock className="w-4 h-4 text-stone-400" />
                </div>
                <div className="divide-y divide-white/5 text-xs">
                  {(siteForm.auditLogs || []).slice(0, 5).map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-stone-400 font-mono w-28 shrink-0">
                          {log.timestamp}
                        </span>
                        <span className="text-white font-medium">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                        {log.module}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. PRODUCT CATALOGUE SECTION */}
          {/* ========================================================= */}
          {activeSection === 'catalog' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#141417] border border-white/10">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search items by name, ID, or fabric..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5757]"
                    />
                  </div>
                  <select
                    value={catalogCategoryFilter}
                    onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5757]"
                  >
                    <option value="all">All Categories</option>
                    <option value="urban-street">Urban Street</option>
                    <option value="minimalist-zen">Minimalist Zen</option>
                    <option value="unique-trends">Unique Trends</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onResetDefaultProducts}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg border border-white/10 flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-xl bg-[#141417] border border-white/10 overflow-hidden flex flex-col group hover:border-white/20 transition"
                  >
                    <div className="relative aspect-[4/5] bg-stone-900 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {prod.isNewDrop && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF5757] text-white px-2 py-0.5 rounded shadow">
                            NEW DROP
                          </span>
                        )}
                        <span className="text-[10px] font-semibold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur">
                          ⚡ {prod.estDeliveryMins || 10}m Delivery
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="p-1.5 bg-black/70 hover:bg-[#FF5757] text-white rounded backdrop-blur transition"
                          title="Edit product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProductConfirm(prod.id, prod.name)}
                          className="p-1.5 bg-black/70 hover:bg-red-600 text-white rounded backdrop-blur transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                          {prod.categoryLabel || prod.category} · {prod.gender}
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black tabular-nums text-white">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-xs tabular-nums text-stone-400 line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
                        <span>Sizes: {prod.sizes.join(', ')}</span>
                        <div className="flex items-center gap-1">
                          {prod.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-3 h-3 rounded-full border border-white/20 inline-block"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. ORDERS & FULFILLMENT SECTION */}
          {/* ========================================================= */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              {/* Order filters & search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#141417] border border-white/10">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search orders by ID, customer name, phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5757]"
                    />
                  </div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5757]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="delivered">Delivered</option>
                    <option value="in_transit">In Transit / Dispatched</option>
                    <option value="try_on_kept">Doorstep Try-On Kept</option>
                  </select>
                </div>

                <div className="text-xs text-stone-400">
                  Showing <span className="font-bold text-white tabular-nums">{filteredOrders.length}</span> recorded orders
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-xl bg-[#141417] border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/40 border-b border-white/10 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Items Summary</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Fulfillment Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-white/5 transition">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-white">#{ord.orderId}</div>
                            <div className="text-[11px] text-stone-400">{ord.formattedDate}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{ord.name}</div>
                            <div className="text-[11px] text-stone-400 line-clamp-1 max-w-[200px]">
                              {ord.address} · {ord.phone}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-stone-300">
                              {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                            </div>
                            <div className="text-[10px] text-stone-400 truncate max-w-[180px]">
                              {ord.items.map((i) => i.product.name).join(', ')}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold tabular-nums text-white">₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-stone-400 uppercase">
                              {ord.paymentMethod === 'cod' ? 'Cash on Try-on' : 'Card Paid'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={ord.statusType}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  ord.orderId,
                                  e.target.value as 'delivered' | 'in_transit' | 'try_on_kept'
                                )
                              }
                              className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none ${
                                ord.statusType === 'delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : ord.statusType === 'in_transit'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              }`}
                            >
                              <option value="delivered">Delivered (10m SLA)</option>
                              <option value="in_transit">Rider Dispatched</option>
                              <option value="try_on_kept">Doorstep Try-On Kept</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-medium transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. CUSTOMERS & VIP VAULT SECTION */}
          {/* ========================================================= */}
          {activeSection === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#141417] border border-white/10">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search customer records by name, email, phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5757]"
                  />
                </div>
                <div className="text-xs text-stone-400">
                  Total Active Customers: <span className="font-bold text-white tabular-nums">{customersList.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customersList.map((cust, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-[#141417] border border-white/10 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{cust.name}</h4>
                        {cust.isVip ? (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black px-2 py-0.5 rounded font-fashion">
                            VIP VAULT
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                            Standard Tier
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        <span>{cust.phone}</span>
                      </p>
                      <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{cust.address}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase">Total Orders</div>
                        <div className="font-bold tabular-nums text-white">{cust.orderCount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase">Lifetime Value</div>
                        <div className="font-bold tabular-nums text-emerald-400">${cust.totalSpent}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase">Last Order</div>
                        <div className="text-stone-300 font-mono text-[11px]">{cust.lastOrderDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. STAFF & FLEET OPERATIONS SECTION (ORGANIZATION) */}
          {/* ========================================================= */}
          {activeSection === 'employees' && (
            <div className="space-y-6">
              {/* Header and Add Button */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Staff & Courier Fleet Roster
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Manage electric courier assignments, doorstep stylists, and warehouse operations.
                    </p>
                  </div>
                  <Bike className="w-5 h-5 text-[#FF5757]" />
                </div>

                {/* Add Quick Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mansoor"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Role</label>
                    <select
                      value={newEmployee.role}
                      onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    >
                      <option value="Electric Courier">Electric Courier</option>
                      <option value="Doorstep Stylist">Doorstep Stylist</option>
                      <option value="Dark Store Associate">Dark Store Associate</option>
                      <option value="Garment Care & Steamer">Garment Care & Steamer</option>
                      <option value="Hub Dispatch Supervisor">Hub Dispatch Supervisor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Assigned Micro-Hub</label>
                    <select
                      value={newEmployee.assignedHub}
                      onChange={(e) => setNewEmployee({ ...newEmployee, assignedHub: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    >
                      {(siteForm.microHubs || []).map((h) => (
                        <option key={h.id} value={h.name}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 019-2834"
                      value={newEmployee.phone || ''}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddEmployee}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register New Member</span>
                  </button>
                </div>
              </div>

              {/* Employee Roster with Dedicated Edit Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {siteForm.employees.map((emp, index) => (
                  <div
                    key={emp.id || index}
                    className="p-5 rounded-xl bg-[#141417] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={emp.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'}
                        alt={emp.name}
                        className="w-14 h-14 rounded-lg object-cover bg-stone-800 shrink-0 border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white truncate">{emp.name}</h4>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditEmployee(emp, index)}
                              className="px-2 py-1 bg-white/10 hover:bg-[#FF5757] text-white text-[10px] font-semibold rounded flex items-center gap-1 transition"
                              title="Edit Staff Member"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleRemoveEmployee(index)}
                              className="p-1 text-stone-400 hover:text-red-400 transition"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#FF5757] font-semibold">{emp.role}</p>
                        <p className="text-[11px] text-stone-400 truncate">{emp.assignedHub}</p>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">{emp.employeeCode || `APX-RIDER-${index + 1}`}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-stone-400 text-[11px]">
                        <span>Status:</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          emp.status?.includes('Route')
                            ? 'bg-amber-500/20 text-amber-400'
                            : emp.status?.includes('Available')
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-stone-800 text-stone-400'
                        }`}>
                          {emp.status || 'Available at Hub'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-400 text-[11px]">
                        <span>Vehicle / Fleet:</span>
                        <span className="text-stone-200">{emp.vehicle || 'Super73 Electric Cargo'}</span>
                      </div>
                      <div className="flex items-center justify-between text-stone-400 text-[11px]">
                        <span>Deliveries & SLA:</span>
                        <span className="text-stone-200 font-mono">
                          {emp.deliveriesCompleted ?? 120} trips · {emp.avgSlaMinutes ?? 8.4}m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. BOARD OF DIRECTORS SECTION (ORGANIZATION) */}
          {/* ========================================================= */}
          {activeSection === 'directors' && (
            <div className="space-y-6">
              {/* Header and Add Quick Form */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Executive Board of Directors
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Governance, executive directors, and corporate mandates.
                    </p>
                  </div>
                  <Briefcase className="w-5 h-5 text-[#FF5757]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Director Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Amelia Hart"
                      value={newDirector.name}
                      onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Title / Board Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Board Director & Strategy"
                      value={newDirector.role}
                      onChange={(e) => setNewDirector({ ...newDirector, role: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Portrait Photo URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newDirector.image || ''}
                      onChange={(e) => setNewDirector({ ...newDirector, image: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-stone-400 text-[11px] mb-1">Executive Biography</label>
                    <textarea
                      rows={2}
                      placeholder="Summary of experience, advisory mandate, or strategic focus..."
                      value={newDirector.bio || ''}
                      onChange={(e) => setNewDirector({ ...newDirector, bio: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddDirector}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Appoint Board Director</span>
                  </button>
                </div>
              </div>

              {/* Directors Cards with Dedicated Edit Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {siteForm.directors.map((dir, index) => (
                  <div
                    key={dir.id || index}
                    className="p-5 rounded-xl bg-[#141417] border border-white/10 flex gap-4 hover:border-white/20 transition"
                  >
                    <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-stone-800 shrink-0 border border-white/10">
                      <img
                        src={dir.image || 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80'}
                        alt={dir.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{dir.name}</h4>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditDirector(dir, index)}
                              className="px-2 py-1 bg-white/10 hover:bg-[#FF5757] text-white text-[10px] font-semibold rounded flex items-center gap-1 transition"
                              title="Edit Director Profile"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleRemoveDirector(index)}
                              className="p-1 text-stone-400 hover:text-red-400 transition"
                              title="Remove Director"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-[#FF5757] font-semibold">{dir.role}</p>
                        <p className="text-[11px] text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                          {dir.bio || 'Directs company governance and expansion.'}
                        </p>
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono pt-1">
                        Appointed: {dir.appointedYear || '2024'} · {dir.department || 'Executive Board'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. MICRO-HUBS LOGISTICS SECTION (ORGANIZATION) */}
          {/* ========================================================= */}
          {activeSection === 'microhubs' && (
            <div className="space-y-6">
              {/* Header and Add Hub Form */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Dark Store Logistics & Micro-Hub Infrastructure
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Hyperlocal fulfillment centers powering 10-minute instant delivery coverage.
                    </p>
                  </div>
                  <Layers className="w-5 h-5 text-[#FF5757]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Hub Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Midtown East Micro-Hub"
                      value={newHub.name}
                      onChange={(e) => setNewHub({ ...newHub, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Hub Code</label>
                    <input
                      type="text"
                      placeholder="HUB-MDT-04"
                      value={newHub.code}
                      onChange={(e) => setNewHub({ ...newHub, code: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Radius (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newHub.serviceRadiusKm}
                      onChange={(e) => setNewHub({ ...newHub, serviceRadiusKm: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Physical Address</label>
                    <input
                      type="text"
                      placeholder="Street address..."
                      value={newHub.address}
                      onChange={(e) => setNewHub({ ...newHub, address: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddMicroHub}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Commission Micro-Hub</span>
                  </button>
                </div>
              </div>

              {/* Micro-Hubs Cards with Dedicated Edit Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(siteForm.microHubs || []).map((hub) => (
                  <div
                    key={hub.id}
                    className="p-5 rounded-xl bg-[#141417] border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/20 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#FF5757] bg-black/60 px-2 py-0.5 rounded border border-white/5">
                          {hub.code}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditHub(hub)}
                            className="px-2 py-1 bg-white/10 hover:bg-[#FF5757] text-white text-[10px] font-semibold rounded flex items-center gap-1 transition"
                            title="Edit Logistics Parameters"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMicroHub(hub.id)}
                            className="p-1 text-stone-400 hover:text-red-400 transition"
                            title="Delete hub"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">{hub.name}</h4>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1">{hub.address}</p>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs text-stone-400">
                      <div className="flex justify-between">
                        <span>Coverage Radius:</span>
                        <span className="text-white font-mono">{hub.serviceRadiusKm} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Electric Couriers:</span>
                        <span className="text-white font-bold">{hub.activeCouriers} Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Electric Fleet Size:</span>
                        <span className="text-stone-200">{hub.electricFleetCount} vehicles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Fulfillment SLA:</span>
                        <span className="text-emerald-400 font-mono font-bold">{hub.avgFulfillmentMins} mins</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span>Status:</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {hub.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. PROMOTIONS & COUPONS SECTION */}
          {/* ========================================================= */}
          {activeSection === 'promos' && (
            <div className="space-y-6">
              {/* Add Coupon Form */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Create Promotional Voucher Code
                  </h3>
                  <Tag className="w-4 h-4 text-[#FF5757]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FLASH25"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white uppercase font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newCoupon.discountPercentage}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountPercentage: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Min Spend ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={newCoupon.minOrderValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Expiration Date</label>
                    <input
                      type="date"
                      value={newCoupon.expiryDate}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-stone-400 text-[11px] mb-1">Description / Customer Label</label>
                    <input
                      type="text"
                      placeholder="e.g. 25% off all luxury drops over $75"
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddCoupon}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Voucher Code</span>
                  </button>
                </div>
              </div>

              {/* Active Coupons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(siteForm.coupons || []).map((coup) => (
                  <div
                    key={coup.id}
                    className="p-5 rounded-xl bg-[#141417] border border-white/10 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black tracking-wider uppercase font-mono text-white bg-black/60 px-2 py-0.5 rounded border border-white/10">
                          {coup.code}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCoupon(coup.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                              coup.isActive
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {coup.isActive ? 'ACTIVE' : 'PAUSED'}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coup.id)}
                            className="text-stone-400 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-stone-300 mt-2 font-medium">{coup.description}</p>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-1 text-xs text-stone-400">
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="font-bold text-[#FF5757] font-mono">{coup.discountPercentage}% OFF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Spend:</span>
                        <span className="font-mono text-white">${coup.minOrderValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Usage Count:</span>
                        <span className="font-bold text-white tabular-nums">{coup.usageCount} times</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. COMPANY PROFILE & FOUNDER SETTINGS (STOREFRONT) */}
          {/* ========================================================= */}
          {activeSection === 'company' && (
            <div className="space-y-6">
              {/* Master Organization Settings Launch Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#FF5757]/15 via-black/40 to-black/40 border border-[#FF5757]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#FF5757]/20 rounded-lg text-[#FF5757] shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Master Organization & Storefront Hub
                    </h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Unified modal for editing company info, founder manifesto, board of directors, and logistics micro-hubs.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOrgSettingsModalOpen(true)}
                  className="px-4 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow flex items-center gap-2 transition shrink-0 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Launch Org Settings Modal</span>
                </button>
              </div>

              {/* Top Banner with Dedicated Edit Modal Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Company Information Card */}
                <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-5 h-5 text-[#FF5757]" />
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Company Info & Identity
                          </h3>
                          <p className="text-[11px] text-stone-400">Legal registration, hotline, tax & delivery parameters</p>
                        </div>
                      </div>
                      <button
                        onClick={handleOpenCompanyEditModal}
                        className="px-3 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Company Info</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-4 text-stone-300">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Brand Wordmark</span>
                        <span className="font-bold text-white font-fashion text-sm">{siteForm.companyName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Legal Entity</span>
                        <span className="text-white line-clamp-1">{siteForm.legalName || 'Apparellex Pvt Ltd'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Customer Support</span>
                        <span className="font-mono text-white text-[11px]">{siteForm.email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Hotline Phone</span>
                        <span className="font-mono text-white text-[11px]">{siteForm.phone || '+1 (800) 555-2791'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Registration No.</span>
                        <span className="font-mono text-white text-[11px]">{siteForm.registrationNumber || 'APX-REG-2024'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block">Tax Identification</span>
                        <span className="font-mono text-white text-[11px]">{siteForm.taxIdentification || 'EIN: 88-9284102-K'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-stone-400 uppercase block">Corporate Headquarters</span>
                        <span className="text-white text-xs">{siteForm.headquarters}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Guaranteed SLA: <b className="text-white font-mono">{siteForm.guaranteedDeliveryMinutes || 10} Mins</b></span>
                    <span>Free Shipping: <b className="text-white font-mono">₹{siteForm.freeShippingThreshold || 1499}</b></span>
                    <span>Sales Tax: <b className="text-white font-mono">{siteForm.taxRatePercentage || 5.0}%</b></span>
                  </div>
                </div>

                {/* Founder Details & Brand Story Card */}
                <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Founder Details & Story
                          </h3>
                          <p className="text-[11px] text-stone-400">Executive portrait, founder statement & brand manifesto</p>
                        </div>
                      </div>
                      <button
                        onClick={handleOpenFounderEditModal}
                        className="px-3 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Founder Details</span>
                      </button>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-stone-800 shrink-0 border border-white/10">
                        <img
                          src={siteForm.founderImage}
                          alt={siteForm.founderName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-white">{siteForm.founderName}</h4>
                        <p className="text-xs text-[#FF5757] font-semibold">{siteForm.founderRole}</p>
                        <p className="text-[11px] text-stone-400 font-mono truncate">{siteForm.founderEmail || 'kamran@apparellex.com'}</p>
                        <p className="text-[11px] text-stone-300 italic line-clamp-2 mt-1">
                          "{siteForm.founderQuote || 'Curated luxury delivered to your doorstep in 10 minutes flat.'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-1 text-xs">
                    <span className="text-[10px] text-stone-400 uppercase block font-semibold">About Headline</span>
                    <p className="text-white font-bold text-xs">{siteForm.aboutTitle}</p>
                    <p className="text-stone-400 text-[11px] line-clamp-2 leading-relaxed mt-1">
                      {siteForm.aboutIntro}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. SOCIAL CHANNELS & WHATSAPP CONCIERGE SECTION */}
          {/* ========================================================= */}
          {activeSection === 'social' && (
            <div className="space-y-6">
              {/* Add Social Link */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Add External Social or Dispatch Channel
                  </h3>
                  <Share2 className="w-4 h-4 text-[#FF5757]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Channel Name</label>
                    <input
                      type="text"
                      placeholder="e.g. YouTube Runway"
                      value={newSocial.label}
                      onChange={(e) => setNewSocial({ ...newSocial, label: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Account Handle</label>
                    <input
                      type="text"
                      placeholder="@ApparellexRunway"
                      value={newSocial.handle || ''}
                      onChange={(e) => setNewSocial({ ...newSocial, handle: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Destination URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newSocial.url}
                      onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddSocial}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect Channel</span>
                  </button>
                </div>
              </div>

              {/* Connected Channels List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {siteForm.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-[#141417] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{link.label}</span>
                        {link.handle && (
                          <span className="text-[10px] text-stone-400 font-mono">{link.handle}</span>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#FF5757] hover:underline truncate block max-w-xs mt-0.5"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updated = [...siteForm.socialLinks];
                          updated[index] = { ...updated[index], enabled: updated[index].enabled !== false ? false : true };
                          const newSettings = { ...siteForm, socialLinks: updated };
                          setSiteForm(newSettings);
                          if (onUpdateSiteSettings) onUpdateSiteSettings(newSettings);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                          link.enabled !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-500'
                        }`}
                      >
                        {link.enabled !== false ? 'VISIBLE' : 'HIDDEN'}
                      </button>
                      <button
                        onClick={() => handleRemoveSocial(index)}
                        className="text-stone-400 hover:text-red-400 transition p-1"
                        title="Remove link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 11. SEO & LEGAL POLICIES SECTION */}
          {/* ========================================================= */}
          {activeSection === 'seo_legal' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Search Engine Optimization (SEO) & Metadata
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Configure titles, meta descriptions, and OpenGraph social share card settings.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Global Meta Title (Browser & Search)</label>
                    <input
                      type="text"
                      value={siteForm.metaTitle || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, metaTitle: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Search Meta Description</label>
                    <textarea
                      rows={2}
                      value={siteForm.metaDescription || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, metaDescription: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Indexing Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={siteForm.metaKeywords || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, metaKeywords: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Store Policies & Doorstep Try-On Terms
                  </h3>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">10-Minute Hyperlocal Delivery Policy</label>
                    <textarea
                      rows={2}
                      value={siteForm.shippingPolicy || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, shippingPolicy: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Doorstep Fit & Return Policy</label>
                    <textarea
                      rows={2}
                      value={siteForm.returnPolicy || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, returnPolicy: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Privacy & Data Handling Policy</label>
                    <textarea
                      rows={2}
                      value={siteForm.privacyPolicy || ''}
                      onChange={(e) => setSiteForm({ ...siteForm, privacyPolicy: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveAllSettings}
                    className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save SEO & Policies</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 12. ADMIN USERS & ROLES SECTION */}
          {/* ========================================================= */}
          {activeSection === 'admins' && (
            <div className="space-y-6">
              {/* Add Admin Form */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Add Administrative User Account
                  </h3>
                  <Shield className="w-4 h-4 text-[#FF5757]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Administrator Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Rostova"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="elena@apparellex.com"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1">Role & Privilege Level</label>
                    <select
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as AdminUserAccount['role'] })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                    >
                      <option value="Super Admin">Super Admin (Full Root Access)</option>
                      <option value="Store Manager">Store Manager (Operations & Orders)</option>
                      <option value="Catalog Lead">Catalog Lead (Product Management)</option>
                      <option value="Support Agent">Support Agent (Customer Tickets)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddAdminUser}
                    className="px-4 py-1.5 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Provision Admin User</span>
                  </button>
                </div>
              </div>

              {/* Admin Users Table */}
              <div className="rounded-xl bg-[#141417] border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/40 border-b border-white/10 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Admin Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role Privileges</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(siteForm.adminUsers || []).map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-bold text-white">{user.name}</td>
                        <td className="py-3 px-4 text-stone-300 font-mono text-[11px]">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-400 text-[11px]">{user.lastActive}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteAdminUser(user.id)}
                            className="text-stone-400 hover:text-red-400 transition p-1"
                            title="Revoke access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 13. SYSTEM SETTINGS & AUDIT LOG SECTION */}
          {/* ========================================================= */}
          {activeSection === 'system' && (
            <div className="space-y-6">
              {/* Database Backup & Export Card */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Database Backup & Restoration
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Export full store snapshot or restore products, orders, employees, and settings.
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleExportDataJSON}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>

                  <label className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg border border-white/10 flex items-center gap-2 cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    <span>Restore from JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportDataJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Audit Log Table */}
              <div className="p-6 rounded-xl bg-[#141417] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Full System Audit Log
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">
                    {(siteForm.auditLogs || []).length} logged events
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/40 border-b border-white/10 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Operator</th>
                        <th className="py-2.5 px-3">Action Description</th>
                        <th className="py-2.5 px-3">System Module</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(siteForm.auditLogs || []).map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition">
                          <td className="py-2 px-3 font-mono text-[11px] text-stone-400">{log.timestamp}</td>
                          <td className="py-2 px-3 font-semibold text-white">{log.operator}</td>
                          <td className="py-2 px-3 text-stone-200">{log.action}</td>
                          <td className="py-2 px-3">
                            <span className="text-[10px] text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                              {log.module}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 1. DEDICATED STAFF / EMPLOYEE EDIT MODAL */}
      {/* ========================================================= */}
      {editingEmployeeIndex !== null && employeeEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bike className="w-5 h-5 text-[#FF5757]" />
                <h3 className="text-base font-bold text-white">Edit Staff Member & Courier</h3>
              </div>
              <button
                onClick={() => setEditingEmployeeIndex(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-stone-800">
              {/* Live Image Preview + URL input */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-800 shrink-0 border border-white/10">
                  <img
                    src={employeeEditForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'}
                    alt={employeeEditForm.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-stone-400 text-[11px] mb-1">Photo Image URL</label>
                  <input
                    type="url"
                    value={employeeEditForm.image || ''}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, image: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={employeeEditForm.name}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={employeeEditForm.employeeCode || ''}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, employeeCode: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Operational Role</label>
                  <select
                    value={employeeEditForm.role}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, role: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="Electric Courier">Electric Courier</option>
                    <option value="Doorstep Stylist">Doorstep Stylist</option>
                    <option value="Dark Store Associate">Dark Store Associate</option>
                    <option value="Garment Care & Steamer">Garment Care & Steamer</option>
                    <option value="Hub Dispatch Supervisor">Hub Dispatch Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Assigned Micro-Hub</label>
                  <select
                    value={employeeEditForm.assignedHub || ''}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, assignedHub: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  >
                    {(siteForm.microHubs || []).map((h) => (
                      <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Shift Status</label>
                  <select
                    value={employeeEditForm.status || 'Available at Hub'}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, status: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="Active on Route">Active on Route</option>
                    <option value="Available at Hub">Available at Hub</option>
                    <option value="On Break">On Break</option>
                    <option value="Off Duty">Off Duty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={employeeEditForm.phone || ''}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, phone: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Vehicle / Gear Assigned</label>
                  <input
                    type="text"
                    value={employeeEditForm.vehicle || ''}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, vehicle: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Completed Deliveries</label>
                  <input
                    type="number"
                    value={employeeEditForm.deliveriesCompleted ?? 0}
                    onChange={(e) => setEmployeeEditForm({ ...employeeEditForm, deliveriesCompleted: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3 bg-[#111113]">
              <button
                onClick={() => setEditingEmployeeIndex(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEmployeeEdit}
                className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow"
              >
                Save Staff Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DEDICATED BOARD OF DIRECTORS EDIT MODAL */}
      {/* ========================================================= */}
      {editingDirectorIndex !== null && directorEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-[#FF5757]" />
                <h3 className="text-base font-bold text-white">Edit Executive Board Director</h3>
              </div>
              <button
                onClick={() => setEditingDirectorIndex(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-stone-800">
              {/* Live Portrait Preview + URL input */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-stone-800 shrink-0 border border-white/10">
                  <img
                    src={directorEditForm.image || 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80'}
                    alt={directorEditForm.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-stone-400 text-[11px] mb-1">Director Portrait URL</label>
                  <input
                    type="url"
                    value={directorEditForm.image || ''}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, image: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Director Full Name</label>
                  <input
                    type="text"
                    value={directorEditForm.name}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Official Board Title</label>
                  <input
                    type="text"
                    value={directorEditForm.role}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, role: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Department</label>
                  <input
                    type="text"
                    value={directorEditForm.department || 'Executive Board'}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, department: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Appointed Year</label>
                  <input
                    type="text"
                    value={directorEditForm.appointedYear || '2024'}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, appointedYear: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Official Email</label>
                  <input
                    type="email"
                    value={directorEditForm.email || ''}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={directorEditForm.linkedin || ''}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, linkedin: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Executive Biography & Mandate</label>
                  <textarea
                    rows={3}
                    value={directorEditForm.bio || ''}
                    onChange={(e) => setDirectorEditForm({ ...directorEditForm, bio: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3 bg-[#111113]">
              <button
                onClick={() => setEditingDirectorIndex(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDirectorEdit}
                className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow"
              >
                Save Director Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DEDICATED LOGISTICS / MICRO-HUB EDIT MODAL */}
      {/* ========================================================= */}
      {editingHubId !== null && hubEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#FF5757]" />
                <h3 className="text-base font-bold text-white">Edit Micro-Hub Logistics</h3>
              </div>
              <button
                onClick={() => setEditingHubId(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Micro-Hub Name</label>
                  <input
                    type="text"
                    value={hubEditForm.name}
                    onChange={(e) => setHubEditForm({ ...hubEditForm, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Unique Code</label>
                  <input
                    type="text"
                    value={hubEditForm.code}
                    onChange={(e) => setHubEditForm({ ...hubEditForm, code: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white uppercase font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Street Address</label>
                  <input
                    type="text"
                    value={hubEditForm.address}
                    onChange={(e) => setHubEditForm({ ...hubEditForm, address: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Coverage Radius (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hubEditForm.serviceRadiusKm}
                    onChange={(e) => setHubEditForm({ ...hubEditForm, serviceRadiusKm: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Active Couriers</label>
                  <input
                    type="number"
                    min="1"
                    value={hubEditForm.activeCouriers}
                    onChange={(e) => setHubEditForm({ ...hubEditForm, activeCouriers: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Electric Fleet Count</label>
                  <input
                    type="number"
                    min="1"
                    value={hubEditForm.electricFleetCount}
                    onChange={(e) => setHubEditForm({ ...hubEditForm, electricFleetCount: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Avg Fulfillment SLA (Mins)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hubEditForm.avgFulfillmentMins}
                    onChange={(e) => setHubEditForm({ ...hubEditForm, avgFulfillmentMins: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono font-bold text-emerald-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Operational Status</label>
                  <select
                    value={hubEditForm.status}
                    onChange={(e) =>
                      setHubEditForm({
                        ...hubEditForm,
                        status: e.target.value as MicroHubInfo['status'],
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="Fully Operational">Fully Operational</option>
                    <option value="High Demand">High Demand</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3 bg-[#111113]">
              <button
                onClick={() => setEditingHubId(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHubEdit}
                className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow"
              >
                Save Logistics Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DEDICATED COMPANY INFO EDIT MODAL (STOREFRONT) */}
      {/* ========================================================= */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#FF5757]" />
                <h3 className="text-base font-bold text-white">Edit Company & Legal Information</h3>
              </div>
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Company Brand Wordmark</label>
                  <input
                    type="text"
                    value={companyEditForm.companyName || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, companyName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Legal Registered Entity</label>
                  <input
                    type="text"
                    value={companyEditForm.legalName || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, legalName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={companyEditForm.tagline || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, tagline: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Customer Support Email</label>
                  <input
                    type="email"
                    value={companyEditForm.email || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Support Hotline Phone</label>
                  <input
                    type="text"
                    value={companyEditForm.phone || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, phone: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={companyEditForm.registrationNumber || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, registrationNumber: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Tax EIN / Tax ID</label>
                  <input
                    type="text"
                    value={companyEditForm.taxIdentification || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, taxIdentification: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Corporate Headquarters Address</label>
                  <input
                    type="text"
                    value={companyEditForm.headquarters || ''}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, headquarters: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Delivery SLA Promise (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={companyEditForm.guaranteedDeliveryMinutes ?? 10}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, guaranteedDeliveryMinutes: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Free Delivery Basket Minimum (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={companyEditForm.freeShippingThreshold ?? 1499}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Sales Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={companyEditForm.taxRatePercentage ?? 8.5}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, taxRatePercentage: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={companyEditForm.currency || '$ USD'}
                    onChange={(e) => setCompanyEditForm({ ...companyEditForm, currency: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3 bg-[#111113]">
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCompanyEdit}
                className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow"
              >
                Save Company Information
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. DEDICATED FOUNDER DETAILS & STORY EDIT MODAL (STOREFRONT) */}
      {/* ========================================================= */}
      {isFounderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Edit Founder Profile & Brand Story</h3>
              </div>
              <button
                onClick={() => setIsFounderModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-stone-800">
              {/* Live Founder Image Preview + URL input */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-stone-800 shrink-0 border border-white/10 shadow-lg">
                  <img
                    src={founderEditForm.founderImage || siteForm.founderImage}
                    alt={founderEditForm.founderName || 'Founder'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-stone-400 text-[11px] mb-1 font-semibold">Founder Portrait Photo URL</label>
                  <input
                    type="url"
                    value={founderEditForm.founderImage || ''}
                    onChange={(e) => setFounderEditForm({ ...founderEditForm, founderImage: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                    placeholder="https://..."
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Updates the primary executive portrait displayed across the homepage and About Us section.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Founder Full Name</label>
                  <input
                    type="text"
                    value={founderEditForm.founderName || ''}
                    onChange={(e) => setFounderEditForm({ ...founderEditForm, founderName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Executive Title</label>
                  <input
                    type="text"
                    value={founderEditForm.founderRole || ''}
                    onChange={(e) => setFounderEditForm({ ...founderEditForm, founderRole: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Founder Direct Email</label>
                  <input
                    type="email"
                    value={founderEditForm.founderEmail || ''}
                    onChange={(e) => setFounderEditForm({ ...founderEditForm, founderEmail: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Founder Quote / Executive Statement</label>
                  <textarea
                    rows={2}
                    value={founderEditForm.founderQuote || ''}
                    onChange={(e) => setFounderEditForm({ ...founderEditForm, founderQuote: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white italic"
                    placeholder="Personal quote featured under executive portrait..."
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-white/5 space-y-3">
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1 font-semibold">About Section Headline</label>
                    <input
                      type="text"
                      value={founderEditForm.aboutTitle || ''}
                      onChange={(e) => setFounderEditForm({ ...founderEditForm, aboutTitle: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1 font-semibold">Brand Origin Story / Short Intro</label>
                    <textarea
                      rows={2}
                      value={founderEditForm.aboutIntro || ''}
                      onChange={(e) => setFounderEditForm({ ...founderEditForm, aboutIntro: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-[11px] mb-1 font-semibold">Full Brand Manifesto & Mission</label>
                    <textarea
                      rows={3}
                      value={founderEditForm.aboutBody || ''}
                      onChange={(e) => setFounderEditForm({ ...founderEditForm, aboutBody: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3 bg-[#111113]">
              <button
                onClick={() => setIsFounderModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFounderEdit}
                className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow"
              >
                Save Founder Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingProductId ? 'Edit Product Catalogue Item' : 'Add New Product Item'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Item Title</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as Product['category'],
                        categoryLabel: getCategoryLabel(e.target.value as Product['category']),
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="urban-street">Urban Street</option>
                    <option value="minimalist-zen">Minimalist Zen</option>
                    <option value="unique-trends">Unique Trends</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Original Price (₹ for discount)</label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.originalPrice || ''}
                    onChange={(e) =>
                    setProductForm({ ...productForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Gender</label>
                  <select
                    value={productForm.gender}
                    onChange={(e) => setProductForm({ ...productForm, gender: e.target.value as Product['gender'] })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Delivery Time (Mins SLA)</label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.estDeliveryMins || 10}
                    onChange={(e) => setProductForm({ ...productForm, estDeliveryMins: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Product Image URL</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Fabric Specification</label>
                  <input
                    type="text"
                    value={productForm.fabric || ''}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Silhouette & Fit</label>
                  <input
                    type="text"
                    value={productForm.fit || ''}
                    onChange={(e) => setProductForm({ ...productForm, fit: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={productSizesInput}
                    onChange={(e) => setProductSizesInput(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 text-[11px] mb-1">Colors (Name:Hex, comma separated)</label>
                  <input
                    type="text"
                    value={productColorsInput}
                    onChange={(e) => setProductColorsInput(e.target.value)}
                    placeholder="Black:#111111, White:#FFFFFF"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 text-[11px] mb-1">Detailed Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                    <input
                      type="checkbox"
                      checked={productForm.isNewDrop || false}
                      onChange={(e) => setProductForm({ ...productForm, isNewDrop: e.target.checked })}
                      className="w-4 h-4 accent-[#FF5757] rounded"
                    />
                    <span>Highlight as VIP "New Drop"</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Promotional Tag (e.g. BESTSELLER)"
                      value={productForm.tag || ''}
                      onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                      className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-end gap-3 bg-[#111113]">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProductModal}
                className="px-5 py-2 bg-[#FF5757] hover:bg-[#ff4242] text-white text-xs font-bold rounded-lg shadow"
              >
                {editingProductId ? 'Update Item' : 'Add to Catalog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ========================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141417] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Order #{selectedOrderDetails.orderId}</h3>
                <p className="text-xs text-stone-400">{selectedOrderDetails.formattedDate}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <p className="text-stone-400 text-[11px] uppercase font-semibold">Customer & Destination</p>
                <p className="font-bold text-white text-sm">{selectedOrderDetails.name}</p>
                <p className="text-stone-300">{selectedOrderDetails.phone}</p>
                <p className="text-stone-400">{selectedOrderDetails.address}</p>
              </div>

              <div className="space-y-2">
                <p className="text-stone-400 text-[11px] uppercase font-semibold">Items in Dispatch Bag</p>
                {selectedOrderDetails.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-black/20 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded bg-stone-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-white">{item.product.name}</p>
                        <p className="text-[10px] text-stone-400">
                          Size: {item.selectedSize} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-white tabular-nums">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm">
                <span className="font-semibold text-stone-300">Total Order Value:</span>
                <span className="font-black text-emerald-400 tabular-nums">₹{selectedOrderDetails.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* UNIFIED MASTER ORGANIZATION SETTINGS MODAL */}
      {/* ========================================================= */}
      <OrganizationSettingsModal
        isOpen={isOrgSettingsModalOpen}
        onClose={() => setIsOrgSettingsModalOpen(false)}
        settings={siteForm}
        onSave={handleSaveOrganizationModal}
      />
    </div>
  );
};
