'use client';

import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image: string;
  status?: 'active' | 'inactive';
  stock?: number;
}

interface ProductGridProps {
  products: Product[];
  showControls?: boolean;
  onUpdateStatus?: (id: string, status: 'active' | 'inactive') => void;
  onDelete?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  showControls = false,
  onUpdateStatus,
  onDelete,
  onAddToCart,
  emptyMessage = 'No products available.'
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48">
            <Image
              src={product.image || '/placeholder-product.jpg'}
              alt={`Product image of ${product.name}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-green-600 font-medium">₹{product.price} {product.unit}</p>
              </div>
              {product.status && (
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.status}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">{product.description}</p>
            {product.stock !== undefined && (
              <p className="mt-2 text-sm text-gray-600">Stock: {product.stock} units</p>
            )}
            
            <div className="mt-4 flex justify-between">
              {showControls ? (
                <>
                  {onUpdateStatus && (
                    <button
                      onClick={() => onUpdateStatus(
                        product.id,
                        product.status === 'active' ? 'inactive' : 'active'
                      )}
                      className={`px-3 py-1 rounded-md text-sm ${
                        product.status === 'active'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {product.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(product.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </>
              ) : (
                onAddToCart && (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Add to Cart
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 