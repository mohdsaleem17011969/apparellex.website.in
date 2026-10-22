export interface Director {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  email: string;
  linkedin: string;
  appointedYear: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  role: 'Electric Courier' | 'Dark Store Associate' | 'Garment Care & Steamer' | 'Doorstep Stylist' | 'Hub Dispatch Supervisor';
  assignedHub: string;
  phone: string;
  status: 'Active on Route' | 'Available at Hub' | 'On Break' | 'Off Duty';
  vehicle?: string;
  deliveriesCompleted: number;
  avgSlaMinutes: number;
  rating: number;
  joinedDate: string;
}

export interface SocialLinks {
  instagram: { handle: string; url: string; enabled: boolean };
  twitter: { handle: string; url: string; enabled: boolean };
  facebook: { handle: string; url: string; enabled: boolean };
  whatsapp: { phone: string; message: string; enabled: boolean };
  tiktok: { handle: string; url: string; enabled: boolean };
  linkedin: { handle: string; url: string; enabled: boolean };
  youtube: { handle: string; url: string; enabled: boolean };
  discord: { handle: string; url: string; enabled: boolean };
}

export interface CompanyInfo {
  legalName: string;
  brandName: string;
  founderAndCeo: string;
  registrationNumber: string;
  taxIdentification: string;
  headquarters: string;
  supportEmail: string;
  founderEmail: string;
  hotlinePhone: string;
  operatingHours: string;
  missionStatement: string;
  visionStatement: string;
  yearFounded: string;
}

export interface MicroHub {
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

export const INITIAL_COMPANY_INFO: CompanyInfo = {
  legalName: 'Apparellex Technologies & Fashion Private Limited',
  brandName: 'APPARELLEX',
  founderAndCeo: 'Shaikh Kamran',
  registrationNumber: 'APX-REG-2024-90817-DL',
  taxIdentification: 'EIN: 88-9284102-K',
  headquarters: 'Suite 900, Luxury Fashion District Tower, Metro Center, NY 10001',
  supportEmail: 'Apparellexsk@gmail.com',
  founderEmail: 'kamran@apparellex.com',
  hotlinePhone: '+1 (800) 555-2791',
  operatingHours: '24/7 Automated Dark Store Micro-Hubs · Continuous 10m SLA',
  missionStatement: 'Bridging the divide between high-end architectural fashion and instant gratification via hyperlocal electric courier micro-fulfillment.',
  visionStatement: 'To make the global sidewalk your personal runway delivered in 10 minutes or less with complimentary doorstep fit checks.',
  yearFounded: '2024',
};

export const INITIAL_DIRECTORS: Director[] = [
  {
    id: 'dir-1',
    name: 'Shaikh Kamran',
    role: 'Founder & Chief Executive Officer',
    department: 'Executive Board',
    bio: 'Pioneer of the 10-minute micro-hub fashion model. Oversees brand vision, high-density dark store infrastructure, and global luxury textile curation.',
    image: 'https://images.unsplash.com/photo-1523381235312-da5941254381?auto=format&fit=crop&w=800&q=80',
    email: 'kamran@apparellex.com',
    linkedin: 'https://linkedin.com',
    appointedYear: '2024',
  },
  {
    id: 'dir-2',
    name: 'Elena Rostova',
    role: 'Chief Operating Officer & Head of Logistics',
    department: 'Operations',
    bio: 'Former global supply chain architect. Developed the sub-10-minute autonomous order verification and electric dispatch algorithms.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    email: 'elena.rostova@apparellex.com',
    linkedin: 'https://linkedin.com',
    appointedYear: '2024',
  },
  {
    id: 'dir-3',
    name: 'Marcus Thorne',
    role: 'Creative & Design Director',
    department: 'Design & Curation',
    bio: 'Former Milan & Paris runway tailoring lead. Directs the signature 480 GSM French Terry and organic compact poplin drops.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    email: 'marcus.thorne@apparellex.com',
    linkedin: 'https://linkedin.com',
    appointedYear: '2024',
  },
  {
    id: 'dir-4',
    name: 'Aria Chen',
    role: 'Chief Technology Officer',
    department: 'Engineering & Radar',
    bio: 'Specialist in real-time geospatial telemetry and predictive micro-hub demand routing for zero-delay deliveries.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    email: 'aria.chen@apparellex.com',
    linkedin: 'https://linkedin.com',
    appointedYear: '2025',
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    employeeCode: 'APX-RIDER-012',
    name: 'Tariq Mansoor',
    role: 'Electric Courier',
    assignedHub: 'Downtown Flagship Hub #1',
    phone: '+1 (555) 019-2834',
    status: 'Active on Route',
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
    assignedHub: 'Westside Express Hub #2',
    phone: '+1 (555) 019-8812',
    status: 'Available at Hub',
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
    assignedHub: 'Downtown Flagship Hub #1',
    phone: '+1 (555) 014-9921',
    status: 'Available at Hub',
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
    assignedHub: 'Uptown Luxury Node #3',
    phone: '+1 (555) 016-4432',
    status: 'Active on Route',
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
    assignedHub: 'Westside Express Hub #2',
    phone: '+1 (555) 011-7722',
    status: 'Available at Hub',
    deliveriesCompleted: 1420,
    avgSlaMinutes: 1.8,
    rating: 4.95,
    joinedDate: 'Sep 2024',
  },
];

export const INITIAL_SOCIAL_LINKS: SocialLinks = {
  instagram: {
    handle: '@Apparellex',
    url: 'https://instagram.com/apparellex',
    enabled: true,
  },
  twitter: {
    handle: '@ApparellexHQ',
    url: 'https://twitter.com/apparellex',
    enabled: true,
  },
  facebook: {
    handle: 'Apparellex Official',
    url: 'https://facebook.com/apparellex',
    enabled: true,
  },
  whatsapp: {
    phone: '+1 (555) 019-2834',
    message: 'Check out Apparellex — 10-minute luxury fashion delivered to your doorstep! https://ais-pre-nymurarspls3yqnu5ugsbj-563741178923.asia-southeast1.run.app',
    enabled: true,
  },
  tiktok: {
    handle: '@ApparellexDrops',
    url: 'https://tiktok.com/@apparellexdrops',
    enabled: true,
  },
  linkedin: {
    handle: 'apparellex-luxury',
    url: 'https://linkedin.com/company/apparellex',
    enabled: true,
  },
  youtube: {
    handle: 'Apparellex Runway',
    url: 'https://youtube.com/@apparellex',
    enabled: false,
  },
  discord: {
    handle: 'Apparellex VIP Vault',
    url: 'https://discord.gg/apparellex',
    enabled: true,
  },
};

export const INITIAL_MICRO_HUBS: MicroHub[] = [
  {
    id: 'hub-1',
    name: 'Downtown Flagship Dark Store #1',
    code: 'HUB-DTN-01',
    address: '442 Broadway St, Metro Center',
    serviceRadiusKm: 4.2,
    activeCouriers: 6,
    electricFleetCount: 8,
    avgFulfillmentMins: 7.9,
    status: 'Fully Operational',
  },
  {
    id: 'hub-2',
    name: 'Westside Express Node #2',
    code: 'HUB-WST-02',
    address: '118 10th Ave, Arts & High Line District',
    serviceRadiusKm: 3.8,
    activeCouriers: 4,
    electricFleetCount: 6,
    avgFulfillmentMins: 8.3,
    status: 'Fully Operational',
  },
  {
    id: 'hub-3',
    name: 'Uptown Luxury Micro-Hub #3',
    code: 'HUB-UPT-03',
    address: '820 Madison Ave, Upper East Quarter',
    serviceRadiusKm: 3.5,
    activeCouriers: 5,
    electricFleetCount: 6,
    avgFulfillmentMins: 8.6,
    status: 'High Demand',
  },
];
