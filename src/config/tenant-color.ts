import { TenantBranding } from '../theme/types';

export const tenantConfig: TenantBranding = {
  id: 'dominos',
  name: "Domino's Pizza",
  slug: 'dominos',

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
    logo: 'https://www.example.com.pk/logo.png',
    logoWhite: 'https://www.example.com.pk/logo.png',
    favicon: 'https://4xs9fttk0t.ucarecd.net/bf778e11-4b19-408a-bf29-415edfbe8ec6/Dominos_pizza_logosvg.png',
    ogImage: 'https://www.example.com.pk/logo.png',
    hero: 'https://www.example.com.pk/logo.png',
    loginBanner: 'https://www.example.com.pk/static/media/loginPage.174f42d2ea8a1e21d517.jpg',
    appScreen1: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop',
    appScreen2: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop',
    playStoreBadge: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
    appStoreBadge: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg',
    orderHistoryImage: 'https://www.dominos.com.pk/static/media/deliveryImagehistory.adbdfd585bb213f60eb8.webp',
    banners: [
      {
        id: 1,
        image: 'https://www.dominos.com.pk/images/95f56d90-df2c-11f0-b506-67f87d305b75-epicsinglemenubanner_desktop_image-2025-12-22115143.jpg',
      },
      {
        id: 2,
        image: 'https://www.dominos.com.pk/images/95f56d90-df2c-11f0-b506-67f87d305b75-epicdoublemenubanner_desktop_image-2025-12-22115143.jpg',
      }
    ],
    homeImages: [
      {
        id: 1,
        image: 'https://www.dominos.com.pk/images/95f56d90-df2c-11f0-b506-67f87d305b75-BestEverDealsredmainbanner_desktop_image-2025-12-22115143.jpg',
        title: 'Explore Menu',
        categoryId: 'deals',
        subCategoryId: 'everyday-value'
      },
      {
        id: 2,
        image: 'https://www.dominos.com.pk/images/6d5a22c0-0193-11f1-afd0-aba8f2dc641c-sidebanner971x518_desktop_image-2026-02-04063333.jpg',
        title: 'Download App',
        categoryId: 'pizzas',
        subCategoryId: 'classic-flavors'
      }
    ],
  },


  socialMedia: {
    facebook: 'https://facebook.com/dominos',
    instagram: 'https://instagram.com/dominos',
    twitter: 'https://twitter.com/dominos',
    youtube: 'https://youtube.com/dominos',
  },

  contact: {
    phone: '+92-300-1111-111',
    email: 'info@dominos.pk',
    supportEmail: 'support@dominos.pk',
    address: 'Domino\'s Pizza Pakistan Headquarters',
    phonePrefix: '92',
  },
  business: {
    currency: 'PKR',
    currencySymbol: 'Rs.',
    locale: 'en-PK',
    timezone: 'Asia/Karachi',
    taxRate: 17,
    deliveryFee: 150,
    minOrderAmount: 500,
    menuPdf: 'https://4xs9fttk0t.ucarecd.net/6657ac30-a990-486e-8aa9-7c5d0ceaf97d/1.jpeg',
  },
  seo: {
    title: "Domino's Pizza – Order Pizza Online for Delivery in Pakistan",
    description:
      'Order delicious pizza online from Domino\'s Pizza Pakistan. Choose from pizzas, sides, desserts & more. Fast delivery and fresh ingredients.',
    keywords: [
      'dominos',
      'pizza delivery',
      'order pizza online',
      'pizza near me',
      'fast food',
      'dominos pakistan',
    ],
    author: "Domino's Pizza",
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
