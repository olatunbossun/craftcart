import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      imageUrl
      category {
        name
      }
      artisan {
        name
      }
    }
  }
`;

export default function ProductList() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.products.map(product => (
        <div key={product.id} className="border rounded-lg overflow-hidden">
          <img 
            src={product.imageUrl || '/placeholder-product.jpg'} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <p className="text-sm text-gray-500">
              {product.category.name} • By {product.artisan.name}
            </p>
            <Link 
              to={`/products/${product.id}`}
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}