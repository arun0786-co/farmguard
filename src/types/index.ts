export interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
    timestamp: Date;
    imageUrl?: string;
    metadata?: {
        type?: "diagnosis" | "soil-analysis" | "crop-recommendation" | "general";
        data?: any;
    };
}

export interface Disease {
    id: string;
    name: string;
    symptoms: string[];
    causes: string[];
    solutions: string[];
    severity: "Low" | "Medium" | "High";
    affectedCrops: string[];
    preventiveMeasures: string[];
}

export interface CropData {
    id: string;
    name: string;
    season: "Kharif" | "Rabi" | "Zaid";
    waterRequirement: "Low" | "Medium" | "High";
    soilTypes: string[];
    duration: number; // days
    marketPrice: number; // per kg
    yieldPerAcre: number; // kg
    profitMargin: number; // percentage
}

export interface SoilReport {
    nitrogen: number; // ppm
    phosphorus: number; // ppm
    potassium: number; // ppm
    ph: number;
    organicMatter: number; // percentage
    recommendations: string[];
}

export interface MarketPrice {
    crop: string;
    price: number;
    unit: string;
    trend: "up" | "down" | "stable";
    change: number; // percentage
    lastUpdated: Date;
}

export interface UserPreferences {
    language: "en" | "hi" | "ta" | "te" | "mr" | "pa";
    location: string;
    farmSize: number; // acres
    darkMode: boolean;
}

export interface ChatContext {
    currentFlow?: "diagnosis" | "soil-analysis" | "crop-recommendation";
    awaitingInput?: string;
    conversationData?: {
        month?: string;
        waterAvailability?: string;
        soilType?: string;
        location?: string;
    };
}
