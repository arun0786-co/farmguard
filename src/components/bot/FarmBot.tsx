'use client';

import { useState, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaRobot, FaImage, FaSpinner, FaChartBar, FaCloud, FaBug, FaSeedling } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

interface Analysis {
  cropHealth: string;
  disease?: string;
  recommendations: string[];
  details?: {
    soilHealth?: string;
    pestRisk?: string;
    waterNeeds?: string;
    nutrientLevels?: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
    remedies?: string[];
    pestControl?: {
      organicSolutions: string[];
      chemicalSolutions: string[];
    };
  };
}

interface WeatherData {
  temperature: number[];
  humidity: number[];
  rainfall: number[];
  labels: string[];
}

interface Props {
  embedded?: boolean;
}

export default function FarmBot({ embedded = false }: Props) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis' | 'weather' | 'tips'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m FarmBot, your agricultural assistant. I can help you with:\n- Crop disease detection\n- Soil analysis\n- Weather insights\n- Farming recommendations\n\nHow can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: [],
    humidity: [],
    rainfall: [],
    labels: []
  });

  // Update weather data every hour
  useEffect(() => {
    if (!user || user.role !== 'FARMER') return;

    const generateWeatherData = () => {
      const now = new Date();
      const labels = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() + i);
        return hour.getHours() + ':00';
      });

      // Generate realistic weather patterns
      const temperature = labels.map((_, i) => {
        const baseTemp = 28; // Base temperature
        const timeOfDay = i % 24; // Hour of the day
        const dailyVariation = Math.sin((timeOfDay - 6) * Math.PI / 12) * 5; // Peak at 6 PM
        return baseTemp + dailyVariation + (Math.random() * 2 - 1);
      });

      const humidity = labels.map((_, i) => {
        const baseHumidity = 75;
        const timeOfDay = i % 24;
        const dailyVariation = -Math.sin((timeOfDay - 6) * Math.PI / 12) * 15; // Inverse of temperature
        return Math.min(100, Math.max(50, baseHumidity + dailyVariation + (Math.random() * 5 - 2.5)));
      });

      const rainfall = labels.map(() => Math.random() * 5);

      setWeatherData({ temperature, humidity, rainfall, labels });
    };

    generateWeatherData();
    const interval = setInterval(generateWeatherData, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, [user]);

  // Only render the bot for farmers
  if (!user || user.role !== 'FARMER') {
    return null;
  }

  const weatherChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  };

  const mockAnalyzeImage = async (file: File): Promise<Analysis> => {
    // Simulate image analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results with remedies and pest control
    return {
      cropHealth: 'Fair',
      recommendations: [
        'Increase watering frequency',
        'Apply organic fertilizer',
        'Monitor for pest activity',
      ],
      details: {
        soilHealth: 'Moderate',
        pestRisk: 'Medium',
        waterNeeds: 'High',
        nutrientLevels: {
          nitrogen: 60,
          phosphorus: 55,
          potassium: 70
        },
        remedies: [
          'Apply compost tea to improve soil health',
          'Use neem oil spray for pest prevention',
          'Add mulch to retain moisture',
          'Supplement with calcium-rich amendments'
        ],
        pestControl: {
          organicSolutions: [
            'Neem oil spray',
            'Garlic and chili spray',
            'Diatomaceous earth'
          ],
          chemicalSolutions: [
            'Pyrethrin-based insecticide',
            'Spinosad spray',
            'Insecticidal soap'
          ]
        }
      }
    };
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    // Add user message with image
    const userMessage: Message = {
      id: Date.now().toString(),
      text: 'Please analyze this crop image.',
      sender: 'user',
      timestamp: new Date(),
      image: URL.createObjectURL(file),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Analyze image
      const analysis = await mockAnalyzeImage(file);
      setCurrentAnalysis(analysis);

      // Add bot response with analysis
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Image Analysis Results:\n\n🌱 Crop Health: ${analysis.cropHealth}\n${
          analysis.disease ? `⚠️ Detected Disease: ${analysis.disease}\n` : ''
        }\n📋 Recommendations:\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setActiveTab('analysis');
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error analyzing the image. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process user query and generate response
    const query = input.toLowerCase();
    let response = '';

    if (query.includes('what') && query.includes('plant') && query.includes('grow')) {
      // Location-based crop recommendations
      const mockLocation = { city: 'Mumbai', season: 'Summer' };
      const marketDemand = {
        tomatoes: 'High',
        spinach: 'Medium',
        okra: 'Very High',
        eggplant: 'High'
      };

      response = `Based on your location (${mockLocation.city}) and current ${mockLocation.season} season:\n\n` +
        '🌱 Recommended Crops:\n' +
        '1. Okra (Lady Finger)\n   - Market Demand: Very High\n   - Ideal growing conditions\n\n' +
        '2. Tomatoes\n   - Market Demand: High\n   - Good profit margins\n\n' +
        '3. Eggplant\n   - Market Demand: High\n   - Resistant to heat\n\n' +
        'These recommendations are based on:\n' +
        '• Local market demand\n' +
        '• Current weather conditions\n' +
        '• Soil suitability\n' +
        '• Historical crop success rates';
    } else if (query.includes('pest')) {
      response = '🐛 Pest Control Recommendations:\n\n' +
        'Organic Solutions:\n' +
        '• Neem oil spray (for aphids, mites)\n' +
        '• Garlic and chili spray (for soft-bodied insects)\n' +
        '• Diatomaceous earth (for crawling insects)\n\n' +
        'Chemical Solutions:\n' +
        '• Pyrethrin-based insecticide (broad spectrum)\n' +
        '• Spinosad spray (for caterpillars, thrips)\n' +
        '• Insecticidal soap (for soft-bodied insects)\n\n' +
        '⚠️ Always test on a small area first and follow safety guidelines.';
    } else if (!query.includes('analyze')) {
      response = 'To get started:\n' +
        '1. 📸 Upload a photo of your plants for health analysis\n' +
        '2. Ask "What should I plant?" for crop recommendations\n' +
        '3. Ask about pest control for specific solutions\n' +
        '4. Check weather and soil conditions\n\n' +
        'Please upload a plant photo first for the most accurate advice!';
    }

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return (
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {currentAnalysis ? (
              <>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Crop Health Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Overall Health</p>
                      <p className={`text-xl font-semibold ${
                        currentAnalysis.cropHealth === 'Good' ? 'text-green-500' :
                        currentAnalysis.cropHealth === 'Fair' ? 'text-yellow-500' : 'text-red-500'
                      }`}>{currentAnalysis.cropHealth}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Soil Health</p>
                      <p className={`text-xl font-semibold ${
                        currentAnalysis.details?.soilHealth === 'Good' ? 'text-green-500' :
                        currentAnalysis.details?.soilHealth === 'Moderate' ? 'text-yellow-500' : 'text-red-500'
                      }`}>{currentAnalysis.details?.soilHealth}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Pest Risk</p>
                      <p className={`text-xl font-semibold ${
                        currentAnalysis.details?.pestRisk === 'Low' ? 'text-green-500' :
                        currentAnalysis.details?.pestRisk === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                      }`}>{currentAnalysis.details?.pestRisk}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Water Needs</p>
                      <p className={`text-xl font-semibold ${
                        currentAnalysis.details?.waterNeeds === 'Adequate' ? 'text-green-500' :
                        currentAnalysis.details?.waterNeeds === 'High' ? 'text-yellow-500' : 'text-red-500'
                      }`}>{currentAnalysis.details?.waterNeeds}</p>
                    </div>
                  </div>
                </div>

                {currentAnalysis.details?.remedies && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Recommended Remedies</h3>
                    <ul className="space-y-2">
                      {currentAnalysis.details.remedies.map((remedy, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500">•</span>
                          <span>{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentAnalysis.details?.pestControl && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Pest Control Solutions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-500 mb-2">Organic Solutions</h4>
                        <ul className="space-y-1">
                          {currentAnalysis.details.pestControl.organicSolutions.map((solution, index) => (
                            <li key={index} className="text-sm">• {solution}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-500 mb-2">Chemical Solutions</h4>
                        <ul className="space-y-1">
                          {currentAnalysis.details.pestControl.chemicalSolutions.map((solution, index) => (
                            <li key={index} className="text-sm">• {solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">Nutrient Levels</h3>
                  <div className="space-y-2">
                    {currentAnalysis.details?.nutrientLevels && Object.entries(currentAnalysis.details.nutrientLevels).map(([nutrient, level]) => (
                      <div key={nutrient} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="capitalize">{nutrient}</span>
                          <span>{level}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`rounded-full h-2 ${
                              level >= 70 ? 'bg-green-500' :
                              level >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <p>No analysis data available. Upload an image to get started.</p>
              </div>
            )}
          </div>
        );
      case 'weather':
        return (
          <div className="h-full overflow-y-auto p-4 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Temperature</p>
                  <p className="text-2xl font-semibold text-white">
                    {weatherData.temperature[0]?.toFixed(1)}°C
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Humidity</p>
                  <p className="text-2xl font-semibold text-white">
                    {weatherData.humidity[0]?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">24-Hour Forecast</h3>
              <div className="h-64 mb-6">
                <Line
                  data={{
                    labels: weatherData.labels,
                    datasets: [
                      {
                        label: 'Temperature (°C)',
                        data: weatherData.temperature,
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.5)',
                        tension: 0.4
                      },
                      {
                        label: 'Humidity (%)',
                        data: weatherData.humidity,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        tension: 0.4
                      }
                    ]
                  }}
                  options={weatherChartOptions}
                />
              </div>
              <div className="h-64">
                <Line
                  data={{
                    labels: weatherData.labels,
                    datasets: [
                      {
                        label: 'Rainfall (mm)',
                        data: weatherData.rainfall,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.5)',
                        tension: 0.4,
                        fill: true
                      }
                    ]
                  }}
                  options={weatherChartOptions}
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Farming Impact</h3>
              <p className="text-gray-300">
                {weatherData.temperature[0] > 30
                  ? "High temperatures may stress crops. Consider additional irrigation."
                  : weatherData.humidity[0] > 80
                  ? "High humidity increases disease risk. Monitor for fungal growth."
                  : "Current conditions are favorable for most farming activities."}
              </p>
            </div>
          </div>
        );
      case 'tips':
        return (
          <div className="h-full overflow-y-auto p-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Farming Tips</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">Soil Management</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Test soil pH regularly</li>
                    <li>Add organic matter</li>
                    <li>Practice crop rotation</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">Pest Control</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Use companion planting</li>
                    <li>Implement natural predators</li>
                    <li>Regular monitoring</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">Water Management</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    <li>Water deeply but less frequently</li>
                    <li>Use mulch to retain moisture</li>
                    <li>Water early morning or evening</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 h-full overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    {message.image && (
                      <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
                        <Image
                          src={message.image}
                          alt="Uploaded crop"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    <span>Analyzing image...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return embedded ? (
    <div className="h-full bg-gray-900 rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FaRobot className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-100">FarmBot</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 p-3 text-sm font-medium ${
            activeTab === 'chat'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <FaRobot className="w-4 h-4" />
            <span>Chat</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 p-3 text-sm font-medium ${
            activeTab === 'analysis'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <FaChartBar className="w-4 h-4" />
            <span>Analysis</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`flex-1 p-3 text-sm font-medium ${
            activeTab === 'weather'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <FaCloud className="w-4 h-4" />
            <span>Weather</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 p-3 text-sm font-medium ${
            activeTab === 'tips'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <FaSeedling className="w-4 h-4" />
            <span>Tips</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Input */}
      {activeTab === 'chat' && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-300"
              title="Upload image"
            >
              <FaImage className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about crops, weather, or upload an image..."
              className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <>
      {/* Bot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-500 transition-colors"
      >
        <FaRobot className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[800px] h-[600px] bg-gray-900 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <FaRobot className="w-6 h-6 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-100">FarmBot</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-300"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'chat'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaRobot className="w-4 h-4" />
                <span>Chat</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'analysis'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaChartBar className="w-4 h-4" />
                <span>Analysis</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'weather'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaCloud className="w-4 h-4" />
                <span>Weather</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 p-3 text-sm font-medium ${
                activeTab === 'tips'
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaSeedling className="w-4 h-4" />
                <span>Tips</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {renderTabContent()}
          </div>

          {/* Input */}
          {activeTab === 'chat' && (
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-300"
                  title="Upload image"
                >
                  <FaImage className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about crops, weather, or upload an image..."
                  className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
} 