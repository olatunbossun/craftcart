const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const { Product, Category } = require('../../models');

module.exports = {
  Query: {
    products: async (_, { filter = {} }) => {
      console.log('🔍 Products query called with filter:', filter);
      
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

      // Filter by sale status
      if (filter.onSale !== undefined) {
        query.isOnSale = filter.onSale;
      }
      
      console.log('🔍 MongoDB query:', JSON.stringify(query));
      
      // Build the query
      let productQuery = Product.find(query);
      
      // Apply sorting if specified
      if (filter.sortByPrice) {
        const sortOrder = filter.sortByPrice === 'ASC' ? 1 : -1;
        console.log('🔍 Applying sort by price:', filter.sortByPrice, 'direction:', sortOrder);
        productQuery = productQuery.sort({ price: sortOrder });
      }
      
      const results = await productQuery.populate('category artisan reviews currentSale');
      console.log('✅ Found', results.length, 'products');
      
      return results;
    },

    product: async (_, { id }) => {
      try {
        console.log('🔍 Fetching product with ID:', id);
        const product = await Product.findById(id).populate('category artisan reviews currentSale');
        console.log('✅ Product found:', product ? 'Yes' : 'No');
        return product;
      } catch (error) {
        console.error('❌ Error fetching product:', error.message);
        throw error;
      }
    },

    featuredProducts: (_, { limit }) => Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('category artisan currentSale'),

    productsByPrice: async (_, { sortOrder, limit }) => {
      console.log('🔍 productsByPrice called with sortOrder:', sortOrder, 'limit:', limit);
      
      const sortDirection = sortOrder === 'ASC' ? 1 : -1;
      console.log('🔍 Sort direction:', sortDirection);
      
      let query = Product.find()
        .sort({ price: sortDirection })
        .populate('category artisan reviews currentSale');
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const results = await query;
      console.log('✅ productsByPrice found', results.length, 'products');
      
      return results;
    },

    productsOnSale: async (_, { limit }) => {
      let query = Product.find({ isOnSale: true })
        .populate('category artisan currentSale')
        .sort({ discountPercentage: -1 }); // Show highest discounts first
      
      if (limit) {
        query = query.limit(limit);
      }
      
      return query;
    }
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
      return Product.findById(product._id).populate('category artisan');
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