import React from 'react';
import { Link } from 'react-router-dom';
import ProductTable from './components/ProductTable';

const API_URL = "http://localhost:4999/graphql";
const initialProducts = [
  { 
    id: 1, 
    name: "Handwoven Basket", 
    description: "Beautiful handmade basket from local reeds",
    price: 45.99,
    category: "Home Decor",
    artisan: "Amir Khan",
    imageUrl: "/images/basket.jpg",
    stock: 10
  },
  { 
    id: 2, 
    name: "Ceramic Mug", 
    description: "Artisan ceramic mug with unique glaze",
    price: 25.50,
    category: "Kitchenware",
    artisan: "Adam Smith",
    imageUrl: "/images/mug.jpg",
    stock: 15
  }
];

class ProductDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: initialProducts,
      filteredProducts: initialProducts,
      loading: false,
      error: null
    };
    this.searchProducts = this.searchProducts.bind(this);
  }

  async loadProducts() {
    try {
      this.setState({ loading: true });
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query {
            getProducts {
              id name description price
              category artisan imageUrl stock
            }
          }`
        })
      });

      const result = await response.json();
      
      if (result.errors) throw new Error(result.errors[0].message);
      
      this.setState({ 
        products: result.data?.getProducts || initialProducts,
        filteredProducts: result.data?.getProducts || initialProducts,
        loading: false
      });
    } catch (error) {
      this.setState({ 
        error: error.message,
        loading: false
      });
    }
  }

  componentDidMount() {
    this.loadProducts();
  }

  searchProducts(searchText) {
    const filtered = this.state.products.filter(product => 
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category.toLowerCase().includes(searchText.toLowerCase())
    );
    this.setState({ filteredProducts: filtered });
  }

  render() {
    return (
      <div className="product-directory" style={{ padding: '20px' }}>
        <h1>CraftCart Marketplace</h1>
        <div className="search-container" style={{ marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            onChange={(e) => this.searchProducts(e.target.value)}
            style={{ padding: '8px', width: '300px' }}
          />
        </div>
        {this.state.error && (
          <div style={{ color: 'red', margin: '10px 0' }}>{this.state.error}</div>
        )}
        {this.state.loading ? (
          <p>Loading products...</p>
        ) : (
          <ProductTable products={this.state.filteredProducts} />
        )}
      </div>
    );
  }
}

export default ProductDirectory;