export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
  deliveryInstructions?: string;
}

export interface UserMeasurements {
  topSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  bottomSize: '28' | '30' | '32' | '34' | '36';
  shoeSize: '7' | '8' | '9' | '10' | '11' | '12';
  heightCm?: number;
  weightKg?: number;
}

export interface ReturnExchangeRequest {
  id: string;
  orderId: string;
  productName: string;
  type: 'return' | 'exchange';
  reason: string;
  requestedAt: string;
  status: 'courier_assigned' | 'in_transit' | 'inspected' | 'completed';
  refundAmount?: number;
  replacementSize?: string;
  etaMinutes: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'men' | 'women' | 'unisex' | 'prefer-not-to-say';
  isVip: boolean;
  vipTier: 'Silver Member' | 'Gold VIP' | 'Black Diamond VIP';
  memberSince: string;
  coinsBalance: number; // Fashion Club / Insider Rewards Coins
  savedAddresses: UserAddress[];
  measurements: UserMeasurements;
  returnRequests?: ReturnExchangeRequest[];
}

export const USER_AUTH_STORAGE_KEY = 'apparellex_customer_user_v2';

export const DEFAULT_CUSTOMER_USER: CustomerUser = {
  id: 'usr-kamran-001',
  name: 'Shaikh Kamran',
  email: 'kamran@apparellex.com',
  phone: '+1 (555) 019-2834',
  gender: 'men',
  isVip: true,
  vipTier: 'Black Diamond VIP',
  memberSince: 'August 2025',
  coinsBalance: 1450,
  savedAddresses: [
    {
      id: 'addr-1',
      name: 'Shaikh Kamran (Home)',
      phone: '+1 (555) 019-2834',
      addressLine: '742 Evergreen Terrace, Apt 4B',
      city: 'Metro Center',
      postalCode: '10001',
      addressType: 'Home',
      isDefault: true,
      deliveryInstructions: 'Leave with 24/7 concierge or ring apartment buzzer 4B.',
    },
    {
      id: 'addr-2',
      name: 'Shaikh Kamran (Studio)',
      phone: '+1 (555) 019-2834',
      addressLine: '108 Mercer Street, Floor 3',
      city: 'SoHo Fashion District, NY',
      postalCode: '10012',
      addressType: 'Work',
      isDefault: false,
      deliveryInstructions: 'Direct elevator access, reception on 3rd floor.',
    },
  ],
  measurements: {
    topSize: 'L',
    bottomSize: '32',
    shoeSize: '10',
    heightCm: 182,
    weightKg: 78,
  },
  returnRequests: [
    {
      id: 'ret-81920',
      orderId: 'APX-762019',
      productName: 'Raw Denim Carpenter Pants',
      type: 'exchange',
      reason: 'Needed one waist size smaller (30)',
      requestedAt: 'Oct 02, 2026 · 11:20 AM',
      status: 'completed',
      replacementSize: 'Size 30',
      etaMinutes: 12,
    },
  ],
};

export const DEMO_USERS: CustomerUser[] = [
  DEFAULT_CUSTOMER_USER,
  {
    id: 'usr-elena-002',
    name: 'Elena Rostova',
    email: 'elena.rostova@fashion.design',
    phone: '+1 (555) 014-8891',
    gender: 'women',
    isVip: true,
    vipTier: 'Gold VIP',
    memberSince: 'January 2026',
    coinsBalance: 920,
    savedAddresses: [
      {
        id: 'addr-elena-1',
        name: 'Elena Rostova',
        phone: '+1 (555) 014-8891',
        addressLine: '450 West 33rd Street, Penthouse 12',
        city: 'Hudson Yards, NY',
        postalCode: '10001',
        addressType: 'Home',
        isDefault: true,
      },
    ],
    measurements: {
      topSize: 'S',
      bottomSize: '28',
      shoeSize: '8',
      heightCm: 174,
      weightKg: 58,
    },
  },
];

export const getStoredCustomer = (): CustomerUser | null => {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMER_USER;
  try {
    const raw = localStorage.getItem(USER_AUTH_STORAGE_KEY);
    if (!raw) return DEFAULT_CUSTOMER_USER;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id) return DEFAULT_CUSTOMER_USER;
    return parsed;
  } catch {
    return DEFAULT_CUSTOMER_USER;
  }
};

export const saveStoredCustomer = (user: CustomerUser | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(USER_AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
};
