export interface SocialLink {
  label: string;
  url: string;
  handle?: string;
  enabled?: boolean;
}

export interface BoardMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  department?: string;
  email?: string;
  linkedin?: string;
  appointedYear?: string;
}

export interface TeamMember {
  id?: string;
  employeeCode?: string;
  name: string;
  role: string;
  department?: string;
  assignedHub?: string;
  phone?: string;
  status?: 'Active on Route' | 'Available at Hub' | 'On Break' | 'Off Duty' | string;
  image?: string;
  vehicle?: string;
  deliveriesCompleted?: number;
  avgSlaMinutes?: number;
  rating?: number;
  joinedDate?: string;
}

export interface PromoCoupon {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
  usageCount: number;
  expiryDate: string;
}

export interface MicroHubInfo {
  id: string;
  name: string;
  code: string;
  address: string;
  serviceRadiusKm: number;
  activeCouriers: number;
  electricFleetCount: number;
  avgFulfillmentMins: number;
  status: 'Fully Operational' | 'High Demand' | 'Maintenance';
}

export interface AdminUserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Store Manager' | 'Catalog Lead' | 'Support Agent';
  status: 'Active' | 'Suspended';
  lastActive: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  module: string;
}

export interface SiteSettings {
  // Brand & Company Profile
  companyName: string;
  legalName?: string;
  tagline?: string;
  founderName: string;
  founderRole: string;
  founderImage: string;
  founderQuote?: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutBody: string;
  registrationNumber?: string;
  taxIdentification?: string;
  headquarters?: string;
  email: string;
  founderEmail?: string;
  phone?: string;
  operatingHours?: string;

  // Store Operations & Fulfillment
  isStoreLive?: boolean;
  maintenanceMode?: boolean;
  announcementBarText?: string;
  showAnnouncementBar?: boolean;
  guaranteedDeliveryMinutes?: number;
  freeShippingThreshold?: number;
  taxRatePercentage?: number;
  currency?: string;

  // People & Governance
  directors: BoardMember[];
  employees: TeamMember[];
  adminUsers?: AdminUserAccount[];

  // Infrastructure & Promotions
  microHubs?: MicroHubInfo[];
  coupons?: PromoCoupon[];

  // Outreach & Marketing
  socialLinks: SocialLink[];

  // SEO & Legal
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;

  // Audit Log
  auditLogs?: AuditLogItem[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'Apparellex',
  legalName: 'Apparellex Technologies & Fashion Private Limited',
  tagline: 'Hyperlocal 10-Minute Luxury & Modern Streetwear',
  founderName: 'Shaikh Kamran',
  founderRole: 'Founder & CEO, Apparellex',
  founderImage:
    'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80',
  founderQuote:
    'Fashion was either fast and low-quality, or premium and agonizingly slow. We built Apparellex to deliver runway-grade perfection in 10 minutes flat.',
  aboutTitle: 'REDEFINING THE RETAIL ECOSYSTEM',
  aboutIntro:
    'Founded by Shaikh Kamran, Apparellex is a high-octane fashion startup designed for the modern disruptor. We noticed a flaw in the world: fashion was either fast and low-quality, or premium and agonizingly slow.',
  aboutBody:
    'We bridged the gap. Apparellex combines curated luxury with instant gratification. We do not just sell clothes; we provide a 10-minute gateway to your best self. Every stitch, every delivery, and every digital interaction is engineered to make you feel like the world is your runway.',
  registrationNumber: 'APX-REG-2024-90817-MH',
  taxIdentification: 'GSTIN: 27AAPCA9284K1ZV',
  headquarters: 'Apparellex Flagship Tower, New Link Road, Oshiwara, Andheri West, Mumbai, Maharashtra 400053',
  email: 'Apparellexsk@gmail.com',
  founderEmail: 'kamran@apparellex.com',
  phone: '+91 (022) 2630-1090',
  operatingHours: '24/7 Automated Dark Store Micro-Hubs · Continuous 10m SLA',

  isStoreLive: true,
  maintenanceMode: false,
  announcementBarText: '⚡ 10-Minute Instant Fashion Delivery Active in Andheri West, Mumbai · Doorstep Try-On Available',
  showAnnouncementBar: true,
  guaranteedDeliveryMinutes: 10,
  freeShippingThreshold: 1499,
  taxRatePercentage: 5.0,
  currency: '₹ INR',

  socialLinks: [
    { label: 'Instagram', url: 'https://instagram.com/apparellex', handle: '@Apparellex', enabled: true },
    { label: 'Twitter / X', url: 'https://twitter.com/apparellex', handle: '@ApparellexHQ', enabled: true },
    { label: 'Facebook', url: 'https://facebook.com/apparellex', handle: 'Apparellex Official', enabled: true },
    { label: 'WhatsApp', url: 'https://wa.me/15550192834', handle: '+1 (555) 019-2834', enabled: true },
    { label: 'TikTok', url: 'https://tiktok.com/@apparellexdrops', handle: '@ApparellexDrops', enabled: true },
    { label: 'LinkedIn', url: 'https://linkedin.com/company/apparellex', handle: 'apparellex-luxury', enabled: true },
    { label: 'YouTube', url: 'https://youtube.com/@apparellex', handle: 'Apparellex Runway', enabled: false },
    { label: 'Discord', url: 'https://discord.gg/apparellex', handle: 'Apparellex VIP Vault', enabled: true },
  ],

  directors: [
    {
      id: 'dir-1',
      name: 'Shaikh Kamran',
      role: 'Founder & Chief Executive Officer',
      department: 'Executive Board',
      bio: 'Pioneer of the 10-minute micro-hub luxury model. Oversees corporate direction, high-density dark store infrastructure, and global luxury textile curation.',
      image: 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80',
      email: 'kamran@apparellex.com',
      linkedin: 'https://linkedin.com',
      appointedYear: '2024',
    },
    {
      id: 'dir-2',
      name: 'Amelia Hart',
      role: 'Board Director & Strategy',
      department: 'Executive Board',
      bio: 'Brand strategy and international expansion architect across digital-first retail ecosystems.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      email: 'amelia.hart@apparellex.com',
      linkedin: 'https://linkedin.com',
      appointedYear: '2024',
    },
    {
      id: 'dir-3',
      name: 'Dorian Lee',
      role: 'Operations & Logistics Director',
      department: 'Operations',
      bio: 'Micro-fulfillment network design, electric fleet telemetry, and automated routing algorithm innovator.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      email: 'dorian.lee@apparellex.com',
      linkedin: 'https://linkedin.com',
      appointedYear: '2024',
    },
    {
      id: 'dir-4',
      name: 'Aria Chen',
      role: 'Chief Technology Officer',
      department: 'Engineering',
      bio: 'Specialist in real-time geospatial telemetry and predictive micro-hub inventory replenishment.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
      email: 'aria.chen@apparellex.com',
      linkedin: 'https://linkedin.com',
      appointedYear: '2025',
    },
  ],

  employees: [
    {
      id: 'emp-1',
      employeeCode: 'APX-RIDER-012',
      name: 'Tariq Mansoor',
      role: 'Electric Courier',
      department: 'Logistics Fleet',
      assignedHub: 'Downtown Flagship Hub #1',
      phone: '+1 (555) 019-2834',
      status: 'Active on Route',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
      vehicle: 'Super73 RX Electric Cargo (Bike #04)',
      deliveriesCompleted: 482,
      avgSlaMinutes: 8.4,
      rating: 4.98,
      joinedDate: 'Nov 2024',
    },
    {
      id: 'emp-2',
      employeeCode: 'APX-RIDER-019',
      name: 'Zackariah Vance',
      role: 'Electric Courier',
      department: 'Logistics Fleet',
      assignedHub: 'Westside Express Hub #2',
      phone: '+1 (555) 019-8812',
      status: 'Available at Hub',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      vehicle: 'Custom Electric Moped (Fleet #09)',
      deliveriesCompleted: 319,
      avgSlaMinutes: 8.9,
      rating: 4.92,
      joinedDate: 'Jan 2025',
    },
    {
      id: 'emp-3',
      employeeCode: 'APX-OPS-041',
      name: 'Devon Miller',
      role: 'Garment Care & Steamer',
      department: 'Micro-Hub Operations',
      assignedHub: 'Downtown Flagship Hub #1',
      phone: '+1 (555) 014-9921',
      status: 'Available at Hub',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
      deliveriesCompleted: 890,
      avgSlaMinutes: 2.1,
      rating: 5.0,
      joinedDate: 'Oct 2024',
    },
    {
      id: 'emp-4',
      employeeCode: 'APX-STYLIST-007',
      name: 'Chloe Dupont',
      role: 'Doorstep Stylist',
      department: 'Customer Experience',
      assignedHub: 'Uptown Luxury Node #3',
      phone: '+1 (555) 016-4432',
      status: 'Active on Route',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
      vehicle: 'Apparellex Smart EV Pouch #02',
      deliveriesCompleted: 214,
      avgSlaMinutes: 9.1,
      rating: 4.97,
      joinedDate: 'Feb 2025',
    },
    {
      id: 'emp-5',
      employeeCode: 'APX-MGR-002',
      name: 'Sami Al-Hassan',
      role: 'Hub Dispatch Supervisor',
      department: 'Micro-Hub Operations',
      assignedHub: 'Westside Express Hub #2',
      phone: '+1 (555) 011-7722',
      status: 'Available at Hub',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80',
      deliveriesCompleted: 1420,
      avgSlaMinutes: 1.8,
      rating: 4.95,
      joinedDate: 'Sep 2024',
    },
  ],

  adminUsers: [
    {
      id: 'usr-1',
      name: 'Shaikh Kamran',
      email: 'admin@apparellex.com',
      role: 'Super Admin',
      status: 'Active',
      lastActive: 'Just now',
    },
    {
      id: 'usr-2',
      name: 'Elena Rostova',
      email: 'elena.rostova@apparellex.com',
      role: 'Store Manager',
      status: 'Active',
      lastActive: '12 mins ago',
    },
    {
      id: 'usr-3',
      name: 'Marcus Thorne',
      email: 'marcus.thorne@apparellex.com',
      role: 'Catalog Lead',
      status: 'Active',
      lastActive: '2 hours ago',
    },
    {
      id: 'usr-4',
      name: 'Support Operations',
      email: 'support@apparellex.com',
      role: 'Support Agent',
      status: 'Active',
      lastActive: '1 day ago',
    },
  ],

  microHubs: [
    {
      id: 'hub-1',
      name: 'Andheri West Flagship Pod #1 (Oshiwara)',
      code: 'HUB-BOM-53',
      address: 'Mega Mall, New Link Rd, Oshiwara, Andheri West, Mumbai 400053',
      serviceRadiusKm: 3.5,
      activeCouriers: 6,
      electricFleetCount: 8,
      avgFulfillmentMins: 7.5,
      status: 'Fully Operational',
    },
    {
      id: 'hub-2',
      name: 'Lokhandwala Express Node #2',
      code: 'HUB-LOK-02',
      address: '4th Cross Rd, Lokhandwala Complex, Andheri West, Mumbai 400053',
      serviceRadiusKm: 2.8,
      activeCouriers: 5,
      electricFleetCount: 6,
      avgFulfillmentMins: 6.8,
      status: 'Fully Operational',
    },
    {
      id: 'hub-3',
      name: 'Versova Coastal Micro-Hub #3',
      code: 'HUB-VER-03',
      address: 'Yari Road, Versova, Andheri West, Mumbai 400061',
      serviceRadiusKm: 3.2,
      activeCouriers: 4,
      electricFleetCount: 5,
      avgFulfillmentMins: 8.2,
      status: 'High Demand',
    },
  ],

  coupons: [
    {
      id: 'coup-1',
      code: 'SPEED10',
      discountPercentage: 10,
      minOrderValue: 999,
      description: '10% off on all instant 10-minute streetwear drops',
      isActive: true,
      usageCount: 342,
      expiryDate: '2026-12-31',
    },
    {
      id: 'coup-2',
      code: 'VIP20',
      discountPercentage: 20,
      minOrderValue: 1999,
      description: 'Exclusive 20% discount for VIP Vault members',
      isActive: true,
      usageCount: 189,
      expiryDate: '2026-11-15',
    },
    {
      id: 'coup-3',
      code: 'TRYONFREE',
      discountPercentage: 15,
      minOrderValue: 1499,
      description: 'Complimentary doorstep fit try-on celebration promo',
      isActive: true,
      usageCount: 95,
      expiryDate: '2026-10-31',
    },
  ],

  metaTitle: 'Apparellex — Instant 10-Minute Curated Luxury & Streetwear (Mumbai)',
  metaDescription: 'Shop architectural fashion delivered in 10 minutes or less in Andheri West, Mumbai with complimentary doorstep try-ons and instant zero-friction returns.',
  metaKeywords: 'instant fashion, 10 minute delivery, streetwear, luxury clothing, doorstep try on, apparellex, mumbai fashion, andheri west',
  shippingPolicy: 'Hyperlocal instant delivery via dedicated electric cargo fleet within a strict 10-minute SLA from closest dark store micro-hub.',
  returnPolicy: 'Doorstep Try-On Guarantee: Keep what fits, return anything else instantly with our electric rider before they leave.',
  privacyPolicy: 'Zero data reselling. All addresses and telephone credentials encrypted and expunged 48 hours post fulfillment.',
  termsOfService: 'Apparellex terms apply to all orders placed through the digital terminal or mobile concierge.',

  auditLogs: [
    {
      id: 'log-1',
      timestamp: 'Today · 08:42 AM',
      operator: 'Shaikh Kamran (Super Admin)',
      action: 'Verified micro-hub electric courier battery swap telemetry',
      module: 'Fleet Operations',
    },
    {
      id: 'log-2',
      timestamp: 'Yesterday · 04:15 PM',
      operator: 'Marcus Thorne (Catalog Lead)',
      action: 'Added new seasonal heavyweight hoodie drop',
      module: 'Catalog',
    },
    {
      id: 'log-3',
      timestamp: 'Yesterday · 01:20 PM',
      operator: 'Elena Rostova (Store Manager)',
      action: 'Activated SPEED10 promotional voucher code',
      module: 'Discounts',
    },
  ],
};
