const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const Product = require('../../models/Product');
const Category = require('../../models/Category');

module.exports = {
  Query: {
    products: async (_, { filter = {} }) => {
      const query = {};
      
      if (filter.categoryId) {
        query.category = filter.categoryId;
      }
      
      if (filter.artisanId) {
        query.artisan = filter.artisanId;
      }
      
      if (filter.minPrice || filter.maxPrice) {
        query.price = {};
        if (filter.minPrice) query.price.$gte = filter.minPrice;
        if (filter.maxPrice) query.price.$lte = filter.maxPrice;
      }
      
      if (filter.searchQuery) {
        query.$text = { $search: filter.searchQuery };
      }
      
      return Product.find(query)
        .populate('category artisan reviews');
    },

    product: (_, { id }) => Product.findById(id)
      .populate('category artisan reviews'),

    featuredProducts: (_, { limit }) => Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('category artisan')
  },

  Mutation: {
    createProduct: async (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      if (user.role !== 'ARTISAN') {
        throw new ForbiddenError('Only artisans can create products');
      }

      const category = await Category.findById(input.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      const product = new Product({
        ...input,
        artisan: user.id,
        category: input.categoryId
      });

      await product.save();
      return product.populate('category artisan').execPopulate();
    },

    updateProduct: async (_, { id, input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      if (user.role !== 'ADMIN' && product.artisan.toString() !== user.id) {
        throw new ForbiddenError('Not authorized to update this product');
      }

      if (input.categoryId) {
        const category = await Category.findById(input.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }
        input.category = input.categoryId;
        delete input.categoryId;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { ...input, updatedAt: new Date() },
        { new: true }
      ).populate('category artisan');

      return updatedProduct;
    },

    deleteProduct: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      if (user.role !== 'ADMIN' && product.artisan.toString() !== user.id) {
        throw new ForbiddenError('Not authorized to delete this product');
      }

      await Product.findByIdAndDelete(id);
      return true;
    }
  },

  Product: {
    reviews: (product) => {
      return product.populate('reviews').execPopulate().then(p => p.reviews);
    }
  }
};