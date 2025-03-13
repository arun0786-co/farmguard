'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type AnalysisResult = {
  condition: string;
  confidence: number;
  recommendations: string[];
};

export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis result
    setAnalysisResult({
      condition: 'Healthy',
      confidence: 95,
      recommendations: [
        'Continue current care practices',
        'Monitor for pest activity',
        'Maintain irrigation schedule'
      ]
    });
    setIsAnalyzing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please log in to access photo upload.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Crop Photo</h1>
        <p className="mt-2 text-gray-600">Upload photos for instant crop health analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Selected crop"
                  className="mx-auto max-h-64 rounded-lg"
                />
              ) : (
                <>
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-gray-600">Click to upload a photo</p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG, GIF up to 10MB
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium ${
                !selectedFile || isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Photo'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips for Better Analysis</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Ensure good lighting conditions</li>
              <li>• Capture the entire plant or affected area</li>
              <li>• Keep the camera steady and focused</li>
              <li>• Include both healthy and affected parts if possible</li>
            </ul>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Condition:</span>
                <span className="font-medium text-green-600">{analysisResult.condition}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Confidence:</span>
                <span className="font-medium text-blue-600">{analysisResult.confidence}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.confidence}%` }}
                ></div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Recommendations:</h3>
              <ul className="space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 