export interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    dark: string;
    text: string;
    textLight: string;
    success: string;
    error: string;
    warning: string;
}

export interface FontSettings {
    primary: string;
    heading: string;
    weights: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
    };
}

export interface ImageAsset {
    id: number | string;
    image: string;
}

export interface HomeImage extends ImageAsset {
    title: string;
    categoryId: string;
    subCategoryId: string;
}

export interface BrandingImages {
    logo: string;
    logoWhite: string;
    favicon: string;
    ogImage: string;
    hero: string;
    loginBanner: string;
    appScreen1: string;
    appScreen2: string;
    playStoreBadge: string;
    appStoreBadge: string;
    orderHistoryImage: string;
    banners: ImageAsset[];
    homeImages: HomeImage[];
}

export interface SocialMedia {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
}

export interface ContactInfo {
    phone: string;
    email: string;
    supportEmail: string;
    address: string;
    phonePrefix: string;
}

export interface BusinessSettings {
    currency: string;
    currencySymbol: string;
    locale: string;
    timezone: string;
    taxRate: number;
    deliveryFee: number;
    minOrderAmount: number;
    menuPdf: string;
}

export interface SEOSettings {
    title: string;
    description: string;
    keywords: string[];
    author: string;
}

export interface AppFeatures {
    delivery: boolean;
    pickup: boolean;
    dineIn: boolean;
    onlinePayment: boolean;
    cashOnDelivery: boolean;
    loyaltyProgram: boolean;
    giftCards: boolean;
    scheduling: boolean;
    vouchers: boolean;
}

export interface TenantBranding {
    id: string;
    name: string;
    slug: string;
    colors: BrandColors;
    fonts: FontSettings;
    images: BrandingImages;
    socialMedia: SocialMedia;
    contact: ContactInfo;
    business: BusinessSettings;
    seo: SEOSettings;
    features: AppFeatures;
}
