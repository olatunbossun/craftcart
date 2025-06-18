const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
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
      return user.populate('products').execPopulate().then(u => u.products);
    },
    orders: (user) => {
      return user.populate('orders').execPopulate().then(u => u.orders);
    },
    reviews: (user) => {
      return user.populate('reviews').execPopulate().then(u => u.reviews);
    }
  }
};