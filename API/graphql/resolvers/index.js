const authResolvers = require('./auth');
const productResolvers = require('./products');
const categoryResolvers = require('./categories');
const orderResolvers = require('./orders'); 
const reviewResolvers = require('./reviews');

const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...productResolvers.Query,
    ...categoryResolvers.Query,
    ...orderResolvers.Query, 
    ...reviewResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...productResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...orderResolvers.Mutation, // This line was missing
    ...reviewResolvers.Mutation,
  },
};

module.exports = resolvers;