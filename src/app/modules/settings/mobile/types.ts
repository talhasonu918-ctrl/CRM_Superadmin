export interface MobileSettings {
    appVersion: string;
    webVersion: string;
    apiEndpoint: string;
    maintenanceMode: 'Disabled' | 'Enabled' | 'Scheduled';
    pushNotifications: 'Enabled' | 'Disabled';
    autoUpdates: 'Enabled' | 'Disabled';
    androidStoreUrl: string;
    iosStoreUrl: string;
    supportEmail: string;
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
}

export const defaultMobileSettings: MobileSettings = {
    appVersion: '2.1.4',
    webVersion: '3.0.1',
    apiEndpoint: 'https://api.nexus-food.com/v1',
    maintenanceMode: 'Disabled',
    pushNotifications: 'Enabled',
    autoUpdates: 'Enabled',
    androidStoreUrl: 'https://play.google.com/store/apps/details?id=com.nexus.crm',
    iosStoreUrl: 'https://apps.apple.com/app/nexus-crm/id123456789',
    supportEmail: 'support@nexus-food.com',
    privacyPolicyUrl: 'https://nexus-food.com/privacy',
    termsOfServiceUrl: 'https://nexus-food.com/terms',
};
