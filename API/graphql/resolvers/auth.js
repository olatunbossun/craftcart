const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { AuthenticationError } = require('apollo-server-express');

module.exports = {
  Query: {
    me: (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return User.findById(user.id)
        .populate('products orders reviews');
    },
    user: (_, { id }) => User.findById(id)
      .populate('products orders reviews'),
    users: () => User.find().populate('products orders reviews')
  },

  Mutation: {
    register: async (_, { input }) => {
      const { email, password, ...rest } = input;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        ...rest,
        email,
        password: hashedPassword
      });

      await user.save();

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { token, user };
    },

    login: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { token, user };
    }
  },

  User: {
    products: (user) => {
      if (user.products && user.products.length > 0 && typeof user.products[0] === 'object') {
        return user.products;
      }
      return User.findById(user._id).populate('products').then(u => u.products);
    },
    orders: (user) => {
      if (user.orders && user.orders.length > 0 && typeof user.orders[0] === 'object') {
        return user.orders;
      }
      return User.findById(user._id).populate('orders').then(u => u.orders);
    },
    reviews: (user) => {
      if (user.reviews && user.reviews.length > 0 && typeof user.reviews[0] === 'object') {
        return user.reviews;
      }
      return User.findById(user._id).populate('reviews').then(u => u.reviews);
    }
  }
};