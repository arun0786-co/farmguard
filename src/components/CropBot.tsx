'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type BotMessage = {
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
};

type AnalysisResult = {
  condition: string;
  confidence: number;
  recommendations: string[];
  imageUrl?: string;
};

const mockAnalysisResults: AnalysisResult[] = [
  {
    condition: 'Healthy',
    confidence: 95,
    recommendations: [
      'Continue current care practices',
      'Regular monitoring for any changes',
      'Maintain current watering schedule'
    ]
  },
  {
    condition: 'Leaf Spot Disease',
    confidence: 85,
    recommendations: [
      'Apply organic fungicide',
      'Improve air circulation between plants',
      'Avoid overhead watering'
    ]
  },
  {
    condition: 'Nutrient Deficiency',
    confidence: 78,
    recommendations: [
      'Apply balanced NPK fertilizer',
      'Consider soil pH testing',
      'Add organic compost'
    ]
  },
  {
    condition: 'Pest Infestation',
    confidence: 82,
    recommendations: [
      'Apply neem oil solution',
      'Introduce beneficial insects',
      'Monitor daily for pest activity'
    ]
  }
];

// Enhanced bot responses
const botResponses = {
  greetings: [
    "Hello! I'm your crop analysis assistant. How can I help you today?",
    "Welcome! I'm here to help with your crop analysis needs.",
    "Hi there! Need help analyzing your crops?"
  ],
  cropHealth: [
    "Based on my analysis, your crop shows signs of {condition}. The confidence level is {confidence}%.",
    "I've detected {condition} in your crop with {confidence}% confidence.",
    "Your crop appears to be showing symptoms of {condition}. I'm {confidence}% confident about this assessment."
  ],
  recommendations: [
    "Here are my recommended actions:",
    "I suggest the following steps:",
    "To address this issue, consider these recommendations:"
  ],
  questions: {
    "fertilizer": "For fertilizer recommendations, I need to know: 1) Crop type 2) Growth stage 3) Soil condition. Can you provide these details?",
    "water": "To help with watering advice, please tell me: 1) Crop type 2) Current weather 3) Soil moisture level",
    "pest": "For pest control suggestions, I need: 1) Visible symptoms 2) Affected plant parts 3) How long you've noticed the issue",
    "disease": "To diagnose plant diseases, please share: 1) Visible symptoms 2) When it started 3) Weather conditions"
  }
};

export default function CropBot() {
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      type: 'bot',
      content: 'Hello! I\'m your crop analysis assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: BotMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Enhanced bot response logic
    const lowerInput = input.toLowerCase();
    let botResponse = '';

    if (lowerInput.includes('fertilizer')) {
      botResponse = botResponses.questions.fertilizer;
    } else if (lowerInput.includes('water') || lowerInput.includes('irrigation')) {
      botResponse = botResponses.questions.water;
    } else if (lowerInput.includes('pest')) {
      botResponse = botResponses.questions.pest;
    } else if (lowerInput.includes('disease')) {
      botResponse = botResponses.questions.disease;
    } else {
      botResponse = "I can help you with crop analysis, fertilizer recommendations, watering schedules, and pest control. What specific information do you need?";
    }

    setInput('');
    
    // Simulate bot thinking
    setIsAnalyzing(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }]);
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setIsAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        const randomResult = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];
        setAnalysisResult(randomResult);
        setIsAnalyzing(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Crop Analysis Bot</h2>
          <p className="text-gray-600">Ask questions or upload photos for instant analysis</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-[400px] overflow-y-auto mb-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span>Analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
          />
          <div className="text-4xl mb-2">📸</div>
          <p className="text-gray-600">Click to upload a crop photo</p>
        </div>
      </div>

      {/* Analysis Result */}
      {analysisResult && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">{analysisResult.condition}</h3>
            <span className="text-sm text-gray-600">
              Confidence: {analysisResult.confidence}%
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
            <ul className="space-y-2">
              {analysisResult.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="text-green-600 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crop health..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
} 