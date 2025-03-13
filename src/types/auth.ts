export type UserRole = 'FARMER' | 'VENDOR' | 'CONSUMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Additional fields based on role
  farmLocation?: {
    latitude: number;
    longitude: number;
  };
  vendorDetails?: {
    businessName: string;
    address: string;
  };
}

export interface Permission {
  aiBot: boolean;          // Access to AI crop monitoring and recommendations
  marketplace: boolean;    // Access to buy products
  selling: boolean;       // Ability to sell products
  monitoring: boolean;    // Access to crop monitoring tools
  weather: boolean;       // Access to weather forecasts
  analytics: boolean;     // Access to sales and crop analytics
}

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission> = {
  FARMER: {
    aiBot: true,
    marketplace: true,
    selling: true,
    monitoring: true,
    weather: true,
    analytics: true
  },
  VENDOR: {
    aiBot: false,
    marketplace: true,
    selling: true,
    monitoring: false,
    weather: false,
    analytics: true
  },
  CONSUMER: {
    aiBot: false,
    marketplace: true,
    selling: false,
    monitoring: false,
    weather: false,
    analytics: false
  },
  ADMIN: {
    aiBot: true,
    marketplace: true,
    selling: true,
    monitoring: true,
    weather: true,
    analytics: true
  }
}; 