'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaImage, FaSpinner, FaUpload, FaSeedling, FaBug, FaWater, FaThermometerHalf, FaCloudRain, FaWind, FaCalendarAlt, FaRupeeSign, FaLeaf } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface NutrientLevels {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface AnalysisDetails {
  cropHealth: string;
  soilHealth: string;
  pestRisk: string;
  waterNeeds: string;
  nutrientLevels: NutrientLevels;
  remedies: string[];
  pestControl: {
    organic: string[];
    chemical: string[];
  };
}

interface Analysis {
  details: AnalysisDetails;
  recommendations: string[];
}

interface WeatherInfo {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Kerala crops data for more realistic recommendations
const keralaCrops = [
  { crop: 'Rice (Njavara)', demand: 'Very High', reason: 'Traditional Kerala variety with medicinal properties', season: 'Monsoon', profit: 'Good' },
  { crop: 'Coconut', demand: 'High', reason: 'Kerala\'s signature crop, multiple uses', season: 'Year-round', profit: 'Steady' },
  { crop: 'Banana (Nendran)', demand: 'High', reason: 'Popular Kerala variety for chips and curry', season: 'Year-round', profit: 'High' },
  { crop: 'Black Pepper', demand: 'High', reason: 'Kerala is the spice capital', season: 'Post-monsoon', profit: 'Very High' },
  { crop: 'Cardamom', demand: 'Medium', reason: 'Thrives in Kerala\'s highland climate', season: 'June-July', profit: 'Very High' },
  { crop: 'Rubber', demand: 'Medium', reason: 'Well-suited to Kerala\'s climate', season: 'Year-round', profit: 'Steady' },
  { crop: 'Tapioca', demand: 'Medium', reason: 'Traditional Kerala staple food', season: 'Pre-monsoon', profit: 'Moderate' },
  { crop: 'Arecanut', demand: 'Medium', reason: 'Traditional crop in Kerala', season: 'Year-round', profit: 'Good' }
];

// Kerala common pests data
const keralaPests = [
  { pest: 'Rhinoceros Beetle', crop: 'Coconut', solution: 'Place naphthalene balls in leaf axils, use hook to remove beetles' },
  { pest: 'Rice Stem Borer', crop: 'Rice', solution: 'Use neem-based pesticides, release parasitoids like Trichogramma' },
  { pest: 'Tea Mosquito Bug', crop: 'Cashew', solution: 'Apply neem oil spray, maintain field sanitation' },
  { pest: 'Fruit Fly', crop: 'Mango, Guava', solution: 'Install pheromone traps, wrap fruits with paper bags' },
  { pest: 'Bunchy Top Virus Vector', crop: 'Banana', solution: 'Use disease-free planting material, remove affected plants' },
  { pest: 'Red Palm Weevil', crop: 'Coconut', solution: 'Treat crown with carbaryl, fill leaf axil with sand' }
];

// Current month's recommended crops for Kerala
const getCurrentMonthCrops = () => {
  const month = new Date().getMonth();
  // Kerala seasonal crop recommendations
  if (month >= 5 && month <= 8) { // June to September (Southwest monsoon)
    return ['Rice', 'Ginger', 'Turmeric', 'Tapioca'];
  } else if (month >= 9 && month <= 11) { // October to December (Northeast monsoon)
    return ['Vegetables', 'Pulses', 'Black Pepper', 'Coffee'];
  } else if (month >= 0 && month <= 1) { // January to February (Winter)
    return ['Coconut', 'Banana', 'Vegetables', 'Cardamom'];
  } else { // March to May (Summer)
    return ['Mango', 'Jackfruit', 'Pineapple', 'Cashew'];
  }
};

export default function FarmBotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [weather, setWeather] = useState<WeatherInfo>({
    temperature: 28,
    humidity: 75,
    rainfall: 12.5,
    windSpeed: 8,
    condition: 'Partly Cloudy'
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your FarmAI assistant. How can I help you today? You can ask me about crops, pests, or upload a plant photo for analysis.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('');

  // Protect the route
  if (!user || user.role !== 'FARMER') {
    router.push('/');
    return null;
  }

  useEffect(() => {
    // Determine current season in Kerala
    const month = new Date().getMonth();
    if (month >= 5 && month <= 8) {
      setCurrentSeason('Southwest Monsoon (Edavappathy)');
    } else if (month >= 9 && month <= 11) {
      setCurrentSeason('Northeast Monsoon (Thulavarsham)');
    } else if (month >= 0 && month <= 1) {
      setCurrentSeason('Winter (Mandakalam)');
    } else {
      setCurrentSeason('Summer (Venam)');
    }
  }, []);

  useEffect(() => {
    // Mock weather update every 5 minutes
    const updateWeather = () => {
      // Simulate Kerala's typical weather patterns
      setWeather({
        temperature: 27 + Math.random() * 3, // 27-30°C
        humidity: 70 + Math.random() * 15, // 70-85%
        rainfall: Math.random() * 20, // 0-20mm
        windSpeed: 5 + Math.random() * 10, // 5-15 km/h
        condition: 'Partly Cloudy'
      });
    };

    updateWeather();
    const interval = setInterval(updateWeather, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return 'text-green-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const mockAnalyzeImage = async (imageUrl: string): Promise<Analysis> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomize the analysis results to make it seem dynamic
        const healthStatus = Math.random() > 0.6 ? 'Good' : (Math.random() > 0.3 ? 'Fair' : 'Poor');
        const soilStatus = Math.random() > 0.5 ? 'Good' : 'Moderate';
        const pestRisk = Math.random() > 0.7 ? 'Low' : (Math.random() > 0.3 ? 'Medium' : 'High');
        const waterNeed = Math.random() > 0.5 ? 'Adequate' : 'High';
        const currentMonth = new Date().getMonth();
        
        // Select random remedies based on health status
        const remedyOptions = [
          'Apply organic NPK fertilizer for better nutrient balance',
          'Add coconut husk or coir pith to improve soil aeration',
          'Apply local Kerala neem cake as a natural pesticide',
          'Increase watering frequency during dry periods',
          'Implement mulching with banana leaves to retain soil moisture',
          'Use vermicompost from local sources',
          'Apply slaked lime to adjust soil pH',
          'Introduce parasitoid wasps for natural pest control',
          'Install pheromone traps around the field',
          'Apply fish amino acid as a growth promoter'
        ];
        
        // Randomly select 2-4 remedies
        const remedyCount = 2 + Math.floor(Math.random() * 3);
        const shuffledRemedies = [...remedyOptions].sort(() => 0.5 - Math.random());
        const selectedRemedies = shuffledRemedies.slice(0, remedyCount);
        
        resolve({
          details: {
            cropHealth: healthStatus,
            soilHealth: soilStatus,
            pestRisk: pestRisk,
            waterNeeds: waterNeed,
            nutrientLevels: {
              nitrogen: 30 + Math.floor(Math.random() * 50),
              phosphorus: 30 + Math.floor(Math.random() * 50),
              potassium: 30 + Math.floor(Math.random() * 50)
            },
            remedies: selectedRemedies,
            pestControl: {
              organic: [
                'Neem oil spray (Kerala traditional solution)',
                'Garlic and chili pepper spray',
                'Pseudomonas fluorescens application'
              ],
              chemical: [
                'Selective insecticide (only if organic methods fail)',
                'Minimal copper fungicide spray'
              ]
            }
          },
          recommendations: [
            'Consider adjusting irrigation schedule for upcoming ' + currentSeason,
            'Monitor nutrient levels weekly during growth period',
            'Implement pest prevention measures before ' + (currentMonth >= 8 ? 'Northeast monsoon arrives' : 'Southwest monsoon arrives'),
            'Add organic matter to improve soil structure - local coconut coir is excellent'
          ]
        });
      }, 2000 + Math.random() * 1000); // Random delay to seem more realistic
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setUploadedImage(URL.createObjectURL(file));
    
    // Add a message to the chat about the upload
    const botMessage: Message = {
      id: Date.now().toString(),
      text: "I'm analyzing your plant image. This will take a moment...",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);

    try {
      const result = await mockAnalyzeImage(URL.createObjectURL(file));
      setAnalysis(result);
      
      // Add analysis summary to the chat
      const analysisSummary = `Analysis complete! \n\nYour plant appears to be in ${result.details.cropHealth.toLowerCase()} health with ${result.details.pestRisk.toLowerCase()} pest risk. \n\nKey recommendation: ${result.recommendations[0]}`;
      
      const summaryMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: analysisSummary,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, summaryMessage]);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuery = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Show typing indicator
    setIsTyping(true);
    
    const query = input.toLowerCase();
    let botResponse = '';
    
    // Add a realistic delay to simulate "thinking"
    const thinkingTime = 1000 + (input.length * 20) + (Math.random() * 1000);
    
    setTimeout(() => {
      // Process the query and generate a response
      if ((query.includes('what') || query.includes('which') || query.includes('recommend')) && 
          (query.includes('plant') || query.includes('crop') || query.includes('grow'))) {
        
        // Get a random number of crop recommendations (3-5)
        const count = 3 + Math.floor(Math.random() * 3);
        
        // Randomly select crops or use seasonal ones based on the query
        let recommendations = [];
        if (query.includes('season') || query.includes('now') || query.includes('current')) {
          const seasonalCrops = getCurrentMonthCrops();
          recommendations = keralaCrops.filter(c => seasonalCrops.includes(c.crop)).slice(0, count);
        } else {
          // Shuffle the crops array and take a subset
          recommendations = [...keralaCrops].sort(() => 0.5 - Math.random()).slice(0, count);
        }

        botResponse = `Based on Kerala's current ${currentSeason} season and your location, here are recommended crops:\n\n` +
          recommendations.map(r => `• ${r.crop}: ${r.demand} demand - ${r.reason} (Best season: ${r.season}, Profit potential: ${r.profit})`).join('\n');

        if (query.includes('profit') || query.includes('market') || query.includes('sell')) {
          botResponse += '\n\nFor maximum profit, I recommend focusing on ' + 
            recommendations.filter(r => r.profit === 'High' || r.profit === 'Very High')
              .map(r => r.crop).join(' or ') + 
            ' as these have the best market rates in Kerala currently.';
        }

        setAnalysis({
          details: {
            cropHealth: 'N/A',
            soilHealth: 'Good',
            pestRisk: 'Low',
            waterNeeds: 'Moderate',
            nutrientLevels: {
              nitrogen: 0,
              phosphorus: 0,
              potassium: 0
            },
            remedies: [],
            pestControl: {
              organic: [],
              chemical: []
            }
          },
          recommendations: recommendations.map(r => `${r.crop}: ${r.demand} demand - ${r.reason} (Season: ${r.season})`)
        });
      } else if (query.includes('pest') || query.includes('disease') || query.includes('insect')) {
        // Select specific pests based on queries or randomize
        let pestInfo = [];
        
        if (query.includes('coconut')) {
          pestInfo = keralaPests.filter(p => p.crop.includes('Coconut'));
        } else if (query.includes('rice')) {
          pestInfo = keralaPests.filter(p => p.crop.includes('Rice'));
        } else if (query.includes('banana')) {
          pestInfo = keralaPests.filter(p => p.crop.includes('Banana'));
        } else {
          // Random selection of 3 pests
          pestInfo = [...keralaPests].sort(() => 0.5 - Math.random()).slice(0, 3);
        }
        
        botResponse = `Common pests affecting crops in Kerala during ${currentSeason}:\n\n` + 
          pestInfo.map(p => `• ${p.pest} (affects ${p.crop}):\n  Solution: ${p.solution}`).join('\n\n');
        
        // Add general advice
        botResponse += '\n\nGeneral Prevention Tips:\n• Maintain field sanitation\n• Use trap crops\n• Regular monitoring\n• Use natural predators';

        setAnalysis({
          details: {
            cropHealth: 'N/A',
            soilHealth: 'Good',
            pestRisk: 'Medium',
            waterNeeds: 'Moderate',
            nutrientLevels: {
              nitrogen: 0,
              phosphorus: 0,
              potassium: 0
            },
            remedies: [
              'Use neem oil spray for aphids and mites',
              'Apply garlic and chili spray for soft-bodied insects',
              'Consider diatomaceous earth for crawling insects'
            ],
            pestControl: {
              organic: pestInfo.map(p => p.solution).filter(s => !s.includes('carbaryl')),
              chemical: pestInfo.map(p => p.solution).filter(s => s.includes('carbaryl'))
            }
          },
          recommendations: [
            'Start with organic solutions first',
            'Monitor pest populations regularly',
            'Consider companion planting for natural pest control',
            'Use chemical solutions only as a last resort'
          ]
        });
      } else if (query.includes('weather') || query.includes('climate') || query.includes('rain')) {
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options as any);
        
        botResponse = `Kerala Weather Report for ${formattedDate}:\n\n` +
          `• Temperature: ${weather.temperature.toFixed(1)}°C\n` +
          `• Humidity: ${weather.humidity.toFixed(0)}%\n` +
          `• Rainfall: ${weather.rainfall.toFixed(1)}mm\n` +
          `• Wind Speed: ${weather.windSpeed.toFixed(1)} km/h\n` +
          `• Current Season: ${currentSeason}\n\n` +
          `Farming Impact: ${getFarmingWeatherImpact(weather)}`;
      } else if (query.includes('price') || query.includes('market') || query.includes('rate')) {
        // Generate mock market prices for common Kerala crops
        const marketPrices = [
          { crop: 'Rice (Matta)', price: Math.round(4000 + Math.random() * 1000) / 100, unit: 'kg', trend: Math.random() > 0.5 ? 'up' : 'down' },
          { crop: 'Coconut', price: Math.round(2000 + Math.random() * 1500) / 100, unit: 'piece', trend: Math.random() > 0.5 ? 'up' : 'down' },
          { crop: 'Banana (Nendran)', price: Math.round(5000 + Math.random() * 2000) / 100, unit: 'kg', trend: Math.random() > 0.5 ? 'up' : 'down' },
          { crop: 'Black Pepper', price: Math.round(30000 + Math.random() * 10000) / 100, unit: 'kg', trend: Math.random() > 0.5 ? 'up' : 'down' },
          { crop: 'Cardamom', price: Math.round(80000 + Math.random() * 20000) / 100, unit: 'kg', trend: Math.random() > 0.5 ? 'up' : 'down' }
        ];
        
        botResponse = `Current Market Prices in Kerala:\n\n` +
          marketPrices.map(m => 
            `• ${m.crop}: ₹${m.price.toFixed(2)}/${m.unit} (Trending ${m.trend === 'up' ? '↑' : '↓'})`
          ).join('\n');
        
        // Add market insights
        const highestPrice = marketPrices.sort((a, b) => b.price - a.price)[0];
        const risingPrices = marketPrices.filter(m => m.trend === 'up');
        
        botResponse += `\n\nMarket Insights: ${highestPrice.crop} has the highest value currently. ` +
          (risingPrices.length > 0 
            ? `Prices are rising for ${risingPrices.map(m => m.crop).join(', ')}.`
            : `Most prices are currently stable or declining slightly.`);
      } else if (query.includes('fertilizer') || query.includes('nutrient') || query.includes('soil')) {
        botResponse = `Fertilizer Recommendations for Kerala Soils:\n\n` +
          `• Organic Options:\n` +
          `  - Vermicompost: Excellent for Kerala's acidic soils\n` +
          `  - Fish Amino Acid: Traditional Kerala fertilizer\n` +
          `  - Coconut coir compost: Locally available\n\n` +
          `• Chemical NPK Ratios:\n` +
          `  - Rice: 5:10:10\n` +
          `  - Coconut: 2:4:4\n` +
          `  - Banana: 15:9:20\n` +
          `  - Vegetables: 10:10:10\n\n` +
          `Kerala soils are generally acidic (pH 4.5-5.5). I recommend getting a soil test at your local Krishi Bhavan before applying fertilizers.`;
      } else {
        const suggestions = [
          "what crops should I plant now?",
          "how to control pests in coconut?",
          "current rice prices in Kerala",
          "best fertilizer for banana plants",
          "weather forecast impact on farming"
        ];
        
        // Randomly select 3 suggestions
        const randomSuggestions = [...suggestions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        botResponse = `I'm not sure about that. Here are some things you can ask me about:\n\n` +
          `• Kerala crop recommendations\n` +
          `• Pest control methods\n` +
          `• Current weather conditions\n` +
          `• Market prices and trends\n` +
          `• Fertilizer advice\n\n` +
          `Try asking: "${randomSuggestions.join('" or "')}"`;
      }

      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, thinkingTime);
    
    setInput('');
  };
  
  const getFarmingWeatherImpact = (weather: WeatherInfo) => {
    // Generate dynamic farming advice based on weather conditions
    if (weather.rainfall > 15) {
      return "Heavy rainfall may cause waterlogging. Ensure proper drainage in fields. Delay pesticide application. Harvest mature crops immediately.";
    } else if (weather.humidity > 80) {
      return "High humidity increases disease risk. Monitor for fungal infections. Increase spacing between plants for better air circulation.";
    } else if (weather.temperature > 32) {
      return "High temperatures may cause heat stress. Provide shade for sensitive crops. Increase irrigation frequency but with less water per session.";
    } else if (weather.windSpeed > 12) {
      return "Strong winds may damage tall crops. Consider temporary supports for banana and papaya plants. Delay spraying operations.";
    } else {
      return "Current conditions are favorable for most farming activities. Good time for planting and field operations.";
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderAnalysisDetails = (details: AnalysisDetails) => (
    <div className="space-y-6">
      {/* Health Metrics */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold mb-3">Health Analysis</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Crop Health:</span>
            <span className={getHealthColor(details.cropHealth)}>{details.cropHealth}</span>
          </div>
          <div className="flex justify-between">
            <span>Soil Health:</span>
            <span className={getHealthColor(details.soilHealth)}>{details.soilHealth}</span>
          </div>
          <div className="flex justify-between">
            <span>Pest Risk:</span>
            <span className={getRiskColor(details.pestRisk)}>{details.pestRisk}</span>
          </div>
          <div className="flex justify-between">
            <span>Water Needs:</span>
            <span>{details.waterNeeds}</span>
          </div>
        </div>
      </div>

      {/* Nutrient Levels */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold mb-3">Nutrient Levels</h3>
        <div className="space-y-3">
          {(Object.entries(details.nutrientLevels) as [keyof NutrientLevels, number][]).map(([nutrient, level]) => (
            <div key={nutrient}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{nutrient}</span>
                <span>{level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`rounded-full h-2 ${
                    level >= 70 ? 'bg-green-600' :
                    level >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remedies */}
      {details.remedies.length > 0 && (
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-3">Recommended Remedies</h3>
          <ul className="list-disc pl-5 space-y-2">
            {details.remedies.map((remedy, index) => (
              <li key={index}>{remedy}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Pest Control */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold mb-3">Pest Control Solutions</h3>
        {details.pestControl.organic.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Organic Solutions:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {details.pestControl.organic.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </div>
        )}
        {details.pestControl.chemical.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Chemical Solutions:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {details.pestControl.chemical.map((solution, index) => (
                <li key={index}>{solution}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaRobot className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-bold">FarmAI Assistant</h1>
                <p className="text-lg opacity-90">Your intelligent Kerala farming companion</p>
              </div>
            </div>
            {/* Weather Information */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt />
                <h3 className="text-lg font-semibold">Kerala Weather • {currentSeason}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaThermometerHalf />
                  <span>{weather.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCloudRain />
                  <span>{weather.humidity.toFixed(0)}% Humidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWater />
                  <span>{weather.rainfall.toFixed(1)}mm Rain</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWind />
                  <span>{weather.windSpeed.toFixed(1)} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUpload /> Plant Analysis
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50">
                {uploadedImage ? (
                  <div>
                    <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded crop"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                    >
                      Upload Another Photo
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <FaImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload a photo of your plant for AI-powered analysis</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors"
                    >
                      Upload Photo
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            
            {/* Current Season Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaLeaf /> {currentSeason} Planting Guide
              </h2>
              <div className="space-y-3">
                <p className="text-gray-600">Recommended crops for current season in Kerala:</p>
                <ul className="space-y-2">
                  {getCurrentMonthCrops().map((crop, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      <span>{crop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Column - Chat and Input */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-semibold mb-4">Ask FarmAI</h2>
              <div className="flex flex-col h-full">
                <div className="flex-grow mb-4 overflow-y-auto max-h-[500px] bg-gray-50 rounded-lg p-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`mb-4 ${
                        message.sender === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'
                      }`}
                    >
                      <div 
                        className={`rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.text}</p>
                      </div>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      } text-gray-500`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="mr-auto">
                      <div className="bg-gray-200 rounded-lg p-3 flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                    placeholder="Ask about crops, pests, or farming practices..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleQuery}
                    className={`${isTyping ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'} text-white px-6 py-2 rounded-lg transition-colors`}
                    disabled={isTyping}
                  >
                    {isTyping ? 'Thinking...' : 'Ask'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="lg:col-span-1">
            {isAnalyzing ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <FaSpinner className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-600">Analyzing your plant with advanced AI...</p>
                <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Analysis Progress:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Image quality check</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Plant species identification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaSpinner className="w-3 h-3 text-yellow-600 animate-spin" />
                      <span>Disease detection processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gray-400">○</span>
                      <span className="text-gray-400">Nutrient analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gray-400">○</span>
                      <span className="text-gray-400">Generating recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Quick Stats */}
                {analysis.details.cropHealth !== 'N/A' && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Quick Analysis</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaSeedling className="text-green-600" />
                          <span className="text-gray-600">Crop Health</span>
                        </div>
                        <p className={`text-xl font-semibold ${getHealthColor(analysis.details.cropHealth)}`}>
                          {analysis.details.cropHealth}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaBug className="text-green-600" />
                          <span className="text-gray-600">Pest Risk</span>
                        </div>
                        <p className={`text-xl font-semibold ${getRiskColor(analysis.details.pestRisk)}`}>
                          {analysis.details.pestRisk}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaWater className="text-green-600" />
                          <span className="text-gray-600">Water Needs</span>
                        </div>
                        <p className="text-xl font-semibold">{analysis.details.waterNeeds}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Analysis */}
                {renderAnalysisDetails(analysis.details)}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
                    <ul className="space-y-3">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <FaRobot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-center">Welcome to FarmAI!</h2>
                <p className="text-gray-600 mb-6 text-center">
                  Kerala's first AI-powered farming assistant
                </p>
                
                <h3 className="font-semibold mb-2">Try Asking:</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setInput("What crops should I plant now in Kerala?");
                      setTimeout(() => handleQuery(), 100);
                    }}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    What crops should I plant now in Kerala?
                  </button>
                  <button 
                    onClick={() => {
                      setInput("How to control pests in coconut trees?");
                      setTimeout(() => handleQuery(), 100);
                    }}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    How to control pests in coconut trees?
                  </button>
                  <button 
                    onClick={() => {
                      setInput("Current market prices for Kerala crops");
                      setTimeout(() => handleQuery(), 100);
                    }}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    Current market prices for Kerala crops
                  </button>
                  <button 
                    onClick={() => {
                      setInput("Will today's weather affect my farming?");
                      setTimeout(() => handleQuery(), 100);
                    }}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    Will today's weather affect my farming?
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 