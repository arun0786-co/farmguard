interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  isWholesale: boolean;
  minOrderQty?: number;
  image: string;
  farmerName: string;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  quantity,
  unit,
  category,
  isWholesale,
  minOrderQty,
  image,
  farmerName,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {isWholesale && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
            Wholesale
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="text-green-600 font-bold">
            ₹{price}/{unit}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {description}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>Category: {category}</span>
          <span>Available: {quantity} {unit}</span>
        </div>

        {isWholesale && minOrderQty && (
          <div className="text-sm text-blue-600 mb-3">
            Minimum order: {minOrderQty} {unit}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Farmer: {farmerName}
          </span>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => {
              // Handle order/add to cart
              console.log('Order clicked for product:', id);
            }}
          >
            {isWholesale ? 'Enquire' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
} 