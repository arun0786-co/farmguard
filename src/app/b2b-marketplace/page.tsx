'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaFilter, FaSearch, FaRupeeSign, FaInfoCircle, FaPhone, FaEnvelope, FaShoppingBasket, FaHandshake, FaSeedling } from 'react-icons/fa';

// Mock data for farmers
const mockFarmers = [
  {
    id: 'f1',
    name: 'Krishna Farms',
    location: 'Thrissur, Kerala',
    specialties: ['Rice', 'Coconut', 'Banana'],
    avgOutput: '500 kg per month',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    bio: 'Farming organically for over 15 years. Specializing in traditional Kerala rice varieties and high-quality coconuts.',
    contactPhone: '+91 9876543210',
    contactEmail: 'krishna@farms.com',
    availableProducts: [
      { 
        name: 'Njavara Rice', 
        quantity: '200 kg', 
        price: 120, 
        minOrder: '50 kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      { 
        name: 'Coconut', 
        quantity: '1000 units', 
        price: 35, 
        minOrder: '100 units',
        image: 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      { 
        name: 'Nendran Banana', 
        quantity: '300 kg', 
        price: 80, 
        minOrder: '50 kg',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
    ]
  },
  {
    id: 'f2',
    name: 'Green Valley Farms',
    location: 'Wayanad, Kerala',
    specialties: ['Coffee', 'Spices', 'Fruits'],
    avgOutput: '300 kg per month',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    bio: 'Family-owned farm specializing in shade-grown coffee and premium spices from the highlands of Wayanad.',
    contactPhone: '+91 9876543211',
    contactEmail: 'info@greenvalley.com',
    availableProducts: [
      { 
        name: 'Robusta Coffee Beans', 
        quantity: '150 kg', 
        price: 850, 
        minOrder: '25 kg',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      { 
        name: 'Black Pepper', 
        quantity: '80 kg', 
        price: 750, 
        minOrder: '10 kg',
        image: 'https://images.unsplash.com/photo-1613758235256-43a7bdc21d82?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      { 
        name: 'Cardamom', 
        quantity: '30 kg', 
        price: 2800, 
        minOrder: '5 kg',
        image: 'https://images.unsplash.com/photo-1599909631715-c0ee017d1f76?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
    ]
  },
  {
    id: 'f3',
    name: 'Coastal Harvest',
    location: 'Alappuzha, Kerala',
    specialties: ['Fish', 'Rice', 'Coconut'],
    avgOutput: '700 kg per month',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    bio: 'Integrated farm with paddy fields and fish farming in the backwaters of Alappuzha. Practicing sustainable farming for generations.',
    contactPhone: '+91 9876543212',
    contactEmail: 'coastal@harvest.com',
    availableProducts: [
      { 
        name: 'Karimeen (Pearl Spot)', 
        quantity: '100 kg', 
        price: 650, 
        minOrder: '10 kg',
        image: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      { 
        name: 'Pokkali Rice', 
        quantity: '300 kg', 
        price: 160, 
        minOrder: '50 kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
      { 
        name: 'Tender Coconut', 
        quantity: '500 units', 
        price: 45, 
        minOrder: '50 units',
        image: 'https://images.unsplash.com/photo-1580984969071-a8da5656c2fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      },
    ]
  },
];

// Mock data for vendors/businesses
const mockVendors = [
  {
    id: 'v1',
    name: 'Kerala Foods Exports',
    location: 'Kochi, Kerala',
    businessType: 'Exporter',
    interestedIn: ['Rice', 'Spices', 'Coconut Products'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    bio: 'Leading exporter of premium Kerala agricultural products to the Middle East and Europe. Seeking consistent high-quality supplies.',
    contactPerson: 'Rajesh Menon',
    contactPhone: '+91 9876543220',
    contactEmail: 'procurement@keralafoods.com',
    lookingFor: [
      { product: 'Organic Rice', quantity: '2000 kg per month', priceRange: '₹110-130 per kg' },
      { product: 'Black Pepper', quantity: '500 kg per month', priceRange: '₹700-800 per kg' },
      { product: 'Virgin Coconut Oil', quantity: '1000 liters per month', priceRange: '₹350-400 per liter' },
    ]
  },
  {
    id: 'v2',
    name: 'Spice Valley Restaurants',
    location: 'Trivandrum, Kerala',
    businessType: 'Restaurant Chain',
    interestedIn: ['Vegetables', 'Fruits', 'Fish'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    bio: 'Chain of authentic Kerala cuisine restaurants committed to using fresh, locally-sourced ingredients.',
    contactPerson: 'Lakshmi Nair',
    contactPhone: '+91 9876543221',
    contactEmail: 'supply@spicevalley.com',
    lookingFor: [
      { product: 'Fresh Vegetables', quantity: '300 kg per week', priceRange: 'Market rate' },
      { product: 'Seasonal Fruits', quantity: '200 kg per week', priceRange: 'Market rate' },
      { product: 'Fresh Seafood', quantity: '150 kg per week', priceRange: '₹500-700 per kg' },
    ]
  },
  {
    id: 'v3',
    name: 'Kerala Health Products',
    location: 'Ernakulam, Kerala',
    businessType: 'Manufacturer',
    interestedIn: ['Medicinal Plants', 'Herbs', 'Organic Produce'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    bio: 'Manufacturer of traditional Ayurvedic and health products using authentic Kerala herbs and ingredients.',
    contactPerson: 'Dr. Anand Sharma',
    contactPhone: '+91 9876543222',
    contactEmail: 'sourcing@keralahealthproducts.com',
    lookingFor: [
      { product: 'Njavara Rice', quantity: '500 kg per month', priceRange: '₹120-140 per kg' },
      { product: 'Medicinal Herbs', quantity: 'Varies by type', priceRange: 'Premium prices for quality' },
      { product: 'Organic Turmeric', quantity: '200 kg per month', priceRange: '₹160-200 per kg' },
    ]
  },
];

interface EntityCardProps {
  entity: any;
  type: 'farmer' | 'vendor';
  onViewDetails: (id: string, type: 'farmer' | 'vendor') => void;
}

interface EntityDetailsProps {
  entity: any;
  type: 'farmer' | 'vendor';
  onClose: () => void;
  onContact: (entity: any) => void;
}

interface User {
  name: string;
  email: string;
  role: string;
  userType: 'FARMER' | 'SUPPLIER' | 'CONSUMER';
}

const getProductPlaceholderImage = (productName: string): string => {
  const name = productName.toLowerCase();
  
  // Map product names to placeholder images
  if (name.includes('rice')) return '/images/products/rice-placeholder.jpg';
  if (name.includes('coconut')) return '/images/products/coconut-placeholder.jpg';
  if (name.includes('banana')) return '/images/products/banana-placeholder.jpg';
  if (name.includes('coffee')) return '/images/products/coffee-placeholder.jpg';
  if (name.includes('pepper')) return '/images/products/pepper-placeholder.jpg';
  if (name.includes('cardamom')) return '/images/products/cardamom-placeholder.jpg';
  if (name.includes('fish') || name.includes('seafood')) return '/images/products/fish-placeholder.jpg';
  if (name.includes('vegetable')) return '/images/products/vegetable-placeholder.jpg';
  if (name.includes('fruit')) return '/images/products/fruit-placeholder.jpg';
  if (name.includes('herb') || name.includes('medicinal')) return '/images/products/herb-placeholder.jpg';
  if (name.includes('turmeric')) return '/images/products/turmeric-placeholder.jpg';
  
  // Default placeholder for unknown products
  return '/images/products/default-product-placeholder.jpg';
};

const EntityCard = ({ entity, type, onViewDetails }: EntityCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image 
          src={imageError ? '/images/placeholder-farm.jpg' : entity.image} 
          alt={entity.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold">{entity.name}</h3>
        <p className="text-gray-600 mb-2">{entity.location}</p>
        
        {type === 'farmer' && (
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium mr-2">Specialties:</span>
              <span className="text-gray-600">{entity.specialties.join(', ')}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-2">Avg. Output:</span>
              <span className="text-gray-600">{entity.avgOutput}</span>
            </div>
          </div>
        )}
        
        {type === 'vendor' && (
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-gray-700 font-medium mr-2">Business Type:</span>
              <span className="text-gray-600">{entity.businessType}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-2">Interested In:</span>
              <span className="text-gray-600">{entity.interestedIn.join(', ')}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.floor(entity.rating) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
          <span className="ml-2 text-gray-600">{entity.rating.toFixed(1)}</span>
        </div>
        
        <button 
          onClick={() => onViewDetails(entity.id, type)}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
        >
          <FaInfoCircle /> View Details
        </button>
      </div>
    </div>
  );
};

const EntityDetails = ({ entity, type, onClose, onContact }: EntityDetailsProps) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64 w-full">
          <Image 
            src={imageError ? '/images/placeholder-farm.jpg' : entity.image} 
            alt={entity.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={() => setImageError(true)}
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{entity.name}</h2>
              <p className="text-gray-600">{entity.location}</p>
            </div>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(entity.rating) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">{entity.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="my-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700">{entity.bio}</p>
          </div>
          
          {type === 'farmer' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Available Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum Order</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entity.availableProducts.map((product: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative w-16 h-16">
                            <Image
                              src={product.image || getProductPlaceholderImage(product.name)}
                              alt={product.name}
                              fill
                              className="object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getProductPlaceholderImage(product.name);
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} per kg/unit</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.minOrder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {type === 'vendor' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Looking For</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Needed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entity.lookingFor.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.priceRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 mb-4">
              {type === 'vendor' && (
                <p className="flex items-center gap-2">
                  <span className="font-medium">Contact Person:</span>
                  <span>{entity.contactPerson}</span>
                </p>
              )}
              <p className="flex items-center gap-2">
                <FaPhone className="text-gray-600" />
                <span>{entity.contactPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-gray-600" />
                <span>{entity.contactEmail}</span>
              </p>
            </div>
            
            <button 
              onClick={() => onContact(entity)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
            >
              <FaHandshake /> Contact and Negotiate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function B2BMarketplacePage() {
  const { user } = useAuth() as { user: User | null };
  const router = useRouter();
  
  // For suppliers, we only show vendors. For farmers, we show both tabs
  const [activeTab, setActiveTab] = useState<'farms' | 'vendors'>(user?.userType === 'SUPPLIER' ? 'vendors' : 'farms');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [entityType, setEntityType] = useState<'farmer' | 'vendor'>('farmer');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactEntity, setContactEntity] = useState<any>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Product categories for filtering
  const productCategories = [
    'Rice', 'Coconut', 'Banana', 'Spices', 'Coffee', 
    'Fish', 'Vegetables', 'Fruits', 'Medicinal Plants', 'Organic'
  ];
  
  // Protect the route
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);
  
  if (!user) {
    return null;
  }
  
  const filteredFarmers = mockFarmers.filter(farmer => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply category filters
    const matchesFilters = selectedFilters.length === 0 || 
      farmer.specialties.some(specialty => 
        selectedFilters.includes(specialty)
      );
    
    return matchesSearch && matchesFilters;
  });
  
  const filteredVendors = mockVendors.filter(vendor => {
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.interestedIn.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply category filters
    const matchesFilters = selectedFilters.length === 0 || 
      vendor.interestedIn.some(interest => 
        selectedFilters.includes(interest)
      );
    
    return matchesSearch && matchesFilters;
  });
  
  const handleViewDetails = (id: string, type: 'farmer' | 'vendor') => {
    if (type === 'farmer') {
      const farmer = mockFarmers.find(f => f.id === id);
      setSelectedEntity(farmer);
    } else {
      const vendor = mockVendors.find(v => v.id === id);
      setSelectedEntity(vendor);
    }
    setEntityType(type);
  };
  
  const handleCloseDetails = () => {
    setSelectedEntity(null);
  };
  
  const handleContact = (entity: any) => {
    setContactEntity(entity);
    setShowContactForm(true);
    setSelectedEntity(null);
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size (5MB limit)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };
  
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]); // Clean up the URL
      return prev.filter((_, i) => i !== index);
    });
  };
  
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }
      
      // In a real app, this would send the message and images to the recipient
      console.log('Sending message to:', contactEntity.name);
      console.log('Message:', contactMessage);
      console.log('Images:', selectedImages);
      
      // Show success message
      setContactSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowContactForm(false);
        setContactEntity(null);
        setContactMessage('');
        setContactSuccess(false);
        setSelectedImages([]);
        setImagePreviewUrls([]);
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleFilter = (category: string) => {
    if (selectedFilters.includes(category)) {
      setSelectedFilters(selectedFilters.filter(f => f !== category));
    } else {
      setSelectedFilters([...selectedFilters, category]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">B2B Agricultural Marketplace</h1>
          <p className="text-lg opacity-90">
            {user?.userType === 'SUPPLIER' 
              ? 'Connect with restaurants and shops for bulk sales'
              : 'Connect with other farmers and businesses for collaboration'}
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-1">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setActiveTab('farms')}
              className={`py-3 rounded-lg font-medium ${
                activeTab === 'farms' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaShoppingBasket />
                <span>Farms & Products</span>
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('vendors')}
              className={`py-3 rounded-lg font-medium ${
                activeTab === 'vendors' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaHandshake />
                <span>Businesses & Vendors</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab === 'farms' ? 'farms' : 'businesses'}...`}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <FaFilter />
              <span>Filter by Product</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg animate-fadeIn">
              <h3 className="font-medium mb-3">Product Categories</h3>
              <div className="flex flex-wrap gap-2">
                {productCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleFilter(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      selectedFilters.includes(category)
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Entities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'farms' && filteredFarmers.map(farmer => (
            <div key={farmer.id} className="transform hover:scale-[1.02] transition-transform duration-200">
              <EntityCard 
                entity={farmer}
                type="farmer"
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
          
          {activeTab === 'vendors' && filteredVendors.map(vendor => (
            <div key={vendor.id} className="transform hover:scale-[1.02] transition-transform duration-200">
              <EntityCard 
                entity={vendor}
                type="vendor"
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>
        
        {(activeTab === 'farms' && filteredFarmers.length === 0) || 
         (activeTab === 'vendors' && filteredVendors.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No results found. Try adjusting your filters.</p>
          </div>
        ) : null}
      </div>
      
      {/* Entity Details Modal */}
      {selectedEntity && (
        <EntityDetails 
          entity={selectedEntity}
          type={entityType}
          onClose={handleCloseDetails}
          onContact={handleContact}
        />
      )}
      
      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl overflow-hidden max-w-xl w-full transform transition-all duration-300">
            <div className="p-6">
              {contactSuccess ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                  <p className="text-gray-600">Your message has been sent to {contactEntity?.name}. They will contact you soon.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Contact {contactEntity?.name}</h2>
                    <button 
                      onClick={() => {
                        setShowContactForm(false);
                        setContactEntity(null);
                        setSelectedImages([]);
                        setImagePreviewUrls([]);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitContact}>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Your Business Information
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <p><strong>Name:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Role:</strong> {user?.role}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={`Hello, I'm interested in discussing a potential bulk order for your products...`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[150px] transition-all duration-200"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Attach Photos (Optional)
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageSelect}
                              multiple
                            />
                          </label>
                        </div>

                        {imagePreviewUrls.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition-colors duration-200 flex items-center justify-center gap-2 ${
                        isLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending...</span>
                          <span className="text-sm">({uploadProgress}%)</span>
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 