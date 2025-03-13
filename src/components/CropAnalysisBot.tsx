'use client';

import { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

type AnalysisResult = {
  condition: string;
  confidence: number;
  recommendations: string[];
  details: {
    soilHealth?: string;
    pestRisk?: string;
    waterNeeds?: string;
    nutrientLevels?: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  };
};

const mockAnalyze = async (imageUrl: string): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock analysis
  return {
    condition: ['Healthy', 'Minor Issues', 'Needs Attention', 'Critical'][Math.floor(Math.random() * 4)],
    confidence: 70 + Math.floor(Math.random() * 25),
    recommendations: [
      'Maintain regular watering schedule',
      'Monitor for pest activity',
      'Consider soil testing',
      'Apply organic fertilizer if needed'
    ],
    details: {
      soilHealth: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)],
      pestRisk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      waterNeeds: ['Adequate', 'Needs Water', 'Over-watered'][Math.floor(Math.random() * 3)],
      nutrientLevels: {
        nitrogen: Math.floor(Math.random() * 100),
        phosphorus: Math.floor(Math.random() * 100),
        potassium: Math.floor(Math.random() * 100)
      }
    }
  };
};

export default function CropAnalysisBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! I\'m your FarmGuard AI assistant. I can help you analyze your crops and provide recommendations. Would you like to upload a photo or ask a question?',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setIsAnalyzing(true);
      
      // Add message about analyzing
      addMessage('bot', 'Analyzing your crop image...');
      
      try {
        const result = await mockAnalyze(imageUrl);
        setAnalysisResult(result);
        
        // Add analysis results to chat
        addMessage('bot', `Analysis Complete!\n
Condition: ${result.condition} (${result.confidence}% confidence)\n
Soil Health: ${result.details.soilHealth}\n
Pest Risk: ${result.details.pestRisk}\n
Water Status: ${result.details.waterNeeds}\n
\nRecommendations:\n${result.recommendations.join('\n')}`);
      } catch (error) {
        addMessage('bot', 'Sorry, there was an error analyzing your image. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const addMessage = (type: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    addMessage('user', userInput);
    const question = userInput;
    setUserInput('');

    // Simulate bot thinking
    setTimeout(() => {
      let response = '';
      
      // Simple keyword-based responses
      if (question.toLowerCase().includes('water')) {
        response = 'For optimal crop health, maintain consistent soil moisture. Water deeply but less frequently to encourage root growth. Consider using mulch to retain moisture.';
      } else if (question.toLowerCase().includes('pest')) {
        response = 'To manage pests naturally:\n1. Introduce beneficial insects\n2. Use companion planting\n3. Apply neem oil for severe cases\n4. Maintain crop rotation';
      } else if (question.toLowerCase().includes('fertilizer')) {
        response = 'Choose fertilizers based on your soil test results. Organic options include:\n- Compost\n- Manure\n- Bone meal\n- Fish emulsion';
      } else {
        response = 'I can help you with crop analysis, pest management, watering schedules, and fertilizer recommendations. Feel free to ask specific questions or upload a photo for analysis.';
      }
      
      addMessage('bot', response);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">FarmGuard AI Assistant</h2>
        <p className="text-sm text-gray-600">Ask questions or upload photos for analysis</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
              <div className="text-xs mt-1 opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="p-4 border-t">
          <div className="relative h-40 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Uploaded crop"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            📸
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
      </div>
    </div>
  );
} 