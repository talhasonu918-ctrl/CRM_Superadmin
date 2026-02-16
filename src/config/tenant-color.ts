import { TenantBranding } from '../theme/types';

export const tenantConfig: TenantBranding = {
  id: 'HotnYum',
  name: "Hot'n Yum",
  slug: 'Hotn Yum',

  colors: {
    primary: '#0078ae',      // Blue - Main brand color for buttons
    secondary: '#e31837',    // Red - Secondary brand color for heart/price
    accent: '#006491',       // Dark Blue - Accent color
    background: '#ffffff',
    dark: '#0f172a',
    text: '#1a1a1a',
    textLight: '#6b7280',
    success: '#00a160',
    error: '#e31837',
    warning: '#ff9800',
  },

  fonts: {
    primary: 'Poppins, system-ui, -apple-system, sans-serif',
    heading: 'Poppins, system-ui, -apple-system, sans-serif',
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  images: {
    logo: '',
    logoWhite: '',
    favicon: '',
    ogImage: '',
    hero: '',
    loginBanner: '',
    appScreen1: '',
    appScreen2: '',
    playStoreBadge: '',
    appStoreBadge: '',
    orderHistoryImage: '',
    banners: [],
    homeImages: [],
  },


  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
  },

  contact: {
    phone: '',
    email: '',
    supportEmail: '',
    address: '',
    phonePrefix: '',
  },
  business: {
    currency: 'PKR',
    currencySymbol: 'Rs.',
    locale: 'en-PK',
    timezone: 'Asia/Karachi',
    taxRate: 0,
    deliveryFee: 0,
    minOrderAmount: 0,
    menuPdf: '',
  },
  seo: {
    title: "",
    description: '',
    keywords: [],
    author: "",
  },
  features: {
    delivery: true,
    pickup: true,
    dineIn: false,
    onlinePayment: true,
    cashOnDelivery: true,
    loyaltyProgram: true,
    giftCards: true,
    scheduling: true,
    vouchers: true,
  },
};
