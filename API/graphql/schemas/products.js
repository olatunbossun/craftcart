const { gql } = require('apollo-server-express');

module.exports = gql`
  enum SortOrder {
    ASC
    DESC
  }

  # Forward declaration for Sale type
  type Sale {
    id: ID!
    discountPercentage: Float!
    discountAmount: Float!
    salePrice: Float!
    startDate: Date!
    endDate: Date!
    isActive: Boolean!
    description: String
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    quantity: Int!
    images: [String!]!
    category: Category!
    artisan: User!
    reviews: [Review!]
    createdAt: Date!
    updatedAt: Date!
    # Sale-related fields
    currentSale: Sale
    salePrice: Float
    discountPercentage: Float
    isOnSale: Boolean!
    effectivePrice: Float!
    discountAmount: Float!
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
    quantity: Int!
    categoryId: ID!
    images: [String!]
  }

  input ProductUpdateInput {
    name: String
    description: String
    price: Float
    quantity: Int
    categoryId: ID
    images: [String!]
  }

  input ProductFilter {
    categoryId: ID
    artisanId: ID
    minPrice: Float
    maxPrice: Float
    searchQuery: String
    sortByPrice: SortOrder
    onSale: Boolean
  }

  extend type Query {
    products(filter: ProductFilter): [Product!]!
    product(id: ID!): Product
    featuredProducts(limit: Int = 5): [Product!]!
    productsByPrice(sortOrder: SortOrder!, limit: Int): [Product!]!
    productsOnSale(limit: Int): [Product!]!
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;