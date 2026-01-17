import { Disease, SoilReport, MarketPrice } from "@/types";
import { randomChoice, randomInt, delay, getCurrentSeason } from "./utils";
import { recommendCrops, cropDatabase } from "./crop-database";

// ============================================
// EXPANDED PLANT DISEASE DATABASE (15+ diseases)
// ============================================

export const diseaseDatabase: Disease[] = [
    {
        id: "leaf-blight",
        name: "Leaf Blight",
        symptoms: ["Brown spots on leaves", "Yellowing edges", "Wilting", "Lesions with yellow halos"],
        causes: ["Fungal infection (Helminthosporium)", "High humidity", "Poor air circulation", "Overhead irrigation"],
        solutions: [
            "Remove infected leaves immediately and burn them",
            "Spray Copper Oxychloride @ 3g/liter every 7 days",
            "Improve spacing between plants (minimum 2 feet)",
            "Apply Mancozeb @ 2.5g/liter as preventive measure",
            "Ensure proper drainage to reduce humidity",
        ],
        severity: "High",
        affectedCrops: ["Rice", "Wheat", "Maize", "Sorghum"],
        preventiveMeasures: [
            "Use disease-resistant varieties (consult local agricultural office)",
            "Maintain proper plant spacing (2-3 feet)",
            "Avoid overhead irrigation - use drip system",
            "Apply preventive fungicide spray before monsoon",
        ],
    },
    {
        id: "nitrogen-deficiency",
        name: "Nitrogen Deficiency",
        symptoms: ["Yellowing of older leaves (chlorosis)", "Stunted growth", "Pale green color", "Reduced tillering", "Thin stems"],
        causes: ["Nutrient depletion from soil", "Poor soil quality", "Excessive rainfall leaching", "Sandy soil with low retention"],
        solutions: [
            "Apply Urea @ 25-30 kg/acre immediately",
            "Use NPK 20:20:20 fertilizer @ 50 kg/acre",
            "Add organic compost @ 2-3 tons/acre",
            "Foliar spray of liquid nitrogen (19:19:19) @ 5g/liter",
            "Split application: 50% at sowing, 25% at 30 days, 25% at 60 days",
        ],
        severity: "Medium",
        affectedCrops: ["All crops"],
        preventiveMeasures: [
            "Regular soil testing every 6 months",
            "Crop rotation with legumes (pulses) to fix nitrogen",
            "Organic matter addition - FYM @ 5 tons/acre annually",
            "Use slow-release nitrogen fertilizers",
        ],
    },
    {
        id: "powdery-mildew",
        name: "Powdery Mildew",
        symptoms: ["White powdery coating on leaves", "Leaf curling", "Reduced photosynthesis", "Premature leaf drop"],
        causes: ["Fungal spores (Erysiphe cichoracearum)", "Dry weather with high humidity", "Poor ventilation", "Dense planting"],
        solutions: [
            "Spray Sulfur-based fungicide @ 2g/liter",
            "Apply neem oil solution @ 5ml/liter weekly",
            "Remove severely infected parts and destroy",
            "Increase air circulation by pruning",
            "Use Carbendazim @ 1g/liter for severe cases",
        ],
        severity: "Medium",
        affectedCrops: ["Cucumber", "Peas", "Wheat", "Grapes", "Roses"],
        preventiveMeasures: [
            "Plant in well-ventilated areas with good sunlight",
            "Avoid overcrowding - maintain 2-3 feet spacing",
            "Water at base, not leaves (use drip irrigation)",
            "Apply preventive sulfur spray bi-weekly",
        ],
    },
    {
        id: "root-rot",
        name: "Root Rot (Pythium/Phytophthora)",
        symptoms: ["Wilting despite watering", "Brown/black roots", "Foul smell from soil", "Stunted growth", "Plant collapse"],
        causes: ["Overwatering", "Poor drainage", "Fungal pathogens (Pythium)", "Contaminated soil"],
        solutions: [
            "Improve soil drainage immediately - create channels",
            "Reduce watering frequency (water only when top 2 inches dry)",
            "Apply Trichoderma-based bio-fungicide @ 5g/liter",
            "Transplant to fresh, well-draining soil if possible",
            "Drench soil with Metalaxyl @ 2g/liter",
        ],
        severity: "High",
        affectedCrops: ["Tomato", "Cotton", "Groundnut", "Papaya"],
        preventiveMeasures: [
            "Ensure proper drainage - use raised beds",
            "Avoid waterlogging - never let water stagnate",
            "Use sterilized soil for nursery",
            "Apply Trichoderma during land preparation",
        ],
    },
    {
        id: "aphid-infestation",
        name: "Aphid Infestation",
        symptoms: ["Sticky honeydew on leaves", "Curled leaves", "Black sooty mold", "Stunted growth", "Yellowing"],
        causes: ["Pest attack (Aphis gossypii)", "Warm weather (25-30°C)", "Nitrogen-rich soil", "Lack of natural predators"],
        solutions: [
            "Spray neem oil @ 5ml/liter every 5 days",
            "Use insecticidal soap @ 10ml/liter",
            "Introduce ladybugs (natural predators) - 500/acre",
            "Apply Imidacloprid @ 0.5ml/liter if severe",
            "Use yellow sticky traps to monitor population",
        ],
        severity: "Medium",
        affectedCrops: ["Cotton", "Mustard", "Vegetables", "Pulses"],
        preventiveMeasures: [
            "Regular monitoring - check undersides of leaves",
            "Companion planting with marigolds, garlic",
            "Avoid excessive nitrogen fertilizers",
            "Encourage natural predators (ladybugs, lacewings)",
        ],
    },
    {
        id: "bacterial-wilt",
        name: "Bacterial Wilt (Ralstonia)",
        symptoms: ["Sudden wilting", "Vascular browning", "Plant death within days", "Milky ooze from cut stems"],
        causes: ["Bacterial infection (Ralstonia solanacearum)", "Contaminated tools", "Infected soil", "Wounds in roots"],
        solutions: [
            "Remove and destroy infected plants immediately (burn, don't compost)",
            "Disinfect all tools with 10% bleach solution",
            "Apply Streptomycin sulfate @ 200ppm as soil drench",
            "Practice crop rotation with non-host crops (cereals) for 3 years",
            "Solarize soil before next planting",
        ],
        severity: "High",
        affectedCrops: ["Tomato", "Potato", "Eggplant", "Pepper"],
        preventiveMeasures: [
            "Use certified disease-free seeds and seedlings",
            "Sanitize equipment after each use",
            "Rotate with non-host crops (wheat, maize)",
            "Avoid wounding roots during transplanting",
        ],
    },
    {
        id: "iron-deficiency",
        name: "Iron Deficiency (Chlorosis)",
        symptoms: ["Yellow leaves with green veins (interveinal chlorosis)", "Stunted growth", "Poor flowering", "Leaf drop"],
        causes: ["High soil pH (>7.5)", "Poor iron availability", "Waterlogged conditions", "Excess phosphorus"],
        solutions: [
            "Apply Ferrous Sulfate @ 10-15 kg/acre",
            "Foliar spray of chelated iron (Fe-EDTA) @ 2g/liter",
            "Lower soil pH with elemental sulfur @ 50 kg/acre",
            "Improve drainage to prevent waterlogging",
            "Apply iron-rich organic compost",
        ],
        severity: "Low",
        affectedCrops: ["Rice", "Citrus", "Vegetables", "Ornamentals"],
        preventiveMeasures: [
            "Maintain soil pH between 6.0-7.0",
            "Add organic matter regularly",
            "Avoid over-irrigation",
            "Use acidifying fertilizers in alkaline soils",
        ],
    },
    {
        id: "early-blight",
        name: "Early Blight (Alternaria)",
        symptoms: ["Concentric rings on leaves (target spots)", "Brown lesions", "Premature leaf drop", "Fruit spots"],
        causes: ["Fungal pathogen (Alternaria solani)", "Warm humid weather", "Overhead irrigation", "Plant stress"],
        solutions: [
            "Spray Mancozeb @ 2.5g/liter every 7-10 days",
            "Remove lower infected leaves",
            "Apply mulch to prevent soil splash",
            "Rotate with non-solanaceous crops",
            "Use Chlorothalonil @ 2g/liter for severe cases",
        ],
        severity: "Medium",
        affectedCrops: ["Tomato", "Potato"],
        preventiveMeasures: [
            "Use drip irrigation instead of overhead",
            "Maintain plant hygiene - remove debris",
            "Apply preventive fungicides before disease onset",
            "Use resistant varieties",
        ],
    },
    // NEW DISEASES ADDED
    {
        id: "late-blight",
        name: "Late Blight (Phytophthora)",
        symptoms: ["Water-soaked lesions on leaves", "White fungal growth on undersides", "Rapid plant death", "Tuber rot"],
        causes: ["Fungal pathogen (Phytophthora infestans)", "Cool humid weather", "Dense planting", "Poor air circulation"],
        solutions: [
            "Spray Metalaxyl + Mancozeb @ 2.5g/liter immediately",
            "Remove and destroy infected plants",
            "Improve air circulation by spacing",
            "Apply Copper Oxychloride @ 3g/liter preventively",
            "Harvest early if disease is severe",
        ],
        severity: "High",
        affectedCrops: ["Potato", "Tomato"],
        preventiveMeasures: [
            "Use certified disease-free seed potatoes",
            "Maintain proper spacing (3 feet)",
            "Apply preventive fungicides in monsoon",
            "Avoid overhead irrigation",
        ],
    },
    {
        id: "fusarium-wilt",
        name: "Fusarium Wilt",
        symptoms: ["Yellowing of lower leaves", "Wilting on one side", "Vascular browning", "Stunted growth"],
        causes: ["Soil-borne fungus (Fusarium oxysporum)", "Warm soil temperatures", "Acidic soil", "Root wounds"],
        solutions: [
            "No cure - remove infected plants immediately",
            "Solarize soil for 4-6 weeks before replanting",
            "Apply Trichoderma @ 5g/liter as soil drench",
            "Use resistant varieties for next crop",
            "Improve soil pH to 6.5-7.0",
        ],
        severity: "High",
        affectedCrops: ["Tomato", "Cotton", "Banana", "Chickpea"],
        preventiveMeasures: [
            "Use resistant varieties",
            "Maintain soil pH 6.5-7.0",
            "Practice crop rotation (3-4 years)",
            "Avoid root injuries during cultivation",
        ],
    },
    {
        id: "whitefly-infestation",
        name: "Whitefly Infestation",
        symptoms: ["Tiny white insects on undersides", "Yellowing leaves", "Honeydew secretion", "Sooty mold", "Leaf curl virus"],
        causes: ["Pest attack (Bemisia tabaci)", "Hot dry weather", "Lack of natural enemies", "Continuous cropping"],
        solutions: [
            "Spray neem oil @ 5ml/liter every 5 days",
            "Use yellow sticky traps @ 20/acre",
            "Apply Imidacloprid @ 0.5ml/liter",
            "Introduce parasitic wasps (Encarsia formosa)",
            "Remove heavily infested leaves",
        ],
        severity: "High",
        affectedCrops: ["Cotton", "Tomato", "Chili", "Okra"],
        preventiveMeasures: [
            "Use reflective mulches to repel whiteflies",
            "Plant trap crops (marigold) around main crop",
            "Regular monitoring with yellow traps",
            "Avoid continuous cropping of same family",
        ],
    },
    {
        id: "stem-borer",
        name: "Stem Borer Attack",
        symptoms: ["Dead heart in young plants", "White ear heads", "Holes in stems", "Frass (sawdust) near holes"],
        causes: ["Insect larvae (Scirpophaga incertulas)", "Continuous rice cropping", "High nitrogen", "Lack of field sanitation"],
        solutions: [
            "Apply Cartap Hydrochloride @ 2g/liter",
            "Release egg parasitoid Trichogramma @ 50,000/acre",
            "Remove and destroy dead hearts",
            "Apply Chlorpyrifos @ 2ml/liter to stem base",
            "Use pheromone traps for monitoring",
        ],
        severity: "High",
        affectedCrops: ["Rice", "Sugarcane", "Maize"],
        preventiveMeasures: [
            "Avoid excessive nitrogen application",
            "Maintain field sanitation - remove stubbles",
            "Use resistant varieties",
            "Synchronize planting dates in area",
        ],
    },
    {
        id: "fruit-borer",
        name: "Fruit Borer (Helicoverpa)",
        symptoms: ["Holes in fruits", "Larvae inside fruits", "Fruit drop", "Frass on fruits"],
        causes: ["Moth larvae (Helicoverpa armigera)", "Warm weather", "Flowering stage", "Poor pest management"],
        solutions: [
            "Spray Spinosad @ 1ml/liter (organic option)",
            "Apply Emamectin Benzoate @ 0.5g/liter",
            "Install pheromone traps @ 10/acre",
            "Hand-pick and destroy infested fruits",
            "Use NPV (Nuclear Polyhedrosis Virus) @ 250 LE/acre",
        ],
        severity: "High",
        affectedCrops: ["Tomato", "Chili", "Cotton", "Chickpea"],
        preventiveMeasures: [
            "Install pheromone traps before flowering",
            "Spray neem oil @ 5ml/liter weekly",
            "Intercrop with marigold or coriander",
            "Remove and destroy crop residues",
        ],
    },
    {
        id: "downy-mildew",
        name: "Downy Mildew",
        symptoms: ["Yellow patches on upper leaf surface", "Gray/purple growth on undersides", "Leaf distortion", "Stunted growth"],
        causes: ["Fungal pathogen (Peronospora)", "Cool humid conditions", "Morning dew", "Dense canopy"],
        solutions: [
            "Spray Metalaxyl @ 2g/liter every 10 days",
            "Apply Copper Oxychloride @ 3g/liter",
            "Improve air circulation by pruning",
            "Remove infected leaves immediately",
            "Use Fosetyl-Al @ 2.5g/liter for systemic control",
        ],
        severity: "Medium",
        affectedCrops: ["Grapes", "Cucumber", "Lettuce", "Onion"],
        preventiveMeasures: [
            "Ensure good air circulation",
            "Avoid overhead irrigation",
            "Plant in sunny locations",
            "Use resistant varieties",
        ],
    },
    {
        id: "anthracnose",
        name: "Anthracnose",
        symptoms: ["Circular dark spots on fruits", "Sunken lesions", "Pink spore masses", "Fruit rot"],
        causes: ["Fungal pathogen (Colletotrichum)", "Warm humid weather", "Fruit injuries", "Overhead irrigation"],
        solutions: [
            "Spray Carbendazim @ 1g/liter",
            "Apply Copper Oxychloride @ 3g/liter preventively",
            "Remove and destroy infected fruits",
            "Harvest fruits carefully to avoid injuries",
            "Use Thiophanate Methyl @ 1g/liter",
        ],
        severity: "Medium",
        affectedCrops: ["Mango", "Chili", "Tomato", "Beans"],
        preventiveMeasures: [
            "Avoid fruit injuries during handling",
            "Use drip irrigation",
            "Apply preventive fungicides before monsoon",
            "Maintain field sanitation",
        ],
    },
];

// ============================================
// PEST DATABASE
// ============================================

export const pestDatabase = [
    {
        name: "Aphids",
        description: "Small soft-bodied insects that suck plant sap",
        control: "Neem oil spray, Imidacloprid, introduce ladybugs",
    },
    {
        name: "Whiteflies",
        description: "Tiny white flying insects, transmit viral diseases",
        control: "Yellow sticky traps, Imidacloprid, neem oil",
    },
    {
        name: "Thrips",
        description: "Minute insects causing silvering of leaves",
        control: "Spinosad spray, blue sticky traps, Fipronil",
    },
    {
        name: "Mealybugs",
        description: "White cottony insects on stems and leaves",
        control: "Alcohol spray, neem oil, Thiamethoxam",
    },
    {
        name: "Spider Mites",
        description: "Tiny mites causing yellowing and webbing",
        control: "Water spray, Abamectin, sulfur dust",
    },
];

// ============================================
// ENHANCED MOCK AI ANALYSIS FUNCTIONS
// ============================================

export async function analyzePlantImage(imageFile: File): Promise<{
    diagnosis: string;
    disease?: Disease;
    confidence: number;
    recommendations: string[];
}> {
    // Simulate processing delay
    await delay(randomInt(2500, 4000));

    // Get current season and time for context
    const season = getCurrentSeason();
    const month = new Date().getMonth() + 1;
    const hour = new Date().getHours();

    // Random disease selection (simulating "AI" detection)
    const detectedDisease = randomChoice(diseaseDatabase);
    const confidence = randomInt(78, 96);

    // Generate contextual diagnosis based on season and time
    const seasonalContext =
        season === "Kharif"
            ? "🌧️ **Monsoon Season Alert:** High humidity during monsoon significantly increases fungal disease risk. Regular monitoring is crucial."
            : season === "Rabi"
                ? "❄️ **Winter Season Note:** Cool weather conditions detected. Monitor for pest activity and nutrient deficiencies."
                : "☀️ **Summer Season Warning:** Heat stress detected. Ensure adequate irrigation and watch for pest outbreaks.";

    const timeContext =
        hour < 12
            ? "Early morning inspection is ideal for disease detection."
            : hour < 17
                ? "Afternoon heat may stress plants - ensure adequate watering."
                : "Evening inspection complete. Plan treatment for tomorrow morning.";

    // Additional analysis based on file metadata
    const fileSize = imageFile.size;
    const imageQuality = fileSize > 1000000 ? "High resolution image - excellent for detailed analysis" : "Image quality sufficient for diagnosis";

    const diagnosis = `
**🔬 Advanced Image Analysis Complete**

${seasonalContext}
${timeContext}

**📊 Analysis Results:**
• **Detected Condition:** ${detectedDisease.name}
• **Severity Level:** ${detectedDisease.severity} ${detectedDisease.severity === "High" ? "🔴" : detectedDisease.severity === "Medium" ? "🟡" : "🟢"}
• **Confidence Score:** ${confidence}%
• **Image Quality:** ${imageQuality}
• **Affected Crops:** ${detectedDisease.affectedCrops.join(", ")}

**🔍 Observed Symptoms:**
${detectedDisease.symptoms.map((s, i) => `${i + 1}. ${s}`).join("\n")}

**🧪 Probable Causes:**
${detectedDisease.causes.map((c, i) => `${i + 1}. ${c}`).join("\n")}

**💊 Immediate Treatment Plan:**
${detectedDisease.solutions.map((s, i) => `**Step ${i + 1}:** ${s}`).join("\n\n")}

**🛡️ Prevention for Future:**
${detectedDisease.preventiveMeasures.map((p) => `✓ ${p}`).join("\n")}

**📅 Treatment Timeline:**
• **Day 1-2:** Remove infected parts, apply first treatment
• **Day 3-7:** Monitor progress, repeat spray if needed
• **Day 8-14:** Assess recovery, continue preventive measures
• **Day 15+:** Maintain regular monitoring

**💰 Estimated Treatment Cost:**
• Fungicide/Pesticide: ₹${randomInt(200, 800)}/acre
• Labor: ₹${randomInt(150, 400)}/acre
• **Total:** ₹${randomInt(350, 1200)}/acre

**⚠️ Critical Warning:**
${detectedDisease.severity === "High" ? "This is a HIGH severity condition. Immediate action required within 24-48 hours to prevent crop loss!" : detectedDisease.severity === "Medium" ? "Moderate severity - treat within 3-5 days for best results." : "Low severity - monitor and treat as preventive measure."}

💡 **Expert Tip:** Early detection can save up to 80% of potential yield loss. Monitor your crop daily, especially during ${season} season. Consider setting up a weekly inspection schedule.

📞 **Need Help?** Contact your nearest Krishi Vigyan Kendra (KVK) or agricultural extension officer for hands-on guidance.
  `.trim();

    return {
        diagnosis,
        disease: detectedDisease,
        confidence,
        recommendations: detectedDisease.solutions,
    };
}

export async function analyzeSoilReport(file?: File): Promise<{
    report: string;
    soilData: SoilReport;
}> {
    await delay(randomInt(2500, 4000));

    // Check if it's a PDF
    const isPDF = file?.type === "application/pdf";

    // Simulate NPK extraction (random values for demo)
    const soilData: SoilReport = {
        nitrogen: randomInt(150, 380),
        phosphorus: randomInt(15, 85),
        potassium: randomInt(90, 320),
        ph: randomInt(52, 82) / 10, // 5.2 to 8.2
        organicMatter: randomInt(12, 48) / 10, // 1.2% to 4.8%
        recommendations: [],
    };

    // Additional micronutrients (simulated)
    const micronutrients = {
        sulfur: randomInt(10, 40),
        zinc: randomInt(0.5, 2.5),
        boron: randomInt(0.3, 1.5),
        iron: randomInt(3, 15),
    };

    // Generate detailed recommendations
    const recommendations: string[] = [];
    const fertilizers: string[] = [];
    let totalCost = 0;

    // Nitrogen analysis
    if (soilData.nitrogen < 200) {
        recommendations.push("🔴 Nitrogen is CRITICALLY LOW. Immediate application required.");
        fertilizers.push("Urea @ 30-35 kg/acre (₹600-700)");
        totalCost += 650;
    } else if (soilData.nitrogen < 250) {
        recommendations.push("🟡 Nitrogen is LOW. Apply before sowing.");
        fertilizers.push("Urea @ 25-30 kg/acre (₹500-600)");
        totalCost += 550;
    } else if (soilData.nitrogen > 320) {
        recommendations.push("🟢 Nitrogen is HIGH. Avoid additional nitrogen fertilizers to prevent lodging.");
    } else {
        recommendations.push("✅ Nitrogen levels are OPTIMAL. Maintain with balanced fertilization.");
        fertilizers.push("Urea @ 15-20 kg/acre for maintenance (₹300-400)");
        totalCost += 350;
    }

    // Phosphorus analysis
    if (soilData.phosphorus < 25) {
        recommendations.push("🔴 Phosphorus is VERY LOW. Critical for root development.");
        fertilizers.push("DAP (Di-Ammonium Phosphate) @ 60-75 kg/acre (₹1800-2200)");
        totalCost += 2000;
    } else if (soilData.phosphorus < 40) {
        recommendations.push("🟡 Phosphorus is LOW. Apply DAP before sowing.");
        fertilizers.push("DAP @ 50 kg/acre (₹1500)");
        totalCost += 1500;
    } else if (soilData.phosphorus > 65) {
        recommendations.push("🟢 Phosphorus is HIGH. No additional P fertilizer needed this season.");
    } else {
        recommendations.push("✅ Phosphorus levels are GOOD. Minimal supplementation needed.");
        fertilizers.push("SSP (Single Super Phosphate) @ 30 kg/acre (₹400)");
        totalCost += 400;
    }

    // Potassium analysis
    if (soilData.potassium < 120) {
        recommendations.push("🔴 Potassium is LOW. Essential for fruit/grain quality.");
        fertilizers.push("Muriate of Potash (MOP) @ 25-30 kg/acre (₹800-1000)");
        totalCost += 900;
    } else if (soilData.potassium < 180) {
        recommendations.push("🟡 Potassium is MODERATE. Apply during flowering stage.");
        fertilizers.push("MOP @ 20 kg/acre (₹650)");
        totalCost += 650;
    } else {
        recommendations.push("✅ Potassium levels are ADEQUATE. Maintenance dose sufficient.");
        fertilizers.push("MOP @ 10-15 kg/acre (₹350)");
        totalCost += 350;
    }

    // pH analysis
    if (soilData.ph < 5.5) {
        recommendations.push("🔴 Soil is HIGHLY ACIDIC. Lime application urgent.");
        fertilizers.push("Agricultural Lime @ 250-300 kg/acre (₹1200-1500)");
        totalCost += 1350;
    } else if (soilData.ph < 6.0) {
        recommendations.push("🟡 Soil is ACIDIC. Apply lime to raise pH.");
        fertilizers.push("Agricultural Lime @ 200 kg/acre (₹1000)");
        totalCost += 1000;
    } else if (soilData.ph > 8.0) {
        recommendations.push("🔴 Soil is HIGHLY ALKALINE. Sulfur application needed.");
        fertilizers.push("Elemental Sulfur @ 60-80 kg/acre (₹800-1000)");
        totalCost += 900;
    } else if (soilData.ph > 7.5) {
        recommendations.push("🟡 Soil is ALKALINE. Add sulfur to lower pH.");
        fertilizers.push("Elemental Sulfur @ 50 kg/acre (₹650)");
        totalCost += 650;
    } else {
        recommendations.push("✅ Soil pH is OPTIMAL (6.0-7.5) for most crops.");
    }

    // Organic matter analysis
    if (soilData.organicMatter < 2.0) {
        recommendations.push("🔴 Organic matter is CRITICALLY LOW. Soil health at risk.");
        fertilizers.push("FYM (Farm Yard Manure) @ 6-8 tons/acre (₹3000-4000)");
        fertilizers.push("Vermicompost @ 2 tons/acre (₹2000)");
        totalCost += 5000;
    } else if (soilData.organicMatter < 2.5) {
        recommendations.push("🟡 Organic matter is LOW. Add compost for soil health.");
        fertilizers.push("FYM @ 5 tons/acre (₹2500) OR Compost @ 3 tons/acre (₹1800)");
        totalCost += 2500;
    } else if (soilData.organicMatter > 4.0) {
        recommendations.push("🟢 Organic matter content is EXCELLENT. Maintain current practices.");
    } else {
        recommendations.push("✅ Organic matter content is HEALTHY (2.5-4.0%).");
        fertilizers.push("FYM @ 3 tons/acre for maintenance (₹1500)");
        totalCost += 1500;
    }

    // Micronutrient recommendations
    const microRecs: string[] = [];
    if (micronutrients.zinc < 1.0) {
        microRecs.push("Zinc Sulfate @ 10 kg/acre (₹400)");
        totalCost += 400;
    }
    if (micronutrients.boron < 0.5) {
        microRecs.push("Borax @ 5 kg/acre (₹300)");
        totalCost += 300;
    }
    if (micronutrients.sulfur < 15) {
        microRecs.push("Gypsum @ 100 kg/acre (₹600)");
        totalCost += 600;
    }

    soilData.recommendations = recommendations;

    const report = `
**🧪 Comprehensive Soil Analysis Report**
${isPDF ? "📄 *PDF Report Analyzed*" : "📷 *Image Report Analyzed*"}

**📊 Primary Nutrients (NPK):**
• **Nitrogen (N):** ${soilData.nitrogen} ppm ${soilData.nitrogen < 200 ? "🔴 Critical" : soilData.nitrogen < 250 ? "🟡 Low" : soilData.nitrogen > 320 ? "🟢 High" : "✅ Good"}
• **Phosphorus (P):** ${soilData.phosphorus} ppm ${soilData.phosphorus < 25 ? "🔴 Very Low" : soilData.phosphorus < 40 ? "🟡 Low" : soilData.phosphorus > 65 ? "🟢 High" : "✅ Good"}
• **Potassium (K):** ${soilData.potassium} ppm ${soilData.potassium < 120 ? "🔴 Low" : soilData.potassium < 180 ? "🟡 Moderate" : "✅ Adequate"}

**🔬 Secondary Nutrients:**
• **Sulfur (S):** ${micronutrients.sulfur} ppm ${micronutrients.sulfur < 15 ? "🟡 Low" : "✅ Good"}
• **Calcium (Ca):** ${randomInt(800, 2000)} ppm ✅ Adequate
• **Magnesium (Mg):** ${randomInt(150, 400)} ppm ✅ Good

**⚗️ Micronutrients:**
• **Zinc (Zn):** ${micronutrients.zinc.toFixed(1)} ppm ${micronutrients.zinc < 1.0 ? "🟡 Low" : "✅ Good"}
• **Iron (Fe):** ${micronutrients.iron.toFixed(1)} ppm ✅ Adequate
• **Boron (B):** ${micronutrients.boron.toFixed(1)} ppm ${micronutrients.boron < 0.5 ? "🟡 Low" : "✅ Good"}
• **Manganese (Mn):** ${randomInt(5, 20)} ppm ✅ Good

**⚖️ Soil Properties:**
• **pH Level:** ${soilData.ph.toFixed(1)} ${soilData.ph < 5.5 ? "🔴 Highly Acidic" : soilData.ph < 6.0 ? "🟡 Acidic" : soilData.ph > 8.0 ? "🔴 Highly Alkaline" : soilData.ph > 7.5 ? "🟡 Alkaline" : "✅ Neutral"}
• **Organic Matter:** ${soilData.organicMatter.toFixed(1)}% ${soilData.organicMatter < 2.0 ? "🔴 Critical" : soilData.organicMatter < 2.5 ? "🟡 Low" : soilData.organicMatter > 4.0 ? "🟢 Excellent" : "✅ Healthy"}
• **Electrical Conductivity (EC):** ${(randomInt(20, 80) / 100).toFixed(2)} dS/m ${randomInt(20, 80) > 50 ? "⚠️ Slightly Saline" : "✅ Normal"}

**📋 Detailed Recommendations:**
${recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

**🌾 Fertilizer Application Plan:**

**Phase 1: Pre-Sowing (15 days before sowing)**
${fertilizers.slice(0, 3).map((f, i) => `${i + 1}. ${f}`).join("\n")}

**Phase 2: At Sowing**
• Mix all fertilizers thoroughly with soil
• Apply in furrows or broadcast and incorporate

**Phase 3: Top Dressing**
• **30 Days After Sowing:** Urea @ 15 kg/acre (₹300)
• **60 Days After Sowing:** MOP @ 10 kg/acre (₹350) for fruiting crops

${microRecs.length > 0 ? `**Micronutrient Application:**\n${microRecs.map((m, i) => `${i + 1}. ${m}`).join("\n")}` : ""}

**💰 Cost Breakdown:**
• Primary Fertilizers: ₹${Math.round(totalCost * 0.6)}
• Organic Amendments: ₹${Math.round(totalCost * 0.3)}
• Micronutrients: ₹${Math.round(totalCost * 0.1)}
• **Total Estimated Cost:** ₹${totalCost}/acre

**📅 Application Schedule:**
• **Week 1:** Soil preparation + lime/sulfur (if needed)
• **Week 2:** FYM/Compost incorporation
• **Week 3:** NPK fertilizer application
• **Week 4:** Sowing + micronutrient spray

**🎯 Expected Outcomes:**
• Improved soil fertility within 30-45 days
• Better crop establishment and growth
• Increased yield potential by 20-30%
• Enhanced soil health for future crops

**⚠️ Important Notes:**
• Always conduct soil test every 6 months
• Adjust fertilizer doses based on crop requirements
• Maintain soil moisture during fertilizer application
• Avoid over-application - can harm crops and environment

💡 **Pro Tip:** Split nitrogen application into 3 doses (40% basal + 30% at 30 days + 30% at 60 days) for better efficiency and reduced leaching losses!

📞 **Need Assistance?** Contact your local soil testing laboratory or agricultural extension officer for customized recommendations.
  `.trim();

    return { report, soilData };
}

export async function getCropRecommendation(
    month: string,
    waterAvailability: string,
    soilType: string
): Promise<string> {
    await delay(2000);

    // Determine season from month
    const monthNum = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december",
    ].indexOf(month.toLowerCase()) + 1;

    let season: "Kharif" | "Rabi" | "Zaid";
    if (monthNum >= 6 && monthNum <= 9) season = "Kharif";
    else if (monthNum >= 10 || monthNum <= 3) season = "Rabi";
    else season = "Zaid";

    // Map water availability
    const waterLevel =
        waterAvailability.toLowerCase().includes("high") ? "High"
            : waterAvailability.toLowerCase().includes("low") ? "Low"
                : "Medium";

    // Get recommendations
    const crops = recommendCrops(season, waterLevel, soilType);

    if (crops.length === 0) {
        return `Based on ${month}, ${waterAvailability} water, and ${soilType} soil, I couldn't find perfect matches. Consider consulting with a local agricultural officer for specific recommendations.`;
    }

    // Calculate potential revenue
    const revenueCalc = crops.map(c => ({
        ...c,
        revenue: c.yieldPerAcre * c.marketPrice,
        profit: (c.yieldPerAcre * c.marketPrice * c.profitMargin) / 100,
    }));

    const response = `
**🌾 Comprehensive Crop Recommendation Report**

**📍 Your Farm Profile:**
• **Sowing Month:** ${month} (${season} Season)
• **Water Availability:** ${waterAvailability}
• **Soil Type:** ${soilType}
• **Climate Zone:** ${season === "Kharif" ? "Monsoon (June-Sept)" : season === "Rabi" ? "Winter (Oct-Mar)" : "Summer (Apr-May)"}

**🏆 Top ${crops.length} Recommended Crops:**

${crops.map((crop, i) => {
        const rev = revenueCalc[i];
        return `
**${i + 1}. ${crop.name}** ${i === 0 ? "⭐ BEST CHOICE" : i === 1 ? "🥈 RUNNER-UP" : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Market Economics:**
• Current Price: ₹${crop.marketPrice}/kg
• Expected Yield: ${crop.yieldPerAcre} kg/acre
• Gross Revenue: ₹${rev.revenue.toLocaleString()}/acre
• Estimated Profit: ₹${Math.round(rev.profit).toLocaleString()}/acre
• Profit Margin: ~${crop.profitMargin}%

**Crop Requirements:**
• Duration: ${crop.duration} days (${Math.round(crop.duration / 30)} months)
• Water Need: ${crop.waterRequirement}
• Suitable Soil: ${crop.soilTypes.join(", ")}

**Investment Breakdown:**
• Seeds: ₹${randomInt(800, 2000)}/acre
• Fertilizers: ₹${randomInt(2000, 4000)}/acre
• Pesticides: ₹${randomInt(500, 1500)}/acre
• Labor: ₹${randomInt(3000, 6000)}/acre
• **Total Cost:** ₹${randomInt(6300, 13500)}/acre

**ROI:** ${Math.round((rev.profit / randomInt(6300, 13500)) * 100)}% return on investment
`;
    }).join("\n")}

**🎯 Why These Crops?**
✓ **Seasonal Match:** Perfect for ${season} season (${month} sowing window)
✓ **Soil Compatibility:** Thrives in your ${soilType} soil type
✓ **Water Efficiency:** Matches your ${waterAvailability} water availability
✓ **Market Demand:** High demand with stable prices
✓ **Profit Potential:** Above-average profit margins (${crops[0].profitMargin}%+)

**📊 Market Trend Analysis:**
• **${crops[0].name}:** ${randomChoice(["Prices rising due to high demand", "Stable prices with good demand", "Export opportunities available"])}
• **Best Selling Period:** ${season === "Kharif" ? "October-November" : season === "Rabi" ? "April-May" : "June-July"}
• **Storage Potential:** ${randomChoice(["Can be stored for 3-6 months", "Sell immediately for best prices", "Cold storage recommended"])}

**🌱 Cultivation Timeline:**

**Month 1 (${month}):**
• Land preparation and soil testing
• Apply FYM and basal fertilizers
• Sowing/Transplanting

**Month 2:**
• First irrigation (if needed)
• Weed management
• First top-dressing of fertilizers

**Month 3:**
• Pest and disease monitoring
• Second top-dressing
• Flowering stage management

**Month ${Math.ceil(crops[0].duration / 30)}:**
• Harvesting
• Post-harvest handling
• Marketing

**⚠️ Risk Factors & Mitigation:**
• **Weather Risk:** ${season === "Kharif" ? "Excess rainfall - ensure drainage" : season === "Rabi" ? "Frost damage - use protective measures" : "Heat stress - increase irrigation"}
• **Pest Risk:** ${randomChoice(["Moderate - regular monitoring needed", "Low - minimal pest pressure", "High - preventive sprays recommended"])}
• **Market Risk:** Diversify by planting 2-3 crops to spread risk

**💡 Expert Recommendations:**
1. **Seed Selection:** Use certified seeds from authorized dealers (₹${randomInt(800, 2000)}/acre)
2. **Soil Preparation:** Deep plowing + FYM @ 5 tons/acre
3. **Irrigation:** ${waterLevel === "High" ? "Drip system for water efficiency" : waterLevel === "Low" ? "Mulching to conserve moisture" : "Sprinkler or furrow irrigation"}
4. **Fertilizer:** Soil test-based application (NPK ratio varies by crop)
5. **Pest Management:** IPM approach - monitor weekly, spray only when needed

**📈 Yield Enhancement Tips:**
• Use high-yielding varieties (HYV)
• Maintain optimal plant spacing
• Timely weed and pest management
• Balanced fertilization (avoid excess nitrogen)
• Proper irrigation scheduling

**🌐 Government Schemes Available:**
• PM-KISAN: ₹6,000/year direct benefit
• Crop Insurance (PMFBY): Protect against losses
• Subsidy on Seeds: Up to 50% on certified seeds
• Drip Irrigation Subsidy: Up to 60%

**💰 Profitability Comparison:**
${crops.slice(0, 3).map((c, i) => `${i + 1}. ${c.name}: ₹${Math.round((c.yieldPerAcre * c.marketPrice * c.profitMargin) / 100).toLocaleString()}/acre profit`).join("\n")}

**📞 Next Steps:**
1. ✅ Visit nearest Krishi Vigyan Kendra (KVK) for local variety recommendations
2. ✅ Get soil tested at district soil testing lab
3. ✅ Purchase certified seeds from authorized dealers
4. ✅ Arrange for required inputs (fertilizers, pesticides)
5. ✅ Plan irrigation schedule based on crop needs
6. ✅ Enroll in crop insurance scheme (PMFBY)

💡 **Market Insight:** ${crops[0].name} prices typically peak in ${season === "Kharif" ? "October-November (post-harvest shortage)" : season === "Rabi" ? "April-May (summer demand)" : "June-July (monsoon demand)"}. Consider storing 30-40% of produce if you have storage facilities to get better prices!

🎓 **Training Available:** Contact your local KVK for free training on ${crops[0].name} cultivation techniques.
  `.trim();

    return response;
}

export function getMarketPrices(): MarketPrice[] {
    return cropDatabase.map((crop) => ({
        crop: crop.name,
        price: crop.marketPrice + randomInt(-3, 5),
        unit: "kg",
        trend: randomChoice(["up", "down", "stable"] as const),
        change: randomInt(-10, 15),
        lastUpdated: new Date(),
    }));
}

export function getWeatherAdvice(): string {
    const season = getCurrentSeason();
    const temp = randomInt(20, 38);
    const rainfall = randomInt(0, 80);
    const humidity = randomInt(40, 85);

    const advice = [
        `**🌤️ ${season} Season Weather Advisory**`,
        "",
        "**📊 7-Day Forecast:**",
        `• Temperature: ${temp}°C - ${temp + 5}°C ${temp > 35 ? "🔥 Heat Wave Alert" : temp < 15 ? "❄️ Cold Wave" : ""}`,
        `• Rainfall: ${rainfall}mm expected ${rainfall > 50 ? "🌧️ Heavy Rain Alert" : rainfall > 20 ? "🌦️ Moderate Rain" : "☀️ Dry Weather"}`,
        `• Humidity: ${humidity}% ${humidity > 70 ? "💧 High Humidity" : ""}`,
        `• Wind Speed: ${randomInt(5, 25)} km/h`,
        "",
        "**🌾 Recommended Farming Activities:**",
    ];

    if (season === "Kharif") {
        advice.push(
            "• ✅ Monitor for fungal diseases due to high humidity",
            "• ✅ Ensure proper drainage in fields - create channels",
            "• ✅ Apply fungicides preventively (Mancozeb, Copper Oxychloride)",
            "• ⚠️ Postpone fertilizer application if heavy rain expected",
            "• ✅ Check for pest outbreaks after rain stops"
        );
    } else if (season === "Rabi") {
        advice.push(
            "• ✅ Irrigation critical - no natural rainfall expected",
            "• ✅ Watch for aphid and whitefly attacks in warm weather",
            "• ✅ Apply fertilizers as per schedule (split doses)",
            "• ⚠️ Protect crops from frost if temperature drops below 10°C",
            "• ✅ Harvest mature crops before unexpected rain"
        );
    } else {
        advice.push(
            "• ✅ Increase irrigation frequency due to heat (every 3-4 days)",
            "• ✅ Mulch to conserve soil moisture and reduce evaporation",
            "• ✅ Harvest early morning (6-9 AM) to avoid heat stress",
            "• ⚠️ Watch for heat stress symptoms - wilting, leaf burn",
            "• ✅ Provide shade nets for sensitive crops"
        );
    }

    advice.push(
        "",
        "**💡 Pro Tips:**",
        `• Best time for spraying: ${randomChoice(["Early morning (6-8 AM)", "Late evening (5-7 PM)"])}`,
        `• Avoid irrigation during peak heat (12-3 PM)`,
        `• Monitor soil moisture - water only when top 2 inches are dry`,
    );

    return advice.join("\n");
}

export function getQuickResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();

    if (msg.includes("price") || msg.includes("market")) {
        const randomCrop = randomChoice(cropDatabase);
        const trend = randomChoice(["rising ↗️", "stable →", "slightly down ↘️"]);
        return `**💰 Market Update**\n\nCurrent price for **${randomCrop.name}**: ₹${randomCrop.marketPrice}/kg\n\n• Trend: ${trend}\n• Weekly Change: ${randomChoice(["+5%", "+3%", "-2%", "0%"])}\n• Demand: ${randomChoice(["High", "Moderate", "Good"])}\n\nWould you like detailed market analysis for specific crops?`;
    }

    if (msg.includes("weather")) {
        return getWeatherAdvice();
    }

    if (msg.includes("fertilizer") || msg.includes("npk")) {
        return "**🌱 Fertilizer Recommendation**\n\nFor most crops, I recommend:\n\n**Basal Application (at sowing):**\n• NPK 20:20:20 @ 50kg/acre\n• FYM @ 5 tons/acre\n\n**Top Dressing:**\n• Urea @ 25kg/acre (30 days after sowing)\n• MOP @ 15kg/acre (60 days after sowing)\n\n💡 For precise recommendations, upload your soil test report or let me analyze it!";
    }

    if (msg.includes("water") || msg.includes("irrigation")) {
        return "**💧 Irrigation Guide**\n\nFrequency depends on crop and season:\n\n• **Kharif crops:** Minimal irrigation (monsoon provides water)\n• **Rabi crops:** 4-5 irrigations (critical stages)\n• **Zaid crops:** 6-8 irrigations (high water need)\n\n**Critical Stages:**\n1. Germination\n2. Flowering\n3. Grain filling\n\nWhich crop are you growing? I can provide a detailed irrigation schedule!";
    }

    if (msg.includes("pest") || msg.includes("insect")) {
        const pest = randomChoice(pestDatabase);
        return `**🐛 Pest Alert**\n\nCommon pests this season:\n\n**${pest.name}**\n${pest.description}\n\n**Control Measures:**\n${pest.control}\n\n**Immediate Action:**\n1. Spray neem oil @ 5ml/liter\n2. Install sticky traps (yellow for whiteflies, blue for thrips)\n3. If severe, use recommended insecticide\n\nCan you upload a photo for specific pest identification?`;
    }

    if (msg.includes("subsidy") || msg.includes("scheme")) {
        return "**🏛️ Government Schemes**\n\n**Available Benefits:**\n\n1. **PM-KISAN:** ₹6,000/year (₹2,000 every 4 months)\n2. **Crop Insurance (PMFBY):** Premium as low as 2%\n3. **Seed Subsidy:** Up to 50% on certified seeds\n4. **Drip Irrigation:** 60% subsidy\n5. **Farm Mechanization:** 40-50% subsidy on equipment\n\n💡 Visit your nearest CSC or Krishi Bhavan to apply!";
    }

    // Default response
    return `**🌾 Welcome to KrishiMitra!**\n\nI can help you with:\n\n• 🌱 **Plant disease diagnosis** - Upload photo for instant analysis\n• 🧪 **Soil analysis** - Upload soil report (PDF/Image) for fertilizer recommendations\n• 🌾 **Crop recommendations** - Based on season, soil, and water\n• 💰 **Market prices** - Real-time crop price updates\n• 🌤️ **Weather advice** - Season-specific farming tips\n• 🐛 **Pest identification** - Upload photo for treatment plan\n• 💧 **Irrigation scheduling** - Crop-specific water management\n• 🏛️ **Government schemes** - Subsidy and benefit information\n\n**What would you like to know?**`;
}
