import { Disease } from "@/types";
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

export async function getCropRecommendation(
    month: string,
    waterAvailability: string,
    soilType: string
): Promise<string> {

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
**Rough Economics (average numbers, not live):**
• Reference Price: about ₹${crop.marketPrice}/kg
• Typical Yield: ${crop.yieldPerAcre} kg/acre
• Gross Revenue: about ₹${rev.revenue.toLocaleString()}/acre
• Rough Profit: about ₹${Math.round(rev.profit).toLocaleString()}/acre (~${crop.profitMargin}% margin)

**Crop Requirements:**
• Duration: ${crop.duration} days (${Math.round(crop.duration / 30)} months)
• Water Need: ${crop.waterRequirement}
• Suitable Soil: ${crop.soilTypes.join(", ")}

`;
    }).join("\n")}

**🎯 Why These Crops?**
✓ **Seasonal Match:** Perfect for ${season} season (${month} sowing window)
✓ **Soil Compatibility:** Thrives in your ${soilType} soil type
✓ **Water Efficiency:** Matches your ${waterAvailability} water availability

💡 Prices and profit above are rough averages. Check today's mandi price (ask me "price of ${crops[0].name}") before you decide.

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
• **Pest Risk:** Check the crop every week. If you see something, tell me the signs and I'll help
• **Market Risk:** Diversify by planting 2-3 crops to spread risk

**💡 Expert Recommendations:**
1. **Seed Selection:** Use certified seeds from authorized dealers
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

export function getQuickResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();

    if (msg.includes("fertilizer") || msg.includes("npk")) {
        return "**🌱 Fertilizer Recommendation**\n\nFor most crops, I recommend:\n\n**Basal Application (at sowing):**\n• NPK 20:20:20 @ 50kg/acre\n• FYM @ 5 tons/acre\n\n**Top Dressing:**\n• Urea @ 25kg/acre (30 days after sowing)\n• MOP @ 15kg/acre (60 days after sowing)\n\n💡 For precise recommendations, upload your soil test report or let me analyze it!";
    }

    if (msg.includes("water") || msg.includes("irrigation")) {
        return "**💧 Irrigation Guide**\n\nFrequency depends on crop and season:\n\n• **Kharif crops:** Minimal irrigation (monsoon provides water)\n• **Rabi crops:** 4-5 irrigations (critical stages)\n• **Zaid crops:** 6-8 irrigations (high water need)\n\n**Critical Stages:**\n1. Germination\n2. Flowering\n3. Grain filling\n\nWhich crop are you growing? I can provide a detailed irrigation schedule!";
    }

    if (msg.includes("pest") || msg.includes("insect")) {
        const list = pestDatabase.map((p) => `**${p.name}:** ${p.description}\n   control: ${p.control}`).join("\n");
        return `**🐛 Common pests**\n\n${list}\n\n**First try:** neem oil 5 ml per litre, yellow sticky traps for whiteflies, blue for thrips.\n\nNot sure what it is? Type **diagnose** and tell me what you see on the plant.`;
    }

    if (msg.includes("subsidy") || msg.includes("scheme")) {
        return "**🏛️ Government Schemes**\n\n**Available Benefits:**\n\n1. **PM-KISAN:** ₹6,000/year (₹2,000 every 4 months)\n2. **Crop Insurance (PMFBY):** Premium as low as 2%\n3. **Seed Subsidy:** Up to 50% on certified seeds\n4. **Drip Irrigation:** 60% subsidy\n5. **Farm Mechanization:** 40-50% subsidy on equipment\n\n💡 Visit your nearest CSC or Krishi Bhavan to apply!";
    }

    // Default response
    return `**🌾 Welcome to KrishiMitra!**\n\nI can help you with:\n\n• 🌱 **Plant problems** - tell me what you see, I match it with common diseases and pests\n• 🧪 **Soil report** - upload your Soil Health Card PDF or type the values\n• 🌾 **Crop advice** - based on month, water and soil\n• 💰 **Mandi prices** - ask "price of tomato in kerala"\n• 🌤️ **Weather** - ask "weather in thrissur" for a 5 day forecast + farm tips\n• 💧 **Irrigation** and 🏛️ **government schemes**\n\n**What would you like to know?**`;
}
