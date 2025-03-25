import { supabase, Database } from './supabase'

export type Farmer = Database['public']['Tables']['farmers']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Vendor = Database['public']['Tables']['vendors']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

// Farmers
export async function getFarmers() {
  const { data, error } = await supabase
    .from('farmers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getFarmerById(id: string) {
  const { data, error } = await supabase
    .from('farmers')
    .select('*, products(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, farmers(*)')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, farmers(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Vendors
export async function getVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getVendorById(id: string) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Orders
export async function createOrder(order: Database['public']['Tables']['orders']['Insert']) {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getOrdersByVendor(vendorId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(*), farmers(*)')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getOrdersByFarmer(farmerId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(*), vendors(*)')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Sample data for development
export const sampleFarmers = [
  {
    name: "Krishna Farms",
    location: "Thrissur, Kerala",
    specialties: ["Rice", "Coconut", "Banana"],
    average_output: "500kg per month",
    rating: 4.8,
    bio: "Family-owned farm specializing in traditional Kerala rice varieties and organic farming practices for over 50 years.",
    contact: {
      email: "krishna.farms@example.com",
      phone: "+91-9876543210",
      address: "123 Farm Road, Thrissur, Kerala"
    },
    image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmljZSUyMGZhcm18ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Green Valley Farms",
    location: "Wayanad, Kerala",
    specialties: ["Coffee", "Pepper", "Cardamom"],
    average_output: "300kg per month",
    rating: 4.5,
    bio: "Organic spice farm in the hills of Wayanad, practicing sustainable agriculture and fair trade principles.",
    contact: {
      email: "green.valley@example.com",
      phone: "+91-8765432109",
      address: "45 Hill View, Wayanad, Kerala"
    },
    image_url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y29mZmVlJTIwZmFybXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Coastal Harvest",
    location: "Alappuzha, Kerala",
    specialties: ["Fish", "Rice", "Coconut"],
    average_output: "750kg per month",
    rating: 4.7,
    bio: "Integrated fish and rice farm using traditional 'pokkali' farming techniques that have been recognized by FAO as globally important agricultural heritage systems.",
    contact: {
      email: "coastal.harvest@example.com",
      phone: "+91-7654321098",
      address: "78 Backwater Lane, Alappuzha, Kerala"
    },
    image_url: "https://images.unsplash.com/photo-1584946453711-9c87e7e1f3a4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaCUyMGZhcm18ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  }
];

export const sampleVendors = [
  {
    name: "Kerala Foods Exports",
    location: "Kochi, Kerala",
    specialties: ["Rice", "Spices", "Coconut Products"],
    rating: 4.6,
    bio: "Leading exporter of premium Kerala food products to international markets, with a focus on quality and sustainability.",
    contact: {
      email: "kfe@example.com",
      phone: "+91-9876543211",
      address: "5 Export Zone, Kochi, Kerala"
    },
    image_url: "https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZXhwb3J0JTIwd2FyZWhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Spice Valley Restaurants",
    location: "Kozhikode, Kerala",
    specialties: ["Organic Spices", "Fresh Produce", "Seafood"],
    rating: 4.9,
    bio: "Chain of farm-to-table restaurants dedicated to authentic Kerala cuisine using fresh, locally sourced ingredients.",
    contact: {
      email: "spice.valley@example.com",
      phone: "+91-8765432100",
      address: "34 Food Street, Kozhikode, Kerala"
    },
    image_url: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudCUyMGtpdGNoZW58ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Kerala Health Products",
    location: "Thiruvananthapuram, Kerala",
    specialties: ["Ayurvedic Herbs", "Medicinal Rice", "Organic Oils"],
    rating: 4.7,
    bio: "Manufacturer of traditional health products based on Kerala's rich Ayurvedic heritage, using ingredients sourced directly from certified organic farms.",
    contact: {
      email: "health@example.com",
      phone: "+91-7654321099",
      address: "12 Wellness Road, Thiruvananthapuram, Kerala"
    },
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aGVyYmFsJTIwcHJvZHVjdHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  }
];

export const sampleProducts = [
  {
    farmer_id: "", // Will be set when inserting
    name: "Njavara Rice",
    description: "Ancient medicinal rice variety from Kerala, used in Ayurvedic treatments and special dishes.",
    price: 250.00,
    quantity: 100,
    unit: "kg",
    category: "Rice",
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cmljZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    farmer_id: "", // Will be set when inserting
    name: "Green Cardamom",
    description: "Premium quality green cardamom pods with intense flavor and aroma.",
    price: 1200.00,
    quantity: 50,
    unit: "kg",
    category: "Spices",
    image_url: "https://images.unsplash.com/photo-1615485925763-86786288908a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyZGFtb218ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    farmer_id: "", // Will be set when inserting
    name: "Organic Coconut Oil",
    description: "Cold-pressed virgin coconut oil extracted from fresh organic coconuts.",
    price: 350.00,
    quantity: 200,
    unit: "liter",
    category: "Oil",
    image_url: "https://images.unsplash.com/photo-1528817942274-efbb5cb6073f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29jb251dCUyMG9pbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    farmer_id: "", // Will be set when inserting
    name: "Nendran Banana",
    description: "Traditional Kerala banana variety, perfect for chips and special dishes.",
    price: 80.00,
    quantity: 300,
    unit: "kg",
    category: "Fruit",
    image_url: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJhbmFuYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    farmer_id: "", // Will be set when inserting
    name: "Black Pepper",
    description: "Premium Malabar black pepper, known for its rich aroma and sharp taste.",
    price: 550.00,
    quantity: 100,
    unit: "kg",
    category: "Spices",
    image_url: "https://images.unsplash.com/photo-1551649556-d343d9119e4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YmxhY2slMjBwZXBwZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    farmer_id: "", // Will be set when inserting
    name: "Single Origin Coffee",
    description: "Premium Arabica coffee beans from the hills of Wayanad, medium roast.",
    price: 450.00,
    quantity: 75,
    unit: "kg",
    category: "Coffee",
    image_url: "https://images.unsplash.com/photo-1598908314732-07113901949e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwYmVhbnN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  }
];

// Function to populate sample data
export async function populateSampleData() {
  try {
    // Insert farmers
    const { data: farmers, error: farmersError } = await supabase
      .from('farmers')
      .insert(sampleFarmers)
      .select()
    
    if (farmersError) throw farmersError
    console.log('Inserted farmers:', farmers)
    
    // Assign farmer_id to products
    const productsWithFarmerIds = sampleProducts.map((product, index) => {
      const farmerId = farmers[index % farmers.length].id
      return { ...product, farmer_id: farmerId }
    })
    
    // Insert products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(productsWithFarmerIds)
      .select()
    
    if (productsError) throw productsError
    console.log('Inserted products:', products)
    
    // Insert vendors
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .insert(sampleVendors)
      .select()
    
    if (vendorsError) throw vendorsError
    console.log('Inserted vendors:', vendors)
    
    return { farmers, products, vendors }
  } catch (error) {
    console.error('Error populating sample data:', error)
    throw error
  }
} 