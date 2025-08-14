const authResolvers = require('./auth');
const productResolvers = require('./products');
const categoryResolvers = require('./categories');
const orderResolvers = require('./orders'); 
const reviewResolvers = require('./reviews');
const saleResolvers = require('./sales');

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query,
    ...orderResolvers.Query, 
    ...reviewResolvers.Query,
    ...saleResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...orderResolvers.Mutation, // This line was missing
    ...reviewResolvers.Mutation,
    ...saleResolvers.Mutation,
  },
};

module.exports = resolvers;