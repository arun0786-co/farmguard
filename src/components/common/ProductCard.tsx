import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  category?: string;
  stock: number;
  status?: 'active' | 'inactive';
  showControls?: boolean;
  onAddToCart?: (id: string) => void;
  onUpdateStatus?: (id: string, status: 'active' | 'inactive') => void;
  onDelete?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  unit,
  description,
  image,
  category,
  stock,
  status,
  showControls = false,
  onAddToCart,
  onUpdateStatus,
  onDelete
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-green-600 font-medium">₹{price.toLocaleString('en-IN')} {unit}</p>
          </div>
          {(status || category) && (
            <div className="flex flex-col items-end space-y-2">
              {status && (
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {status}
                </span>
              )}
              {category && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {category}
                </span>
              )}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <p className="mt-2 text-sm text-gray-600">Stock: {stock} units</p>
        
        <div className="mt-4 flex justify-between">
          {showControls ? (
            <>
              {onUpdateStatus && status && (
                <button
                  onClick={() => onUpdateStatus(id, status === 'active' ? 'inactive' : 'active')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    status === 'active'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                >
                  Delete
                </button>
              )}
            </>
          ) : (
            onAddToCart && (
              <button
                onClick={() => onAddToCart(id)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Add to Cart
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
} 