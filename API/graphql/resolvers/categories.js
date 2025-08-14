const { Category } = require('../../models');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
    categories: () => Category.find().populate('products'),
    category: (_, { id }) => Category.findById(id).populate('products')
  },
  Mutation: {
    createCategory: (_, { input }, { user }) => {
      if (!user || user.role !== 'ADMIN') {
        throw new AuthenticationError('Not authorized');
      }
      const category = new Category(input);
      return category.save();
    },
    // ... other category mutations
  },
  Category: {
    products: category => {
      return category.populate('products').execPopulate().then(c => c.products);
    }
  }
};