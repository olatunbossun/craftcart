const { gql } = require('apollo-server-express');
const authSchema = require('./auth');
const productSchema = require('./products');
const categorySchema = require('./categories');
const orderSchema = require('./orders');
const reviewSchema = require('./reviews');
const saleSchema = require('./sales');

const baseSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  enum Role {
    BUYER
    ARTISAN
    ADMIN
  }
`;

module.exports = [
  baseSchema,
  authSchema,
  productSchema,
  categorySchema,
  orderSchema,
  reviewSchema,
  saleSchema
];