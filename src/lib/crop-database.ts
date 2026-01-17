import { CropData } from "@/types";

export const cropDatabase: CropData[] = [
    // Kharif Crops (Monsoon: June-September)
    {
        id: "rice",
        name: "Rice (Paddy)",
        season: "Kharif",
        waterRequirement: "High",
        soilTypes: ["Clay", "Loamy"],
        duration: 120,
        marketPrice: 22,
        yieldPerAcre: 2000,
        profitMargin: 35,
    },
    {
        id: "cotton",
        name: "Cotton",
        season: "Kharif",
        waterRequirement: "Medium",
        soilTypes: ["Black", "Loamy"],
        duration: 150,
        marketPrice: 65,
        yieldPerAcre: 400,
        profitMargin: 45,
    },
    {
        id: "maize",
        name: "Maize (Corn)",
        season: "Kharif",
        waterRequirement: "Medium",
        soilTypes: ["Loamy", "Sandy Loam"],
        duration: 90,
        marketPrice: 18,
        yieldPerAcre: 1200,
        profitMargin: 40,
    },
    {
        id: "soybean",
        name: "Soybean",
        season: "Kharif",
        waterRequirement: "Medium",
        soilTypes: ["Black", "Loamy"],
        duration: 100,
        marketPrice: 45,
        yieldPerAcre: 600,
        profitMargin: 38,
    },
    {
        id: "groundnut",
        name: "Groundnut",
        season: "Kharif",
        waterRequirement: "Medium",
        soilTypes: ["Sandy", "Loamy"],
        duration: 120,
        marketPrice: 55,
        yieldPerAcre: 800,
        profitMargin: 42,
    },

    // Rabi Crops (Winter: October-March)
    {
        id: "wheat",
        name: "Wheat",
        season: "Rabi",
        waterRequirement: "Medium",
        soilTypes: ["Loamy", "Clay"],
        duration: 120,
        marketPrice: 25,
        yieldPerAcre: 1500,
        profitMargin: 40,
    },
    {
        id: "mustard",
        name: "Mustard",
        season: "Rabi",
        waterRequirement: "Low",
        soilTypes: ["Loamy", "Sandy"],
        duration: 90,
        marketPrice: 55,
        yieldPerAcre: 400,
        profitMargin: 45,
    },
    {
        id: "gram",
        name: "Gram (Chana)",
        season: "Rabi",
        waterRequirement: "Low",
        soilTypes: ["Black", "Loamy"],
        duration: 100,
        marketPrice: 50,
        yieldPerAcre: 500,
        profitMargin: 48,
    },
    {
        id: "barley",
        name: "Barley",
        season: "Rabi",
        waterRequirement: "Low",
        soilTypes: ["Loamy", "Sandy"],
        duration: 110,
        marketPrice: 20,
        yieldPerAcre: 1000,
        profitMargin: 35,
    },
    {
        id: "peas",
        name: "Peas",
        season: "Rabi",
        waterRequirement: "Medium",
        soilTypes: ["Loamy", "Clay"],
        duration: 80,
        marketPrice: 40,
        yieldPerAcre: 600,
        profitMargin: 42,
    },

    // Zaid Crops (Summer: April-May)
    {
        id: "watermelon",
        name: "Watermelon",
        season: "Zaid",
        waterRequirement: "High",
        soilTypes: ["Sandy", "Loamy"],
        duration: 70,
        marketPrice: 15,
        yieldPerAcre: 3000,
        profitMargin: 50,
    },
    {
        id: "cucumber",
        name: "Cucumber",
        season: "Zaid",
        waterRequirement: "High",
        soilTypes: ["Loamy", "Sandy"],
        duration: 60,
        marketPrice: 20,
        yieldPerAcre: 2000,
        profitMargin: 48,
    },
    {
        id: "muskmelon",
        name: "Muskmelon",
        season: "Zaid",
        waterRequirement: "Medium",
        soilTypes: ["Sandy", "Loamy"],
        duration: 75,
        marketPrice: 25,
        yieldPerAcre: 2500,
        profitMargin: 52,
    },
    {
        id: "moong",
        name: "Moong Dal",
        season: "Zaid",
        waterRequirement: "Low",
        soilTypes: ["Loamy", "Sandy"],
        duration: 60,
        marketPrice: 70,
        yieldPerAcre: 300,
        profitMargin: 45,
    },
];

export const seasonalMapping = {
    Kharif: [6, 7, 8, 9], // June-September
    Rabi: [10, 11, 12, 1, 2, 3], // October-March
    Zaid: [4, 5], // April-May
};

export function getCropsBySeason(season: "Kharif" | "Rabi" | "Zaid"): CropData[] {
    return cropDatabase.filter((crop) => crop.season === season);
}

export function getCropsByWater(waterLevel: "Low" | "Medium" | "High"): CropData[] {
    return cropDatabase.filter((crop) => crop.waterRequirement === waterLevel);
}

export function getCropsBySoil(soilType: string): CropData[] {
    return cropDatabase.filter((crop) =>
        crop.soilTypes.some((type) => type.toLowerCase().includes(soilType.toLowerCase()))
    );
}

export function recommendCrops(
    season: "Kharif" | "Rabi" | "Zaid",
    waterLevel: "Low" | "Medium" | "High",
    soilType: string
): CropData[] {
    return cropDatabase
        .filter((crop) => crop.season === season)
        .filter((crop) => crop.waterRequirement === waterLevel)
        .filter((crop) =>
            crop.soilTypes.some((type) => type.toLowerCase().includes(soilType.toLowerCase()))
        )
        .sort((a, b) => b.profitMargin - a.profitMargin)
        .slice(0, 5);
}
