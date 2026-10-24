import { z } from 'zod';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVip: boolean;
  joinedDate: string;
  tier: 'Guest' | 'VIP Vault Member' | 'Black Card Elite';
  token?: string;
}

export const COUNTRY_CODES = [
  { code: '+1', country: 'US', label: 'United States (+1)', flag: '🇺🇸' },
  { code: '+44', country: 'GB', label: 'United Kingdom (+44)', flag: '🇬🇧' },
  { code: '+33', country: 'FR', label: 'France (+33)', flag: '🇫🇷' },
  { code: '+49', country: 'DE', label: 'Germany (+49)', flag: '🇩🇪' },
  { code: '+39', country: 'IT', label: 'Italy (+39)', flag: '🇮🇹' },
  { code: '+81', country: 'JP', label: 'Japan (+81)', flag: '🇯🇵' },
  { code: '+971', country: 'AE', label: 'UAE (+971)', flag: '🇦🇪' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)', flag: '🇸🇬' },
  { code: '+61', country: 'AU', label: 'Australia (+61)', flag: '🇦🇺' },
  { code: '+91', country: 'IN', label: 'India (+91)', flag: '🇮🇳' },
  { code: '+1', country: 'CA', label: 'Canada (+1)', flag: '🇨🇦' },
];

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Please enter your email or registered phone number')
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s+\-()]{7,16}$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    }, 'Enter a valid email address (e.g. name@domain.com) or phone number'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must contain at least 2 characters')
    .max(60, 'Full name cannot exceed 60 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s+\-()]{7,16}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must include at least one letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms of service'),
  vipPerksConsent: z.boolean().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const otpRequestSchema = z.object({
  countryCode: z.string().min(1, 'Select a country dial code'),
  phone: z
    .string()
    .min(6, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .regex(/^[\d\s\-()]+$/, 'Enter digits only'),
});

export type OtpRequestFormData = z.infer<typeof otpRequestSchema>;

export const otpVerifySchema = z.object({
  code: z
    .string()
    .length(6, 'Enter the 6-digit verification code')
    .regex(/^\d+$/, 'Code must contain only digits'),
});

export type OtpVerifyFormData = z.infer<typeof otpVerifySchema>;

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Please enter your email or registered mobile number')
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\s+\-()]{7,16}$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    }, 'Enter a valid email address or phone number'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
