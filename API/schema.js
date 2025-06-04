const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum UserRole {
    Buyer
    Artisan
    Admin
  }

   type User {
    _id: ID!
    name: String!
    email: String!
    role: UserRole!
    profile_image: String
    createdAt: String 
  }

  type Product {
    _id: ID!
    artisan: User! 
    name: String!
    description: String!
    price: Float! 
    quantity: Int!
    image_url: String
    category: Category!
    createdAt: String 
  }

  type Category {
    _id: ID!
    name: String!
  }

  input UserRegisterInput {
    name: String!
    email: String!
    password: String!
    role: UserRole 
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  input ProductCreateInput {
    name: String!
    description: String!
    price: Float!
    quantity: Int!
    image_url: String
    categoryId: ID! 
  }

  input CategoryCreateInput {
    name: String!
  }


  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {

    getUser(id: ID!): User
    getAllUsers: [User]

    getProduct(id: ID!): Product
    getAllProducts: [Product]
    getProductsByCategory(categoryId: ID!): [Product]

    getCategory(id: ID!): Category
    getAllCategories: [Category]
  }


  type Mutation {

    registerUser(input: UserRegisterInput!): AuthPayload!
    loginUser(input: UserLoginInput!): AuthPayload!

    createProduct(input: ProductCreateInput!): Product!
    createCategory(input: CategoryCreateInput!): Category! 
   
  }
`;

module.exports = typeDefs;